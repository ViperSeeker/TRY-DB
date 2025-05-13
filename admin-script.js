// Constants and global variables
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'admin123';

// Local storage keys
const STORAGE_KEYS = {
    ORDERS: 'coconutch_orders',
    PRODUCTS: 'coconutch_products',
    CUSTOMERS: 'coconutch_customers',
    LOGGED_IN: 'isLoggedIn',
    ADMIN_USERNAME: 'adminUsername'
};

// DOM selectors
const selectors = {
    // Common elements
    body: document.body,
    
    // Login page elements
    loginForm: document.getElementById('login-form'),
    loginError: document.getElementById('login-error'),
    
    // Dashboard elements
    adminName: document.getElementById('admin-name'),
    currentDate: document.getElementById('current-date'),
    logoutBtn: document.getElementById('logout-btn'),
    navLinks: document.querySelectorAll('.admin-nav a'),
    contentSections: document.querySelectorAll('.content-section'),
    viewAllBtn: document.querySelector('.view-all-btn'),
    
    // Products section
    addProductBtn: document.getElementById('add-product-btn'),
    productModal: document.getElementById('productModal'),
    productForm: document.getElementById('product-form'),
    productSearch: document.getElementById('product-search'),
    productFilter: document.getElementById('product-filter'),
    productsTable: document.getElementById('products-tbody'),
    productEditBtns: document.querySelectorAll('.edit-btn'),
    productDeleteBtns: document.querySelectorAll('.delete-btn'),
    
    // Orders section
    orderSearch: document.getElementById('order-search'),
    orderFilter: document.getElementById('order-filter'),
    ordersTable: document.getElementById('orders-tbody'),
    orderViewBtns: document.querySelectorAll('.view-btn'),
    orderViewModal: document.getElementById('orderViewModal'),
    
    // Customers section
    customerSearch: document.getElementById('customer-search'),
    customersTable: document.getElementById('customers-tbody'),
    
    // Settings section
    adminSettingsForm: document.getElementById('admin-settings-form'),
    storeSettingsForm: document.getElementById('store-settings-form'),
    
    // Modals
    modals: document.querySelectorAll('.modal'),
    closeButtons: document.querySelectorAll('.close-button'),
    cancelBtns: document.querySelectorAll('.cancel-btn')
};

// Check if current page is login or dashboard
const isLoginPage = document.querySelector('.login-body') !== null;

// Initialize the admin dashboard
function initAdminDashboard() {
    if (isLoginPage) {
        initLoginPage();
    } else {
        // Check if user is logged in
        if (!isLoggedIn()) {
            redirectToLogin();
        }
        initDashboardPage();
    }
}

// Initialize login page
function initLoginPage() {
    // Check if already logged in
    if (isLoggedIn()) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Add event listener to login form
    if (selectors.loginForm) {
        selectors.loginForm.addEventListener('submit', handleLogin);
    }
}

// Initialize dashboard page
function initDashboardPage() {
    // Initialize local storage data if not exists
    initializeLocalStorage();
    
    // Display admin name
    if (selectors.adminName) {
        selectors.adminName.textContent = localStorage.getItem(STORAGE_KEYS.ADMIN_USERNAME) || 'Admin';
    }
    
    // Display current date
    if (selectors.currentDate) {
        selectors.currentDate.textContent = formatDate(new Date());
    }
    
    // Add event listener to logout button
    if (selectors.logoutBtn) {
        selectors.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add event listeners to navigation links
    if (selectors.navLinks) {
        selectors.navLinks.forEach(link => {
            link.addEventListener('click', handleNavigation);
        });
    }
    
    // Add event listener to view all orders button
    if (selectors.viewAllBtn) {
        selectors.viewAllBtn.addEventListener('click', handleViewAllOrders);
    }
    
    // Add event listener to add product button
    if (selectors.addProductBtn) {
        selectors.addProductBtn.addEventListener('click', () => openModal('productModal'));
    }
    
    // Add event listeners to close buttons
    if (selectors.closeButtons) {
        selectors.closeButtons.forEach(btn => {
            btn.addEventListener('click', handleCloseModal);
        });
    }
    
    // Add event listeners to cancel buttons
    if (selectors.cancelBtns) {
        selectors.cancelBtns.forEach(btn => {
            btn.addEventListener('click', handleCloseModal);
        });
    }
    
    // Add event listener to product form
    if (selectors.productForm) {
        selectors.productForm.addEventListener('submit', handleProductSubmit);
    }
    
    // Add event listeners to settings forms
    if (selectors.adminSettingsForm) {
        selectors.adminSettingsForm.addEventListener('submit', handleAdminSettingsSubmit);
    }
    
    if (selectors.storeSettingsForm) {
        selectors.storeSettingsForm.addEventListener('submit', handleStoreSettingsSubmit);
    }
    
    // Add event listeners to search and filter inputs
    setupSearchAndFilters();
    
    // Setup image preview for product form
    setupImagePreview();
    
    // Load data and update dashboard
    loadAllData();
    updateDashboardStats();
    
    // Add event listener to update order status button
    const updateStatusBtn = document.getElementById('update-status-btn');
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', handleOrderStatusUpdate);
    }
}

// Initialize local storage with sample data if not exists
function initializeLocalStorage() {
    // Initialize products if not exists
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        const sampleProducts = [
            {
                id: 1,
                name: 'Pure Coconut Oil',
                price: 60.00,
                stock: 45,
                status: 'active',
                description: 'Pure virgin coconut oil',
                image: '../images/pure-coconut-oil.jpg'
            },
            {
                id: 2,
                name: 'Lemongrass Coconut Oil',
                price: 65.00,
                stock: 38,
                status: 'active',
                description: 'Coconut oil infused with lemongrass',
                image: '../images/lemongrass-coconut-oil.jpg'
            },
            {
                id: 3,
                name: 'Origanum Coconut Oil',
                price: 65.00,
                stock: 27,
                status: 'active',
                description: 'Coconut oil infused with origanum',
                image: '../images/origanum-coconut-oil.jpg'
            },
            {
                id: 4,
                name: 'Peppermint Coconut Oil',
                price: 80.00,
                stock: 32,
                status: 'active',
                description: 'Coconut oil infused with peppermint',
                image: '../images/peppermint-coconut-oil.jpg'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sampleProducts));
    }
    
