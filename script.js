document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key - THIS IS THE CRITICAL ADDITION
    emailjs.init("PHIPw2v6kPGnezFrq"); // Replace with your actual EmailJS public key
    
    // Initialize shopping cart and purchases
    let cart = [];
    let purchases = [];
    
    // Email configuration for sending order notifications
    const STORE_EMAIL = "coconutch.oil.01@gmail.com"; // Your email to receive orders
    
    // Try to load cart and purchases from localStorage
    try {
        if (localStorage.getItem('coconutchCart')) {
            cart = JSON.parse(localStorage.getItem('coconutchCart'));
        }
        
        if (localStorage.getItem('coconutchPurchases')) {
            purchases = JSON.parse(localStorage.getItem('coconutchPurchases'));
        }
    } catch (e) {
        console.error('Error loading data from localStorage:', e);
        // Reset if there's an error
        cart = [];
        purchases = [];
    }
    
    // Update cart count on load
    updateCartCount();
    
    // Load purchases
    updatePurchasesDisplay();
    
    // Logo click refresh
    const homeLogo = document.getElementById('home-logo');
    if (homeLogo) {
        homeLogo.addEventListener('click', function() {
            // Refresh page and go to home tab
            location.reload();
        });
    }
    
    // Tab navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));
            // Add active class to clicked menu item
            this.classList.add('active');
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the selected content section
            const targetSection = document.getElementById(this.dataset.section);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // Product image click for product details
    const productImages = document.querySelectorAll('.product-image');
    const productDetailModal = document.getElementById('productDetailModal');
    
    if (productDetailModal) {
        const productDetailCloseButton = productDetailModal.querySelector('.close-button');
        
        productImages.forEach(image => {
            image.addEventListener('click', function() {
                const productName = this.dataset.product;
                openProductDetailModal(productName);
            });
        });
        
        if (productDetailCloseButton) {
            productDetailCloseButton.addEventListener('click', function() {
                productDetailModal.style.display = 'none';
            });
        }
    }
    
    // Shop buttons
    const shopNowButtons = document.querySelectorAll('.shop-now');
    shopNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get target section
            const targetSection = this.dataset.target;
            
            // Remove active class from all menu items
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // Add active class to target menu item
            const targetMenuItem = document.querySelector(`.menu-item[data-section="${targetSection}"]`);
            if (targetMenuItem) {
                targetMenuItem.classList.add('active');
            }
            
            // Hide all content sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            const productsSection = document.getElementById(targetSection);
            if (productsSection) {
                productsSection.classList.add('active');
            }
        });
    });
    
    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.dataset.product;
            const price = parseFloat(this.dataset.price);
            
            // Check if product already exists in cart
            const existingProductIndex = cart.findIndex(item => item.product === product);
            
            if (existingProductIndex !== -1) {
                // Increment quantity if product already in cart
                cart[existingProductIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    product: product,
                    price: price,
                    quantity: 1
                });
            }
            
            // Update cart count
            updateCartCount();
            
            // Save cart to localStorage
            saveCart();
            
            // Show notification instead of alert
            showCartNotification(`${product} added to cart!`);
        });
    });
    
    // Buy Now buttons
    const buyNowButtons = document.querySelectorAll('.buy-now');
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get parent product card
            const productCard = this.closest('.product-card');
            if (!productCard) return;
            
            const productName = productCard.querySelector('h3').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('₱', ''));
            
            // Clear cart and add only this product
            cart = [{
                product: productName,
                price: price,
                quantity: 1
            }];
            
            // Update cart count
            updateCartCount();
            
            // Save cart to localStorage
            saveCart();
            
            // Open payment modal directly
            openPaymentModal();
        });
    });
    
    // View Cart button
    const viewCartButton = document.getElementById('view-cart');
    if (viewCartButton) {
        viewCartButton.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default behavior
            openCartModal();
        });
    }
    
    // Cart Modal
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        const cartCloseButton = cartModal.querySelector('.close-button');
        if (cartCloseButton) {
            cartCloseButton.addEventListener('click', function() {
                cartModal.style.display = 'none';
            });
        }
    }
    
    // Payment Modal
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        const paymentCloseButton = paymentModal.querySelector('.close-button');
        if (paymentCloseButton) {
            paymentCloseButton.addEventListener('click', function() {
                paymentModal.style.display = 'none';
            });
        }
    }
    
    // Checkout button in cart modal
    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length === 0) {
                showCartNotification('Your cart is empty!');
                return;
            }
            
            // Close cart modal and open payment modal
            if (cartModal) {
                cartModal.style.display = 'none';
            }
            openPaymentModal();
        });
    }
    
    // Payment method selection
    const paymentMethodRadios = document.querySelectorAll('input[name="payment-method"]');
    const gcashPaymentDiv = document.getElementById('gcash-payment');
    const codPaymentDiv = document.getElementById('cod-payment');
    const gcashReferenceGroup = document.getElementById('gcash-reference-group');
    
    if (paymentMethodRadios.length && gcashPaymentDiv && codPaymentDiv && gcashReferenceGroup) {
        paymentMethodRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'gcash') {
                    gcashPaymentDiv.style.display = 'block';
                    codPaymentDiv.style.display = 'none';
                    gcashReferenceGroup.style.display = 'block';
                } else if (this.value === 'cod') {
                    gcashPaymentDiv.style.display = 'none';
                    codPaymentDiv.style.display = 'block';
                    gcashReferenceGroup.style.display = 'none';
                }
            });
        });
    }
    
    // Payment form submission
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            
            const paymentMethodChecked = document.querySelector('input[name="payment-method"]:checked');
            if (!paymentMethodChecked) {
                showCartNotification('Please select a payment method');
                return;
            }
            
            const paymentMethod = paymentMethodChecked.value;
            let gcashReference = '';
            
            // Validate GCash reference number if GCash is selected
            if (paymentMethod === 'gcash') {
                gcashReference = document.getElementById('gcash-reference').value;
                if (!gcashReference) {
                    showCartNotification('Please enter your GCash Reference Number');
                    return;
                }
            }
            
            // Create new purchase record
            const purchaseDate = new Date();
            const purchaseId = 'ORD-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            
            // Calculate total
            const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            
            const purchase = {
                id: purchaseId,
                date: purchaseDate.toISOString(),
                name: name,
                email: email,
                phone: phone,
                address: address,
                paymentMethod: paymentMethod,
                gcashReference: gcashReference,
                items: JSON.parse(JSON.stringify(cart)),
                status: 'Processing',
                total: total
            };
            
            // Show loading indicator
            showCartNotification('Processing your order...');
            
            try {
                // Send admin notification email using EmailJS
                await sendOrderNotificationEmail(purchase);
                
                // If customer provided an email, send confirmation email
                if (email) {
                    try {
                        await sendCustomerConfirmationEmail(purchase);
                    } catch (confirmationError) {
                        console.error('Failed to send customer confirmation email:', confirmationError);
                        // Continue processing the order even if confirmation email fails
                    }
                }
                
                // Add purchase to local purchases
                purchases.unshift(purchase);
                localStorage.setItem('coconutchPurchases', JSON.stringify(purchases));
                
                showCartNotification(`Thank you for your order, ${name}! Your order #${purchase.id} has been received.`);
                
                // Update purchases display
                updatePurchasesDisplay();
                
                // Clear cart and close modal
                cart = [];
                updateCartCount();
                if (paymentModal) {
                    paymentModal.style.display = 'none';
                }
                
                // Save empty cart to localStorage
                saveCart();
                
                // Reset form
                paymentForm.reset();
            } catch (error) {
                console.error('Failed to send order notification:', error);
                
                // Still save the purchase locally
                purchases.unshift(purchase);
                localStorage.setItem('coconutchPurchases', JSON.stringify(purchases));
                
                showCartNotification('Your order is saved! We will process it soon.');
                
                // Update purchases display
                updatePurchasesDisplay();
                
                // Clear cart and close modal
                cart = [];
                updateCartCount();
                if (paymentModal) {
                    paymentModal.style.display = 'none';
                }
                
                // Save empty cart to localStorage
                saveCart();
                
                // Reset form
                paymentForm.reset();
            }
        });
    }
    
    // Send order notification email to admin
    async function sendOrderNotificationEmail(purchase) {
        // Format items for email
        let itemsList = '';
        purchase.items.forEach(item => {
            itemsList += `${item.product} - ₱${item.price.toFixed(2)} x ${item.quantity} = ₱${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        const templateParams = {
            order_id: purchase.id,
            customer_name: purchase.name,
            customer_email: purchase.email || 'Not provided', // Handle empty email
            customer_phone: purchase.phone || 'N/A',
            customer_address: purchase.address,
            payment_method: purchase.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery',
            gcash_reference: purchase.gcashReference || 'N/A',
            items: itemsList,
            total_amount: `₱${purchase.total.toFixed(2)}`,
            to: STORE_EMAIL,
            from_name: purchase.name,
            from_email: purchase.email || STORE_EMAIL // Use store email as fallback if customer email is not provided
        };
        
        console.log("Email params:", templateParams);
        
        try {
            // Send the email with EmailJS
            const response = await emailjs.send('service_h0q015j', 'template_yrwygnh', templateParams);
            console.log('Email sent successfully:', response);
            return response;
        } catch (error) {
            console.error('EmailJS error details:', error);
            throw error;
        }
    }
    
    // Send confirmation email to customer
async function sendCustomerConfirmationEmail(purchase) {
    // Only send if customer provided an email
    if (!purchase.email) {
        console.log('No customer email provided, skipping confirmation email');
        return null;
    }
    
    // Format items for email
    let itemsList = '';
    purchase.items.forEach(item => {
        itemsList += `${item.product} - ₱${item.price.toFixed(2)} x ${item.quantity} = ₱${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    // These MUST match the exact variable names in your EmailJS template
    const templateParams = {
        customer_name: purchase.name,
        order_id: purchase.id,
        items: itemsList,
        total_amount: `₱${purchase.total.toFixed(2)}`,
        delivery_address: purchase.address,
        payment_method: purchase.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery',
        to: purchase.email, // This is critical - it tells EmailJS where to send the email
        from_name: 'Coconutch', // The sender name that will appear
        reply_to: STORE_EMAIL // Allow replies to go back to your store email
    };
    
    console.log("Customer confirmation email params:", templateParams);
    
    try {
        // Send the email with EmailJS
        const response = await emailjs.send('service_h0q015j', 'template_e45zxwc', templateParams);
        console.log('Customer confirmation email sent successfully:', response);
        return response;
    } catch (error) {
        console.error('EmailJS error when sending customer confirmation:', error);
        console.error('Error details:', JSON.stringify(error)); // Log the full error details
        throw error;
    }
}
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (cartModal && event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (paymentModal && event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
        if (productDetailModal && event.target === productDetailModal) {
            productDetailModal.style.display = 'none';
        }
    });
    
    // Helper Functions
    function saveCart() {
        try {
            localStorage.setItem('coconutchCart', JSON.stringify(cart));
        } catch (e) {
            console.error('Error saving cart to localStorage:', e);
            showCartNotification('Failed to save cart. Please check your browser settings.');
        }
    }
    
    function updateCartCount() {
        // Calculate total items in cart
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Cart notification
    const cartNotification = document.getElementById('cartNotification');
    
    function showCartNotification(message) {
        if (!cartNotification) return;
        
        const notificationMessage = document.getElementById('notification-message');
        if (notificationMessage) {
            notificationMessage.textContent = message;
            
            // Show notification
            cartNotification.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(function() {
                cartNotification.classList.remove('show');
            }, 3000);
        }
    }
    
    function openCartModal() {
        if (!cartModal) return;
        
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (!cartItemsContainer || !cartTotalElement) return;
        
        // Clear previous items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalElement.textContent = 'Total: ₱0.00';
        } else {
            // Calculate total price
            let totalPrice = 0;
            
            // Add each item to the cart modal
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.product}</div>
                        <div class="cart-item-price">₱${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                        <button class="quantity-btn increase-quantity" data-index="${index}">+</button>
                    </div>
                    <div class="cart-item-total">₱${itemTotal.toFixed(2)}</div>
                    <button class="remove-item" data-index="${index}">×</button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Update total price
            cartTotalElement.textContent = `Total: ₱${totalPrice.toFixed(2)}`;
            
            // Add event listeners for quantity buttons AFTER elements are added to the DOM
            addCartItemEventListeners();
        }
        
        cartModal.style.display = 'block';
    }
    
    function addCartItemEventListeners() {
        // Using event delegation for cart item interactions
        document.getElementById('cart-items')?.addEventListener('click', function(e) {
            const target = e.target;
            
            // Check if decrease button is clicked
            if (target.classList.contains('decrease-quantity')) {
                const index = parseInt(target.dataset.index);
                if (cart[index] && cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    updateCartDisplay();
                    saveCart();
                }
            }
            
            // Check if increase button is clicked
            if (target.classList.contains('increase-quantity')) {
                const index = parseInt(target.dataset.index);
                if (cart[index]) {
                    cart[index].quantity += 1;
                    updateCartDisplay();
                    saveCart();
                }
            }
            
            // Check if remove button is clicked
            if (target.classList.contains('remove-item')) {
                const index = parseInt(target.dataset.index);
                if (index >= 0 && index < cart.length) {
                    cart.splice(index, 1);
                    updateCartDisplay();
                    updateCartCount();
                    saveCart();
                }
            }
        });
        
        // Using event delegation for quantity inputs
        document.getElementById('cart-items')?.addEventListener('change', function(e) {
            const target = e.target;
            
            // Check if quantity input is changed
            if (target.classList.contains('quantity-input')) {
                const index = parseInt(target.dataset.index);
                const newQuantity = parseInt(target.value);
                
                if (isNaN(newQuantity) || newQuantity < 1) {
                    target.value = cart[index].quantity;
                    return;
                }
                
                if (cart[index]) {
                    cart[index].quantity = newQuantity;
                    updateCartDisplay();
                    saveCart();
                }
            }
        });
    }
    
    function updateCartDisplay() {
        // Re-open the cart modal to refresh the display
        openCartModal();
    }
    
    function openPaymentModal() {
        if (!paymentModal) return;
        
        // Calculate total price for payment confirmation
        const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        // Display the payment modal
        paymentModal.style.display = 'block';
    }
    
    function openProductDetailModal(productName) {
        if (!productDetailModal) return;
        
     // Update the product database with your new products
const productDetails = {
    'Pure Coconut Oil': {
        name: 'PURE COCONUT OIL',
        price: 60.00,
        description: 'Our 100% pure coconut oil is cold-pressed to preserve all natural nutrients and benefits. This versatile product can be used for skin moisturizing, hair conditioning, and even as a natural makeup remover. Free from additives, preservatives, and artificial fragrances.',
        benefits: ['Natural moisturizer for skin and hair', 'Helps reduce appearance of fine lines', 'Suitable for all skin types', 'Antimicrobial properties'],
        size: '10ml',
        ingredients: 'Pure, virgin coconut oil (Cocos nucifera)'
    },
    'Lemongrass Coconut Oil': {
        name: 'LEMONGRASS COCONUT OIL',
        price: 65.00,
        description: 'Our lemongrass-infused coconut oil combines the nourishing properties of coconut oil with refreshing lemongrass essence. This invigorating blend helps enhance relaxation while promoting skin health and providing a pleasant citrus aroma.',
        benefits: ['Natural mood enhancer', 'Promotes relaxation', 'Helps repel insects', 'Refreshing citrus scent'],
        size: '10ml',
        ingredients: 'Virgin coconut oil (Cocos nucifera), Lemongrass essential oil (Cymbopogon)'
    },
    'Origanum Coconut Oil': {
        name: 'ORIGANUM COCONUT OIL',
        price: 65.00,
        description: 'This specialty blend combines the moisturizing benefits of coconut oil with origanum (oregano) for a powerful wellness boost. Oregano is known for its strong antimicrobial properties, making this oil perfect for massage during cold season or for soothing muscle discomfort.',
        benefits: ['Powerful natural antiseptic', 'Immune-boosting properties', 'Soothes tired muscles', 'Warming sensation'],
        size: '10ml',
        ingredients: 'Virgin coconut oil (Cocos nucifera), Origanum (Oregano) essential oil (Origanum vulgare)'
    },
    'Peppermint Coconut Oil': {
        name: 'PEPPERMINT COCONUT OIL',
        price: 80.00,
        description: 'Our premium peppermint-infused coconut oil delivers a cooling sensation perfect for relieving muscle tension and easing headaches. The refreshing scent helps clear the mind while the coconut oil base delivers deep hydration to the skin.',
        benefits: ['Cooling sensation', 'Relieves muscle tension', 'Helps ease headaches', 'Mental clarity and focus'],
        size: '10ml',
        ingredients: 'Virgin coconut oil (Cocos nucifera), Peppermint essential oil (Mentha piperita)'
    },
    // Adding the new products
    'Lavender Coconut Oil': {
        name: 'LAVENDER COCONUT OIL',
        price: 50.00,
        description: 'Our Lavender-Infused Coconut Oil roll-on offers soothing relief with every swipe. Infused with calming lavender and pure coconut oil, it\'s ideal for relaxing the mind, easing tension, and supporting overall wellness.',
        benefits: ['Eases headaches', 'Reduces stress and anxiety', 'Relieves muscle tension'],
        size: '10ml',
        ingredients: 'Virgin coconut oil (Cocos nucifera), Lavender essential oil (Lavandula angustifolia)',
    },
    'Rosemary Coconut Oil': {
        name: 'ROSEMARY COCONUT OIL',
        price: 50.00,
        description: 'Our Rosemary-Infused Coconut Oil roll-on is a refreshing blend that supports respiratory ease, mental clarity, and scalp wellness. A perfect all-natural companion for daily use.',
        benefits: ['Eases sinus congestion', 'Improves circulation', 'Supports scalp circulation and hair health'],
        size: '10ml',
        ingredients: 'Virgin coconut oil (Cocos nucifera), Rosemary essential oil (Rosmarinus officinalis)',
    }
};
        
        // Get product info
        const product = productDetails[productName];
        if (!product) return;
        
        // Get product detail container
        const productDetailContainer = document.getElementById('product-detail-container');
        if (!productDetailContainer) return;
        
        // Replace spaces with hyphens and convert to lowercase for image filename
        const imageFileName = productName.toLowerCase().replace(/ /g, '-');
        
        productDetailContainer.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-top">
                    <div class="product-detail-image">
                        <img src="images/${imageFileName}.jpg" alt="${product.name}">
                    </div>
                    <div class="product-detail-info">
                        <h2 class="product-detail-title">${product.name}</h2>
                        <div class="product-detail-price">₱${product.price.toFixed(2)}</div>
                        <p class="product-detail-description">${product.description}</p>
                        <div class="product-detail-actions">
                            <button class="add-to-cart" data-product="${productName}" data-price="${product.price}">ADD TO CART</button>
                            <button class="buy-now">BUY NOW</button>
                        </div>
                    </div>
                </div>
                
                <div class="product-detail-meta">
                    <div class="meta-item">
                        <div class="meta-label">Size:</div>
                        <div class="meta-value">${product.size}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Ingredients:</div>
                        <div class="meta-value">${product.ingredients}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Benefits:</div>
                        <div class="meta-value">
                            <ul class="benefits-list">
                                ${product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners to the new buttons
        const addToCartButton = productDetailContainer.querySelector('.add-to-cart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                const product = this.dataset.product;
                const price = parseFloat(this.dataset.price);
                
                // Check if product already exists in cart
                const existingProductIndex = cart.findIndex(item => item.product === product);
                
                if (existingProductIndex !== -1) {
                    // Increment quantity if product already in cart
                    cart[existingProductIndex].quantity += 1;
                } else {
                    // Add new item to cart
                    cart.push({
                        product: product,
                        price: price,
                        quantity: 1
                    });
                }
                
                // Update cart count
                updateCartCount();
                
                // Save cart to localStorage
                saveCart();
                
                // Show notification
                showCartNotification(`${product} added to cart!`);
                
                // Close the product detail modal
                productDetailModal.style.display = 'none';
            });
        }
        
        const buyNowButton = productDetailContainer.querySelector('.buy-now');
        if (buyNowButton) {
            buyNowButton.addEventListener('click', function() {
                if (!addToCartButton) return;
                
                const product = addToCartButton.dataset.product;
                const price = parseFloat(addToCartButton.dataset.price);
                
                // Clear cart and add only this product
                cart = [{
                    product: product,
                    price: price,
                    quantity: 1
                }];
                
                // Update cart count
                updateCartCount();
                
                // Save cart to localStorage
                saveCart();
                
                // Close the product detail modal
                productDetailModal.style.display = 'none';
                
                // Open payment modal directly
                openPaymentModal();
            });
        }
        
        // Display the modal
        productDetailModal.style.display = 'block';
    }
    
    function updatePurchasesDisplay() {
        const purchasesList = document.getElementById('purchases-list');
        const noPurchasesMessage = document.getElementById('no-purchases-message');
        
        if (!purchasesList || !noPurchasesMessage) return;
        
        if (purchases.length === 0) {
            purchasesList.style.display = 'none';
            noPurchasesMessage.style.display = 'block';
        } else {
            purchasesList.style.display = 'block';
            noPurchasesMessage.style.display = 'none';
            
            // Clear the list
            purchasesList.innerHTML = '';
            
            // Process each purchase
            for (const purchase of purchases) {
                const purchaseDate = new Date(purchase.date);
                const formattedDate = purchaseDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                
                const purchaseElement = document.createElement('div');
                purchaseElement.className = 'purchase-item';
                
                let itemsList = '';
                purchase.items.forEach(item => {
                    itemsList += `
                        <div class="purchase-product">
                            <span class="purchase-product-name">${item.product}</span>
                            <span class="purchase-product-quantity">x${item.quantity}</span>
                            <span class="purchase-product-price">₱${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `;
                });
                
purchaseElement.innerHTML = `
                    <div class="purchase-header">
                        <div class="purchase-id">Order #${purchase.id}</div>
                        <div class="purchase-date">${formattedDate}</div>
                        <div class="purchase-status ${purchase.status.toLowerCase()}">${purchase.status}</div>
                    </div>
                    <div class="purchase-details">
                        <div class="purchase-products">
                            ${itemsList}
                        </div>
                        <div class="purchase-info">
                            <div class="purchase-info-item">
                                <span class="info-label">Total:</span>
                                <span class="info-value">₱${purchase.total.toFixed(2)}</span>
                            </div>
                            <div class="purchase-info-item">
                                <span class="info-label">Payment Method:</span>
                                <span class="info-value">${purchase.paymentMethod === 'gcash' ? 'GCash' : 'Cash on Delivery'}</span>
                            </div>
                            <div class="purchase-info-item">
                                <span class="info-label">Delivery Address:</span>
                                <span class="info-value">${purchase.address}</span>
                            </div>
                        </div>
                    </div>
                `;
                
                purchasesList.appendChild(purchaseElement);
            }
        }
    }
});