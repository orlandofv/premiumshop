// dashboard.js – PremiumShop Admin Dashboard

(function() {
    'use strict';

    function ensureStoreReturnLinks() {
        const sidebarNav = document.querySelector('.sidebar .nav');
        if (sidebarNav && !sidebarNav.querySelector('a[href="index.html"]')) {
            const shopLink = document.createElement('a');
            shopLink.className = 'nav-link';
            shopLink.href = 'index.html';
            shopLink.innerHTML = '<i class="fas fa-store"></i> Back to Shop';
            sidebarNav.appendChild(shopLink);
        }

        const headerUser = document.querySelector('.dashboard-header .header-user');
        if (headerUser && !headerUser.querySelector('[data-storefront-link]')) {
            const shopButton = document.createElement('a');
            shopButton.href = 'index.html';
            shopButton.className = 'btn btn-sm btn-outline-primary d-none d-md-inline-flex align-items-center';
            shopButton.setAttribute('data-storefront-link', 'true');
            shopButton.innerHTML = '<i class="fas fa-store me-2"></i>View Store';
            headerUser.prepend(shopButton);
        }
    }

    ensureStoreReturnLinks();

    // Page loader (already handled by main.js, but we can add extra if needed)

    // Initialize DataTables
    if ($.fn.DataTable) {
        $('#ordersTable').DataTable({
            pageLength: 5,
            lengthMenu: [5, 10, 25],
            responsive: true,
            language: {
                search: "Filter records:",
                zeroRecords: "No matching orders found",
                info: "Showing _START_ to _END_ of _TOTAL_ orders"
            }
        });

        $('#stockTable').DataTable({
            pageLength: 5,
            lengthMenu: [5, 10, 25],
            responsive: true,
            searching: false,
            language: {
                info: "Showing _START_ to _END_ of _TOTAL_ products"
            }
        });
    }

    // Sales Chart (Line)
    const salesCtx = document.getElementById('salesChart')?.getContext('2d');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales 2025',
                    data: [1200, 1900, 1500, 2200, 2800, 3500, 4100, 3800, 3200, 2900, 3600, 4200],
                    borderColor: 'rgba(44, 123, 224, 1)',
                    backgroundColor: 'rgba(44, 123, 224, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // Orders Status Chart (Doughnut)
    const ordersCtx = document.getElementById('ordersChart')?.getContext('2d');
    if (ordersCtx) {
        new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Processing', 'Shipped', 'Delivered'],
                datasets: [{
                    data: [30, 45, 60, 120],
                    backgroundColor: [
                        '#ffc107',
                        '#17a2b8',
                        '#007bff',
                        '#28a745'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                },
                cutout: '70%'
            }
        });
    }

    // Sidebar toggle on mobile
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.getElementById('sidebar').classList.toggle('show');
        });
    }

})();