// Make sure the resetProducts function is called during initialization
// Add this line to the end of your initializeLocalStorage function
function initializeLocalStorage() {
    // Initialize products if not exists
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
        const sampleProducts = [
            {
                id: 1,
                name: 'Pure Coconut Oil',
                price: 60.00,
                stock: 45,
                status: 'active',
                description: 'Pure virgin coconut oil',
                image: '../images/pure-coconut-oil.jpg'
            },
            {
                id: 2,
                name: 'Lemongrass Coconut Oil',
                price: 65.00,
                stock: 38,
                status: 'active',
                description: 'Coconut oil infused with lemongrass',
                image: '../images/lemongrass-coconut-oil.jpg'
            },
            {
                id: 3,
                name: 'Origanum Coconut Oil',
                price: 65.00,
                stock: 27,
                status: 'active',
                description: 'Coconut oil infused with origanum',
                image: '../images/origanum-coconut-oil.jpg'
            },
            {
                id: 4,
                name: 'Peppermint Coconut Oil',
                price: 80.00,
                stock: 32,
                status: 'active',
                description: 'Coconut oil infused with peppermint',
                image: '../images/peppermint-coconut-oil.jpg'
            },
            {
                id: 5,
                name: 'Rosemary-Infused Coconut Oil (Roll-On)',
                price: 50.00,
                stock: 30,
                status: 'active',
                description: 'Rosemary-Infused Coconut Oil',
                image: '../images/product-placeholder.jpg'
            },
            {
                id: 6,
                name: 'Lavender-Infused Coconut Oil (Roll-On)',
                price: 50.00,
                stock: 30,
                status: 'active',
                description: 'Lavender-Infused Coconut Oil',
                image: '../images/product-placeholder2.jpg'
            }
        ];
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sampleProducts));
    } else {
        // Force update all products to ensure new products are always included
        resetProducts();
    }
    
    // Initialize customers if not exists
    // ... rest of your existing code

    
    // Save new products array and update UI
    saveProducts(freshProducts);
    loadProducts();
    updateDashboardStats();
    updateTopProducts();
    
    console.log("Products reset to defaults + new products");
}
    // Initialize customers if not exists
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
        const sampleCustomers = [
            {
                id: 1,
                name: 'Maria Santos',
                email: 'maria.santos@email.com',
                phone: '0915-123-4567',
                address: '123 Mabini St., Brgy. San Jose, Quezon City',
                totalSpent: 1275.00,
                orderCount: 5
            },
            {
                id: 2,
                name: 'Juan Dela Cruz',
                email: 'juan.delacruz@email.com',
                phone: '0917-987-6543',
                address: '456 Rizal Ave., Brgy. Poblacion, Makati City',
                totalSpent: 890.00,
                orderCount: 3
            },
            {
                id: 3,
                name: 'Anna Reyes',
                email: 'anna.reyes@email.com',
                phone: '0919-456-7890',
                address: '789 Luna St., Brgy. Malaking Bato, Taguig City',
                totalSpent: 325.00,
                orderCount: 2
            },
        ];
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(sampleCustomers));
    }
    
    // Initialize orders if not exists
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
        const sampleOrders = [
            {
                id: 'CO-2025-042',
                customerId: 1,
                date: 'Apr 4, 2025',
                items: [
                    { productId: 1, name: 'Pure Coconut Oil', price: 60.00, quantity: 2, subtotal: 120.00 },
                    { productId: 2, name: 'Lemongrass Coconut Oil', price: 65.00, quantity: 3, subtotal: 195.00 },
                    { productId: 4, name: 'Peppermint Coconut Oil', price: 80.00, quantity: 1, subtotal: 80.00 }
                ],
                subtotal: 395.00,
                shipping: 55.00,
                total: 450.00,
                status: 'pending'
            },
            {
                id: 'CO-2025-041',
                customerId: 2,
                date: 'Apr 3, 2025',
                items: [
                    { productId: 1, name: 'Pure Coconut Oil', price: 60.00, quantity: 3, subtotal: 180.00 },
                    { productId: 3, name: 'Origanum Coconut Oil', price: 65.00, quantity: 1, subtotal: 65.00 }
                ],
                subtotal: 245.00,
                shipping: 80.00,
                total: 325.00,
                status: 'shipped'
            },
            {
                id: 'CO-2025-040',
                customerId: 3,
                date: 'Apr 2, 2025',
                items: [
                    { productId: 2, name: 'Lemongrass Coconut Oil', price: 65.00, quantity: 2, subtotal: 130.00 },
                    { productId: 4, name: 'Peppermint Coconut Oil', price: 80.00, quantity: 1, subtotal: 80.00 }
                ],
                subtotal: 210.00,
                shipping: 85.00,
                total: 295.00,
                status: 'delivered'
            
            }
        ];
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
    }
}

function sortOrdersByDate() {
  const ordersTbody = document.getElementById("orders-tbody");
  const orderRows = Array.from(ordersTbody.children);

  orderRows.sort((a, b) => {
    const dateA = new Date(a.querySelector(".order-date").textContent);
    const dateB = new Date(b.querySelector(".order-date").textContent);
    return dateB - dateA; // Newest orders at the top
  });

  orderRows.forEach(row => ordersTbody.appendChild(row));
}

function addOrder(order) {
  const ordersTbody = document.getElementById("orders-tbody");

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${order.id}</td>
    <td>${order.customer}</td>
    <td class="order-date">${order.date}</td>
    <td>${order.items}</td>
    <td>₱${order.total.toFixed(2)}</td>
    <td>${order.status}</td>
    <td><button onclick="editOrder('${order.id}')">Edit</button></td>
  `;

  ordersTbody.appendChild(row);
  sortOrdersByDate(); // Sort orders after adding a new order
}
// Load all data and update UI
function loadAllData() {
    loadProducts();
    loadOrders();
    loadCustomers();
    loadRecentOrders();
    updateTopProducts();
}

// Load products and update UI
function loadProducts() {
    const products = getProducts();
    const productsTable = document.getElementById('products-tbody');
    
    if (productsTable) {
        productsTable.innerHTML = '';
        
        products.forEach(product => {
            const row = createProductRow(product);
            productsTable.appendChild(row);
        });
        
        // Re-bind event listeners
        bindProductEventListeners();
    }
}

// Load orders and update UI
function loadOrders() {
    const orders = getOrders();

    // Sort orders by date in descending order (newest first)
    orders.sort((a, b) => new Date(b.date) - new Date(a.date));

    const ordersTable = document.getElementById('orders-tbody');
    
    if (ordersTable) {
        ordersTable.innerHTML = '';

        orders.forEach(order => {
            const row = createOrderRow(order);
            ordersTable.appendChild(row);
        });

        // Re-bind event listeners
        bindOrderEventListeners();
    }
}


// Load customers and update UI
function loadCustomers() {
    const customers = getCustomers();
    const customersTable = document.getElementById('customers-tbody');
    
    if (customersTable) {
        customersTable.innerHTML = '';
        
        customers.forEach(customer => {
            const row = createCustomerRow(customer);
            customersTable.appendChild(row);
        });
        
        // Re-bind event listeners
        bindCustomerEventListeners();
    }
}

// Load recent orders for dashboard
function loadRecentOrders() {
    const orders = getOrders();
    const recentOrdersTable = document.getElementById('recent-orders-tbody');
    
    if (recentOrdersTable) {
        recentOrdersTable.innerHTML = '';
        
        // Get 3 most recent orders
        const recentOrders = orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
        
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            const customer = getCustomerById(order.customerId);
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${customer ? customer.name : 'Unknown'}</td>
                <td>${order.date}</td>
                <td>₱${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td><button class="action-btn view-btn" data-id="${order.id}">View</button></td>
            `;
            
            recentOrdersTable.appendChild(row);
        });
        
        // Bind event listeners
        const viewBtns = recentOrdersTable.querySelectorAll('.view-btn');
        viewBtns.forEach(btn => {
            btn.addEventListener('click', handleOrderView);
        });
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    const orders = getOrders();
    const customers = getCustomers();
    const products = getProducts();
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
    
    // Update order count
    const orderCount = document.getElementById('orders-count');
    if (orderCount) {
        orderCount.textContent = orders.length;
    }
    
    // Update revenue
    const revenue = document.getElementById('revenue-value');
    if (revenue) {
        revenue.textContent = `₱${totalRevenue.toFixed(2)}`;
    }
    
    // Update customer count
    const customerCount = document.getElementById('customers-count');
    if (customerCount) {
        customerCount.textContent = customers.length;
    }
    
    // Update product count
    const productCount = document.getElementById('products-count');
    if (productCount) {
        productCount.textContent = products.filter(p => p.status === 'active').length;
    }
    
    // Update revenue display in dashboard
    const revenueTotal = document.getElementById('revenue-total');
    if (revenueTotal) {
        revenueTotal.textContent = `₱${totalRevenue.toFixed(2)}`;
    }
}

// Update top products chart
function updateTopProducts() {
    const orders = getOrders();
    const products = getProducts();
    
    // Calculate product sales
    const productSales = {};
    
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.productId]) {
                productSales[item.productId] = 0;
            }
            productSales[item.productId] += item.quantity;
        });
    });
    
    // Convert to array and sort by sales
    const topProducts = Object.keys(productSales).map(productId => {
        const product = products.find(p => p.id === parseInt(productId));
        return {
            id: productId,
            name: product ? product.name : 'Unknown',
            sales: productSales[productId]
        };
    }).sort((a, b) => b.sales - a.sales).slice(0, 4);
    
    // Max sales for percentage calculation
    const maxSales = Math.max(...topProducts.map(p => p.sales));
    
    // Update chart
    const productCharts = document.getElementById('product-charts');
    if (productCharts) {
        productCharts.innerHTML = '';
        
        topProducts.forEach(product => {
            const percentage = (product.sales / maxSales) * 100;
            
            const chartItem = document.createElement('div');
            chartItem.className = 'product-chart-item';
            
            chartItem.innerHTML = `
                <div class="product-bar" style="height: ${percentage}%;">
                    <span class="product-percentage">${product.sales}</span>
                </div>
                <p class="product-name">${product.name}</p>
            `;
            
            productCharts.appendChild(chartItem);
        });
    }
}

// Get products from local storage
function getProducts() {
    const products = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return products ? JSON.parse(products) : [];
}

// Save products to local storage
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

// Get orders from local storage
function getOrders() {
    const orders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return orders ? JSON.parse(orders) : [];
}

// Save orders to local storage
function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

// Get customers from local storage
function getCustomers() {
    const customers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return customers ? JSON.parse(customers) : [];
}

// Save customers to local storage
function saveCustomers(customers) {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
}

// Get a customer by ID
function getCustomerById(id) {
    const customers = getCustomers();
    return customers.find(customer => customer.id === id);
}

// Create a product row for the table
function createProductRow(product) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', product.id);
    
    row.innerHTML = `
        <td><img src="${product.image || '../images/product-placeholder.jpg'}" alt="${product.name}" class="product-thumbnail"></td>
        <td>${product.name}</td>
        <td>₱${parseFloat(product.price).toFixed(2)}</td>
        <td>${product.stock}</td>
        <td><span class="status-badge ${product.status}">${product.status}</span></td>
        <td>
            <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
            <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
        </td>
    `;
    
    return row;
}

// Create an order row for the table
function createOrderRow(order) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', order.id);
    
    const customer = getCustomerById(order.customerId);
    const itemCount = order.items.reduce((total, item) => total + item.quantity, 0);
    
    row.innerHTML = `
        <td>${order.id}</td>
        <td>${customer ? customer.name : 'Unknown'}</td>
        <td>${order.date}</td>
        <td>${itemCount} item${itemCount !== 1 ? 's' : ''}</td>
        <td>₱${order.total.toFixed(2)}</td>
        <td>
            <select class="status-select" data-id="${order.id}">
                <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                <option value="canceled" ${order.status === 'canceled' ? 'selected' : ''}>Canceled</option>
            </select>
        </td>
<td>
  <button class="action-btn view-btn" data-id="${order.id}">View</button>
  <button class="action-btn delete-order-btn" data-id="${order.id}">Delete</button>
  <button class="edit-date-btn" data-id="${order.id}" title="Edit Date" style="background:none;border:none;color:#999;cursor:pointer;font-size:14px;padding:2px;">
    🖉
  </button>
</td>

    `;
    
    return row;
}

// Create a customer row for the table
function createCustomerRow(customer) {
    const row = document.createElement('tr');
    row.setAttribute('data-id', customer.id);
    
    row.innerHTML = `
        <td>${customer.name}</td>
        <td>${customer.email}</td>
        <td>${customer.phone}</td>
        <td>${customer.orderCount}</td>
        <td>₱${customer.totalSpent.toFixed(2)}</td>
<td>
    <button class="action-btn view-btn" data-id="${customer.id}">View Orders</button>
    <button class="action-btn delete-customer-btn" data-id="${customer.id}">Delete</button>
</td>

    `;
    
    return row;
}

// Bind event listeners to product elements
function bindProductEventListeners() {
    const editBtns = document.querySelectorAll('.edit-btn');
    editBtns.forEach(btn => {
        btn.addEventListener('click', handleProductEdit);
    });
    
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', handleProductDelete);
    });
}

// Bind event listeners to order elements
function bindOrderEventListeners() {
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', handleOrderView);
    });

    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', handleOrderStatusChange);
    });

    const deleteBtns = document.querySelectorAll('.delete-order-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', handleOrderDelete);
    });
const editDateBtns = document.querySelectorAll('.edit-date-btn');
editDateBtns.forEach(btn => {
    btn.addEventListener('click', handleEditOrderDate);
});

}


const deleteBtns = document.querySelectorAll('.delete-order-btn');
deleteBtns.forEach(btn => {
    btn.addEventListener('click', handleOrderDelete);
});

function handleOrderDelete() {
    const orderId = this.getAttribute('data-id');
    if (confirm('Are you sure you want to delete this order?')) {
        let orders = getOrders().filter(o => o.id !== orderId);
        saveOrders(orders);
        loadOrders();
        loadRecentOrders();
        updateDashboardStats();
    }
}
function handleEditOrderDate() {
    const orderId = this.getAttribute('data-id');
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) return alert('Order not found');

    const currentDate = orders[orderIndex].date;
    const newDate = prompt("Enter new date (e.g., Apr 10, 2025):", currentDate);

    if (newDate && newDate.trim()) {
        orders[orderIndex].date = newDate.trim();
        saveOrders(orders);
        loadOrders();
        loadRecentOrders();
        alert("Order date updated successfully.");
    }
}

// Bind event listeners to customer elements
function bindCustomerEventListeners() {
    const viewBtns = document.querySelectorAll('.customers-tbody .view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', handleCustomerView);
    });

    const deleteBtns = document.querySelectorAll('.delete-customer-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', handleCustomerDelete);
    });
}
function handleCustomerDelete() {
    const customerId = parseInt(this.getAttribute('data-id'));
    if (confirm('Are you sure you want to delete this customer?')) {
        let customers = getCustomers().filter(c => c.id !== customerId);
        saveCustomers(customers);
        loadCustomers();
        updateCustomerSelect();
        updateDashboardStats();
    }
}


// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // For demo purposes, use default credentials
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        // Store login status
        localStorage.setItem(STORAGE_KEYS.LOGGED_IN, 'true');
        localStorage.setItem(STORAGE_KEYS.ADMIN_USERNAME, username);
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Show error message
        if (selectors.loginError) {
            selectors.loginError.textContent = 'Invalid username or password';
        }
    }
}

// Handle logout
function handleLogout() {
    // Clear login status
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_USERNAME);
    
    // Redirect to login page
    redirectToLogin();
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === 'true';
}

// Redirect to login page
function redirectToLogin() {
    window.location.href = 'index.html';
}

// Handle navigation
function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all links and sections
    selectors.navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    selectors.contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Add active class to clicked link
    e.currentTarget.classList.add('active');
    
    // Show corresponding section
    const sectionId = e.currentTarget.getAttribute('data-section');
    const section = document.getElementById(sectionId);
    
    if (section) {
        section.classList.add('active');
        
        // Update header title
        const headerTitle = document.querySelector('.admin-header h1');
        if (headerTitle) {
            headerTitle.textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
        }
    }
}

// Handle view all orders button
function handleViewAllOrders(e) {
    e.preventDefault();
    
    // Simulate clicking on orders nav link
    const ordersLink = document.querySelector('a[data-section="orders"]');
    if (ordersLink) {
        ordersLink.click();
    }
}

// Open modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        
        // Reset forms if present
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
        }
        
        // Reset image preview if present
        const imagePreview = modal.querySelector('.image-preview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
        }
    }
}

// Handle close modal button
function handleCloseModal() {
    // Find the closest modal
    const modal = this.closest('.modal');
    if (modal) {
        closeModal(modal.id);
    }
}

// Handle product edit button
function handleProductEdit() {
    const productId = this.getAttribute('data-id');
    const products = getProducts();
    const product = products.find(p => p.id === parseInt(productId));
    
    if (product) {
        // Fill form with product data
        document.getElementById('product-modal-title').textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-status').value = product.status;
        document.getElementById('product-description').value = product.description || '';
        
        // Store product ID for update
        document.getElementById('product-form').setAttribute('data-edit-id', productId);
        
        // Open modal
        openModal('productModal');
    }
}

// Handle product delete button
function handleProductDelete() {
    const productId = this.getAttribute('data-id');
    
    if (confirm('Are you sure you want to delete this product?')) {
        // Remove product from local storage
        const products = getProducts();
        const updatedProducts = products.filter(p => p.id !== parseInt(productId));
        saveProducts(updatedProducts);
        
        // Remove row from table
        const row = this.closest('tr');
        if (row) {
            row.remove();
        }
        
        // Update dashboard stats
        updateDashboardStats();
    }
}

// Handle product form submission
function handleProductSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productStock = parseInt(document.getElementById('product-stock').value);
    const productStatus = document.getElementById('product-status').value;
    const productDescription = document.getElementById('product-description').value;
    const productImage = document.getElementById('product-image').files[0];
    
    // Validate form data
    if (!productName || isNaN(productPrice) || isNaN(productStock)) {

        return;
    }
    
    // Get products from storage
    const products = getProducts();
    
    // Check if editing or adding
    const isEditing = document.getElementById('product-form').hasAttribute('data-edit-id');
    
    if (isEditing) {
        // Update existing product
        const productId = parseInt(document.getElementById('product-form').getAttribute('data-edit-id'));
        const productIndex = products.findIndex(p => p.id === productId);
        
        if (productIndex !== -1) {
            // Update product data
            products[productIndex].name = productName;
            products[productIndex].price = productPrice;
            products[productIndex].stock = productStock;
            products[productIndex].status = productStatus;
            products[productIndex].description = productDescription;
            
            // Update image if new one is provided
            if (productImage) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    products[productIndex].image = e.target.result;
                    
                    // Save products to storage
                    saveProducts(products);
                    
                    // Update UI
                    loadProducts();
                    updateDashboardStats();
                    updateTopProducts();
                    
                    // Close modal
                    closeModal('productModal');
                    
                    // Show success message
                    alert('Product updated successfully');
                };
                reader.readAsDataURL(productImage);
            } else {
                // Save without changing image
                saveProducts(products);
                
                // Update UI
                loadProducts();
                updateDashboardStats();
                updateTopProducts();
                
                // Close modal
                closeModal('productModal');
                
                // Show success message
                alert('Product updated successfully');
            }
        }
    } else {
        // Add new product
        const newProduct = {
            id: Date.now(),
            name: productName,
            price: productPrice,
            stock: productStock,
            status: productStatus,
            description: productDescription
        };
        
        // Add image if provided
        if (productImage) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newProduct.image = e.target.result;
                
                // Add to products array
                products.push(newProduct);
                
                // Save products to storage
                saveProducts(products);
                
                // Update UI
                loadProducts();
                updateDashboardStats();
                
                // Close modal
                closeModal('productModal');
                
                // Show success message
                alert('Product added successfully');
            };
            reader.readAsDataURL(productImage);
        } else {
            // Add without image
            newProduct.image = '../images/product-placeholder.jpg';
            
            // Add to products array
            products.push(newProduct);
            
            // Save products to storage
            saveProducts(products);
            
            // Update UI
            loadProducts();
            updateDashboardStats();
            
            // Close modal
closeModal('productModal');

// Show success message
alert('Product added successfully');
}
}
}

// Handle order view button
function handleOrderView() {
    const orderId = this.getAttribute('data-id');
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    
    if (order) {
        // Get customer info
        const customer = getCustomerById(order.customerId);
        
        // Fill modal with order data
        document.getElementById('order-id').textContent = order.id;
        document.getElementById('order-date').textContent = order.date;
        document.getElementById('order-status').textContent = order.status;
        document.getElementById('customer-name').className = `status-badge ${order.status}`;
        
        // Set status dropdown
        const statusSelect = document.getElementById('order-status-select');
        if (statusSelect) {
            statusSelect.value = order.status;
            statusSelect.setAttribute('data-id', orderId);
        }
        
        // Fill customer info
        if (customer) {
            document.getElementById('customer-name').textContent = customer.name;
            document.getElementById('customer-email').textContent = customer.email;
            document.getElementById('customer-phone').textContent = customer.phone;
            document.getElementById('customer-address').textContent = customer.address;
        } else {
            document.getElementById('customer-name').textContent = 'Unknown';
            document.getElementById('customer-email').textContent = 'N/A';
            document.getElementById('customer-phone').textContent = 'N/A';
            document.getElementById('customer-address').textContent = 'N/A';
        }
        
        // Fill order items table
        const itemsTable = document.getElementById('order-items-tbody');
        if (itemsTable) {
            itemsTable.innerHTML = '';
            
            order.items.forEach(item => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₱${item.price.toFixed(2)}</td>
                    <td>₱${item.subtotal.toFixed(2)}</td>
                `;
                
                itemsTable.appendChild(row);
            });
        }
        
        // Fill order summary
        document.getElementById('order-subtotal').textContent = `₱${order.subtotal.toFixed(2)}`;
        document.getElementById('order-shipping').textContent = `₱${order.shipping.toFixed(2)}`;
        document.getElementById('order-total').textContent = `₱${order.total.toFixed(2)}`;
        
        // Open modal
        openModal('orderViewModal');
    }
}

// Modify the existing handleOrderStatusChange function to include email notification
function handleOrderStatusChange() {
    const orderId = this.getAttribute('data-id');
    const newStatus = this.value;
    
    // Update order status in storage
    const orders = getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        const previousStatus = orders[orderIndex].status;
        orders[orderIndex].status = newStatus;
        saveOrders(orders);
        
        // Update badge in row
        const row = this.closest('tr');
        if (row) {
            const statusBadge = row.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge ${newStatus}`;
                statusBadge.textContent = newStatus;
            }
        }
        
        // If status changed, send email notification
        if (previousStatus !== newStatus) {
            const order = orders[orderIndex];
            const customer = getCustomerById(order.customerId);
            
            if (customer) {
                sendOrderStatusEmail(
                    order.id,
                    newStatus,
                    customer.email,
                    customer.name
                ).then(success => {
                    if (success) {
                        console.log(`Status update email sent to ${customer.name}`);
                    }
                });
            }
        }
    }
}

// Modify the handleOrderStatusUpdate function to include email notification
function handleOrderStatusUpdate() {
    const statusSelect = document.getElementById('order-status-select');
    if (statusSelect) {
        const orderId = statusSelect.getAttribute('data-id');
        const newStatus = statusSelect.value;
        
        // Update order status in storage
        const orders = getOrders();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex !== -1) {
            const previousStatus = orders[orderIndex].status;
            orders[orderIndex].status = newStatus;
            saveOrders(orders);
            
            // Update order view modal
            document.getElementById('order-status').textContent = newStatus;
            document.getElementById('order-status').className = `status-badge ${newStatus}`;
            
            // Update orders table if visible
            const statusCell = document.querySelector(`tr[data-id="${orderId}"] .status-select`);
            if (statusCell) {
                statusCell.value = newStatus;
            }
            
            // If status changed, send email notification
            if (previousStatus !== newStatus) {
                const order = orders[orderIndex];
                const customer = getCustomerById(order.customerId);
                
                if (customer) {
                    sendOrderStatusEmail(
                        order.id,
                        newStatus,
                        customer.email,
                        customer.name
                    ).then(success => {
                        if (success) {
                            // Show success message with email notification
                            alert(`Order status updated successfully and notification email sent to ${customer.name}`);
                        } else {
                            // Show success message without email notification
                            alert('Order status updated successfully but email notification could not be sent');
                        }
                    });
                } else {
                    // Show success message without email notification
                    alert('Order status updated successfully');
                }
            } else {
                // Show success message without email notification
                alert('Order status updated successfully');
            }
            
            // Reload recent orders on dashboard
            loadRecentOrders();
        }
    }
}

// Handle customer view button
function handleCustomerView() {
    const customerId = parseInt(this.getAttribute('data-id'));
    
    // Get customer orders
    const orders = getOrders().filter(o => o.customerId === customerId);
    
    // Get customer info
    const customer = getCustomerById(customerId);
    
    if (customer) {
        // Navigate to orders tab
        const ordersLink = document.querySelector('a[data-section="orders"]');
        if (ordersLink) {
            ordersLink.click();
        }
        
        // Filter orders table to show only this customer's orders
        const customerFilter = document.getElementById('order-customer-filter');
        if (customerFilter) {
            // Add option if not exists
            if (!customerFilter.querySelector(`option[value="${customerId}"]`)) {
                const option = document.createElement('option');
                option.value = customerId;
                option.textContent = customer.name;
                customerFilter.appendChild(option);
            }
            
            // Select customer
            customerFilter.value = customerId;
            
            // Trigger filter
            const event = new Event('change');
            customerFilter.dispatchEvent(event);
        }
    }
}

// Setup search and filter functionality
function setupSearchAndFilters() {
    // Products search
    const productSearch = document.getElementById('product-search');
    if (productSearch) {
        productSearch.addEventListener('input', filterProducts);
    }
    
    // Products filter
    const productFilter = document.getElementById('product-filter');
    if (productFilter) {
        productFilter.addEventListener('change', filterProducts);
    }
    
    // Orders search
    const orderSearch = document.getElementById('order-search');
    if (orderSearch) {
        orderSearch.addEventListener('input', filterOrders);
    }
    
    // Orders filter
    const orderFilter = document.getElementById('order-filter');
    if (orderFilter) {
        orderFilter.addEventListener('change', filterOrders);
    }
    
    // Order customer filter
    const orderCustomerFilter = document.getElementById('order-customer-filter');
    if (orderCustomerFilter) {
        // Populate with customers
        const customers = getCustomers();
        orderCustomerFilter.innerHTML = '<option value="all">All Customers</option>';
        
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            orderCustomerFilter.appendChild(option);
        });
        
        orderCustomerFilter.addEventListener('change', filterOrders);
    }
    
    // Customers search
    const customerSearch = document.getElementById('customer-search');
    if (customerSearch) {
        customerSearch.addEventListener('input', filterCustomers);
    }

    // Add Order Button
    const addOrderBtn = document.getElementById('add-order-btn');
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', () => openModal('orderModal'));
    }

    // Order Form
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', handleOrderSubmit);
        
        // Setup product selection
        setupOrderProductSelection();
    }
}

// Filter products based on search and filter
function filterProducts() {
    const searchTerm = document.getElementById('product-search').value.toLowerCase();
    const filterValue = document.getElementById('product-filter').value;
    
    const products = getProducts();
    const productsTable = document.getElementById('products-tbody');
    
    if (productsTable) {
        productsTable.innerHTML = '';
        
        const filteredProducts = products.filter(product => {
            // Apply status filter
            if (filterValue !== 'all' && product.status !== filterValue) {
                return false;
            }
            
            // Apply search filter
            if (searchTerm) {
                return product.name.toLowerCase().includes(searchTerm);
            }
            
            return true;
        });
        
        filteredProducts.forEach(product => {
            const row = createProductRow(product);
            productsTable.appendChild(row);
        });
        
        // Re-bind event listeners
        bindProductEventListeners();
    }
}

// Filter orders based on search and filter
function filterOrders() {
    const searchTerm = document.getElementById('order-search')?.value.toLowerCase() || '';
    const filterValue = document.getElementById('order-filter')?.value || 'all';
    const customerFilter = document.getElementById('order-customer-filter')?.value || 'all';
    
    const orders = getOrders();
    const ordersTable = document.getElementById('orders-tbody');
    
    if (ordersTable) {
        ordersTable.innerHTML = '';
        
        const filteredOrders = orders.filter(order => {
            // Apply status filter
            if (filterValue !== 'all' && order.status !== filterValue) {
                return false;
            }
            
            // Apply customer filter
            if (customerFilter !== 'all' && order.customerId !== parseInt(customerFilter)) {
                return false;
            }
            
            // Apply search filter
            if (searchTerm) {
                const customer = getCustomerById(order.customerId);
                const customerName = customer ? customer.name.toLowerCase() : '';
                
                return order.id.toLowerCase().includes(searchTerm) || 
                       customerName.includes(searchTerm);
            }
            
            return true;
        });
        
        filteredOrders.forEach(order => {
            const row = createOrderRow(order);
            ordersTable.appendChild(row);
        });
        
        // Re-bind event listeners
        bindOrderEventListeners();
    }
}

// Filter customers based on search
function filterCustomers() {
    const searchTerm = document.getElementById('customer-search').value.toLowerCase();
    
    const customers = getCustomers();
    const customersTable = document.getElementById('customers-tbody');
    
    if (customersTable) {
        customersTable.innerHTML = '';
        
        const filteredCustomers = customers.filter(customer => {
            if (searchTerm) {
                return customer.name.toLowerCase().includes(searchTerm) || 
                       customer.email.toLowerCase().includes(searchTerm) ||
                       customer.phone.toLowerCase().includes(searchTerm);
            }
            
            return true;
        });
        
        filteredCustomers.forEach(customer => {
            const row = createCustomerRow(customer);
            customersTable.appendChild(row);
        });
        
        // Re-bind event listeners
        bindCustomerEventListeners();
    }
}

// Setup image preview for product form
function setupImagePreview() {
    const imageInput = document.getElementById('product-image');
    const imagePreview = document.querySelector('.image-preview');
    
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            
            if (file) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product Preview">`;
                };
                
                reader.readAsDataURL(file);
            } else {
                imagePreview.innerHTML = '';
            }
        });
    }
}

// Format date as string
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Handle admin settings form submission
function handleAdminSettingsSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validate form data
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    if (password && password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    // Update admin username
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERNAME, username);
    
    // Update admin name in UI
    if (selectors.adminName) {
        selectors.adminName.textContent = username;
    }
    
    // Update default password if provided
    if (password) {
        // In a real application, this would need proper encryption
        // For demo purposes, we're just storing it in a variable
        // DO NOT use this approach in a production environment
        DEFAULT_PASSWORD = password;
    }
    
    // Show success message
    alert('Admin settings updated successfully');
}

// Handle store settings form submission
function handleStoreSettingsSubmit(e) {
    e.preventDefault();
    
    // Show success message
    alert('Store settings updated successfully');
}

// Setup order product selection
function setupOrderProductSelection() {
    const productSelect = document.getElementById('order-product-select');
    const productQuantity = document.getElementById('order-product-quantity');
    const addProductBtn = document.getElementById('add-product-to-order');
    const orderItemsTable = document.getElementById('order-items-tbody');

    if (productSelect && addProductBtn && orderItemsTable) {
        // Populate product select
        const products = getProducts().filter(p => p.status === 'active');
        productSelect.innerHTML = '<option value="">Select a product</option>';
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - ₱${product.price.toFixed(2)}`;
            option.setAttribute('data-price', product.price);
            option.setAttribute('data-name', product.name);
            productSelect.appendChild(option);
        });
        
        // Add product to order
        addProductBtn.addEventListener('click', function() {
            const productId = productSelect.value;
            const quantity = parseInt(productQuantity.value);
            
            if (!productId || isNaN(quantity) || quantity <= 0) {
                return;
            }
            
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            const productName = selectedOption.getAttribute('data-name');
            const productPrice = parseFloat(selectedOption.getAttribute('data-price'));
            const subtotal = productPrice * quantity;
            
            // Check if product already exists in order
            const existingRow = orderItemsTable.querySelector(`tr[data-id="${productId}"]`);
            
            if (existingRow) {
                // Update existing row
                const existingQuantity = parseInt(existingRow.querySelector('td:nth-child(2)').textContent);
                const newQuantity = existingQuantity + quantity;
                const newSubtotal = productPrice * newQuantity;
                
                existingRow.querySelector('td:nth-child(2)').textContent = newQuantity;
                existingRow.querySelector('td:nth-child(4)').textContent = `₱${newSubtotal.toFixed(2)}`;
                existingRow.setAttribute('data-subtotal', newSubtotal);
            } else {
                // Add new row
                const row = document.createElement('tr');
                row.setAttribute('data-id', productId);
                row.setAttribute('data-price', productPrice);
                row.setAttribute('data-subtotal', subtotal);
                
                row.innerHTML = `
                    <td>${productName}</td>
                    <td>${quantity}</td>
                    <td>₱${productPrice.toFixed(2)}</td>
                    <td>₱${subtotal.toFixed(2)}</td>
                    <td><button class="remove-item-btn" type="button">Remove</button></td>
                `;
                
                orderItemsTable.appendChild(row);
                
                // Add event listener to remove button
                row.querySelector('.remove-item-btn').addEventListener('click', function() {
                    row.remove();
                    
                    // Update order summary
                    updateOrderSummary();
                });
            }
            
            // Clear inputs
            productSelect.value = '';
            productQuantity.value = '1';
            
            // Update order summary
            updateOrderSummary();
        });
    }
}

// Update order summary in add/edit order form
function updateOrderSummary() {
    const orderItemsTable = document.getElementById('order-items-tbody');
    const subtotalElement = document.getElementById('order-form-subtotal');
    const shippingElement = document.getElementById('order-shipping-cost');
    const totalElement = document.getElementById('order-form-total');
    
    if (orderItemsTable && subtotalElement && shippingElement && totalElement) {
        // Calculate subtotal
        let subtotal = 0;
        
        orderItemsTable.querySelectorAll('tr').forEach(row => {
            subtotal += parseFloat(row.getAttribute('data-subtotal'));
        });
        
        // Update subtotal
        subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
        
        // Get shipping cost
        const shippingCost = parseFloat(shippingElement.value) || 0;
        
        // Calculate total
        const total = subtotal + shippingCost;
        
        // Update total
        totalElement.textContent = `₱${total.toFixed(2)}`;
    }
}

// Handle order form submission
function handleOrderSubmit(e) {
    e.preventDefault();
    
    // Get customer data
    const customerId = parseInt(document.getElementById('order-customer').value);
    const shippingCost = parseFloat(document.getElementById('order-shipping-cost').value) || 0;
    
    // Validate customer selection
    if (!customerId) {
        alert('Please select a customer');
        return;
    }
    
    // Get order items
    const orderItemsTable = document.getElementById('order-items-tbody');
    const items = [];
    let subtotal = 0;
    
    orderItemsTable.querySelectorAll('tr').forEach(row => {
        const productId = parseInt(row.getAttribute('data-id'));
        const name = row.querySelector('td:nth-child(1)').textContent;
        const quantity = parseInt(row.querySelector('td:nth-child(2)').textContent);
        const price = parseFloat(row.getAttribute('data-price'));
        const itemSubtotal = price * quantity;
        
        items.push({
            productId,
            name,
            price,
            quantity,
            subtotal: itemSubtotal
        });
        
        subtotal += itemSubtotal;
    });
    
    // Validate items
    if (items.length === 0) {
        alert('Please add at least one product to the order');
        return;
    }
    
    // Calculate total
    const total = subtotal + shippingCost;
    
    // Generate order ID
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const orderCount = getOrders().length + 1;
    const orderId = `CO-${year}-${orderCount.toString().padStart(3, '0')}`;
    
    // Create new order
    const newOrder = {
        id: orderId,
        customerId,
        date: formatDate(date),
        items,
        subtotal,
        shipping: shippingCost,
        total,
        status: 'pending'
    };
    
    // Add to orders array
    const orders = getOrders();
    orders.push(newOrder);
    saveOrders(orders);
    
    // Update customer order count and total spent
    const customers = getCustomers();
    const customerIndex = customers.findIndex(c => c.id === customerId);
    
    if (customerIndex !== -1) {
        customers[customerIndex].orderCount = (customers[customerIndex].orderCount || 0) + 1;
        customers[customerIndex].totalSpent = (customers[customerIndex].totalSpent || 0) + total;
        saveCustomers(customers);
    }
    
    // Update UI
    loadOrders();
    loadCustomers();
    loadRecentOrders();
    updateDashboardStats();
    
    // Close modal
    closeModal('orderModal');
    
    // Show success message
    alert('Order added successfully');
}

// Create a new customer
function handleCustomerAdd() {
    // Get form data
   const customerName = document.getElementById('customer-name').value;
    const customerEmail = document.getElementById('customer-email').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    
    // Validate form data
    if (!customerName || !customerEmail || !customerPhone || !customerAddress) {
 
        return;
    }
    
    // Create new customer
    const newCustomer = {
        id: Date.now(),
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        totalSpent: 0,
        orderCount: 0
    };
    
    // Add to customers array
    const customers = getCustomers();
    customers.push(newCustomer);
    saveCustomers(customers);
    
    // Update UI
    loadCustomers();
    updateCustomerSelect();
    
    // Close modal
    closeModal('customerModal');
    
    // Show success message
    alert('Customer added successfully');
}

// Update customer select in order form
function updateCustomerSelect() {
    const customerSelect = document.getElementById('order-customer');
    
    if (customerSelect) {
        // Get customers
        const customers = getCustomers();
        
        // Clear select
        customerSelect.innerHTML = '<option value="">Select a customer</option>';
        
        // Add customer options
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name;
            customerSelect.appendChild(option);
        });
    }
}

// EmailJS Configuration
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 's02GelTPEGkEkEvzS',
    SERVICE_ID: 'service_3n4n59l',
    TEMPLATE_ID: 'template_xvc74p7'
};

// Initialize EmailJS
function initEmailJS() {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// Send order status update email
function sendOrderStatusEmail(orderId, status, customerEmail, customerName) {
    // Status message templates for different status types
    const statusMessages = {
        pending: {
            subject: 'Your Coconutch Oil Order has been Received',
            message: 'Thank you for your order! We have received your order and will process it shortly.'
        },
        processing: {
            subject: 'Your Coconutch Oil Order is being Processed',
            message: 'Good news! We are now processing your order and preparing it for shipment.'
        },
        shipped: {
            subject: 'Your Coconutch Oil Order has been Shipped',
            message: 'Great news! Your order has been shipped and is on its way to you.'
        },
        delivered: {
            subject: 'Your Coconutch Oil Order has been Delivered',
            message: 'Your order has been delivered! We hope you enjoy your products.'
        },
        canceled: {
            subject: 'Your Coconutch Oil Order has been Canceled',
            message: 'Your order has been canceled as requested. If you have any questions, please contact us.'
        }
    };

    // Get appropriate message for current status
    const statusInfo = statusMessages[status] || {
        subject: `Your Coconutch Order Status: ${status}`,
        message: `The status of your order has been updated to: ${status}`
    };

    // Email parameters
    const emailParams = {
        to_name: customerName,
        to_email: customerEmail,
        order_id: orderId,
        order_status: status,
        status_message: statusInfo.message,
        subject: statusInfo.subject
    };

    // Send email using EmailJS
    return emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID, 
        EMAILJS_CONFIG.TEMPLATE_ID, 
        emailParams
    ).then(
        function(response) {
            console.log('Email sent successfully!', response);
            return true;
        },
        function(error) {
            console.error('Email send failed:', error);
            return false;
        }
    );
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initAdminDashboard();
    
    // Add event listener to add customer button
    const addCustomerBtn = document.getElementById('add-customer-btn');
    if (addCustomerBtn) {
        addCustomerBtn.addEventListener('click', () => openModal('customerModal'));
    }
    
    // Add event listener to customer form
    const customerForm = document.getElementById('customer-form');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCustomerAdd();
        });
    }
    
    // Initialize shipping cost input to update order summary
    const shippingCost = document.getElementById('order-shipping-cost');
    if (shippingCost) {
        shippingCost.addEventListener('input', updateOrderSummary);
    }
    
    // Update customer select in order form
    updateCustomerSelect();
});