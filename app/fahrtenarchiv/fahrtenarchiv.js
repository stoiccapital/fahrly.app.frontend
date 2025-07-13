// Fahrtenarchiv JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeNavbar();
    initializeSidebar();
    initializeFahrtenarchiv();
});

function initializeFahrtenarchiv() {
    // Initialize filters
    initializeFilters();
    
    // Initialize table sorting
    initializeTableSorting();
    
    // Initialize export functionality
    initializeExport();
    
    // Initialize pagination
    initializePagination();
    
    // Initialize refresh functionality
    initializeRefresh();
    
    // Load initial data
    loadFahrtenData();
}

// Filter functionality
function initializeFilters() {
    const timeFrameFilter = document.getElementById('timeFrameFilter');
    const driverFilter = document.getElementById('driverFilter');
    const customDateRange = document.getElementById('customDateRange');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    
    // Show/hide custom date range based on time frame selection
    timeFrameFilter.addEventListener('change', function() {
        if (this.value === 'custom') {
            customDateRange.style.display = 'block';
        } else {
            customDateRange.style.display = 'none';
            startDate.value = '';
            endDate.value = '';
        }
    });
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        applyFilters();
    });
    
    // Apply filters on Enter key
    [timeFrameFilter, driverFilter, startDate, endDate].forEach(element => {
        element.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    });
}

function applyFilters() {
    const timeFrame = document.getElementById('timeFrameFilter').value;
    const driver = document.getElementById('driverFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
        // Filter data based on selected criteria
        const filteredData = filterFahrtenData(timeFrame, driver, startDate, endDate);
        
        // Update table with filtered data
        updateTableData(filteredData);
        
        // Update results count
        updateResultsCount(filteredData.length);
        
        // Hide loading state
        hideLoadingState();
        
        // Show success message
        showNotification('Filter erfolgreich angewendet', 'success');
    }, 500);
}

function filterFahrtenData(timeFrame, driver, startDate, endDate) {
    // This would typically be an API call
    // For now, we'll simulate filtering
    const allData = getSampleFahrtenData();
    
    let filteredData = allData;
    
    // Filter by driver
    if (driver !== 'all') {
        filteredData = filteredData.filter(trip => trip.driverId === driver);
    }
    
    // Filter by time frame
    if (timeFrame !== 'all') {
        const now = new Date();
        let startDateFilter = new Date();
        
        switch (timeFrame) {
            case 'today':
                startDateFilter.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDateFilter.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDateFilter.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                startDateFilter.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                startDateFilter.setFullYear(now.getFullYear() - 1);
                break;
            case 'custom':
                if (startDate && endDate) {
                    startDateFilter = new Date(startDate);
                    const endDateFilter = new Date(endDate);
                    filteredData = filteredData.filter(trip => {
                        const tripDate = new Date(trip.date);
                        return tripDate >= startDateFilter && tripDate <= endDateFilter;
                    });
                    return filteredData;
                }
                break;
        }
        
        filteredData = filteredData.filter(trip => {
            const tripDate = new Date(trip.date);
            return tripDate >= startDateFilter;
        });
    }
    
    return filteredData;
}

// Table sorting functionality
function initializeTableSorting() {
    const sortButtons = document.querySelectorAll('.sort-btn');
    
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sortField = this.getAttribute('data-sort');
            const currentDirection = this.getAttribute('data-direction') || 'asc';
            const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
            
            // Update sort direction
            this.setAttribute('data-direction', newDirection);
            
            // Update sort icon
            updateSortIcon(this, newDirection);
            
            // Sort table data
            sortTableData(sortField, newDirection);
        });
    });
}

function updateSortIcon(button, direction) {
    const icon = button.querySelector('.sort-icon');
    if (direction === 'asc') {
        icon.innerHTML = '<path d="M7 14l5-5 5 5"></path>';
    } else {
        icon.innerHTML = '<path d="M7 10l5 5 5-5"></path>';
    }
}

function sortTableData(field, direction) {
    const tableBody = document.getElementById('fahrtenTableBody');
    const rows = Array.from(tableBody.querySelectorAll('.table-row'));
    
    rows.sort((a, b) => {
        const aValue = getCellValue(a, field);
        const bValue = getCellValue(b, field);
        
        if (field === 'datum') {
            return direction === 'asc' 
                ? new Date(aValue) - new Date(bValue)
                : new Date(bValue) - new Date(aValue);
        } else if (field === 'preis') {
            const aPrice = parseFloat(aValue.replace('€', '').replace(',', '.').trim());
            const bPrice = parseFloat(bValue.replace('€', '').replace(',', '.').trim());
            return direction === 'asc' ? aPrice - bPrice : bPrice - aPrice;
        } else {
            return direction === 'asc' 
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }
    });
    
    // Reorder rows in the table
    rows.forEach(row => tableBody.appendChild(row));
}

function getCellValue(row, field) {
    const fieldMap = {
        'datum': 0,
        'fahrer': 1,
        'kunde': 2,
        'abholadresse': 3,
        'zieladresse': 4,
        'preis': 5
    };
    
    const cellIndex = fieldMap[field];
    return row.cells[cellIndex].textContent.trim();
}

// Export functionality
function initializeExport() {
    const exportBtn = document.getElementById('exportBtn');
    
    exportBtn.addEventListener('click', function() {
        exportTableData();
    });
}

function exportTableData() {
    // Show loading state
    const originalText = this.textContent;
    this.innerHTML = '<svg class="loading-spinner" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416"><animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/></svg> Exportiere...';
    this.disabled = true;
    
    setTimeout(() => {
        // Create CSV content
        const csvContent = generateCSVContent();
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `fahrtenarchiv_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset button
        this.innerHTML = originalText;
        this.disabled = false;
        
        // Show success message
        showNotification('Export erfolgreich abgeschlossen', 'success');
    }, 1000);
}

function generateCSVContent() {
    const table = document.getElementById('fahrtenTable');
    const rows = table.querySelectorAll('tbody tr');
    
    let csv = 'Datum,Fahrer,Kunde,Abholadresse,Zieladresse,Preis\n';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = [];
        
        // Skip the last cell (actions)
        for (let i = 0; i < cells.length - 1; i++) {
            let cellText = cells[i].textContent.trim();
            // Escape quotes and wrap in quotes if contains comma
            if (cellText.includes(',') || cellText.includes('"')) {
                cellText = '"' + cellText.replace(/"/g, '""') + '"';
            }
            rowData.push(cellText);
        }
        
        csv += rowData.join(',') + '\n';
    });
    
    return csv;
}

// Pagination functionality
function initializePagination() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    let currentPage = 1;
    
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePagination(currentPage);
            loadPageData(currentPage);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentPage < 10) { // Assuming 10 pages total
            currentPage++;
            updatePagination(currentPage);
            loadPageData(currentPage);
        }
    });
    
    pageNumbers.forEach((pageNum, index) => {
        pageNum.addEventListener('click', function() {
            currentPage = index + 1;
            updatePagination(currentPage);
            loadPageData(currentPage);
        });
    });
}

function updatePagination(currentPage) {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    const pageNumbers = document.querySelectorAll('.page-number');
    
    // Update button states
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === 10; // Assuming 10 pages total
    
    // Update active page
    pageNumbers.forEach((pageNum, index) => {
        pageNum.classList.toggle('active', index + 1 === currentPage);
    });
}

function loadPageData(page) {
    // Simulate loading page data
    showLoadingState();
    
    setTimeout(() => {
        // Update results count for current page
        const resultsPerPage = 25;
        const startResult = (page - 1) * resultsPerPage + 1;
        const endResult = Math.min(page * resultsPerPage, 150);
        
        document.getElementById('resultsCount').textContent = endResult - startResult + 1;
        
        hideLoadingState();
    }, 300);
}

// Refresh functionality
function initializeRefresh() {
    const refreshBtn = document.getElementById('refreshBtn');
    
    refreshBtn.addEventListener('click', function() {
        // Add rotation animation
        this.style.transform = 'rotate(360deg)';
        this.style.transition = 'transform 0.5s ease';
        
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 500);
        
        // Reload data
        loadFahrtenData();
        showNotification('Daten aktualisiert', 'success');
    });
}

// Data loading
function loadFahrtenData() {
    showLoadingState();
    
    setTimeout(() => {
        // Simulate loading data
        hideLoadingState();
        updateResultsCount(25);
    }, 500);
}

function updateTableData(data) {
    const tableBody = document.getElementById('fahrtenTableBody');
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Add new rows
    data.forEach(trip => {
        const row = createTableRow(trip);
        tableBody.appendChild(row);
    });
}

function createTableRow(trip) {
    const row = document.createElement('tr');
    row.className = 'table-row';
    
    row.innerHTML = `
        <td class="table-cell">${trip.date}</td>
        <td class="table-cell">${trip.driver}</td>
        <td class="table-cell">${trip.customer}</td>
        <td class="table-cell">${trip.pickupAddress}</td>
        <td class="table-cell">${trip.destinationAddress}</td>
        <td class="table-cell price-cell">€ ${trip.price}</td>
        <td class="table-cell actions-cell">
            <button class="action-btn view-btn" title="Details anzeigen">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            </button>
        </td>
    `;
    
    return row;
}

function getSampleFahrtenData() {
    return [
        {
            date: '15.12.2024',
            driver: 'Max Mustermann',
            driverId: 'driver1',
            customer: 'Firma ABC GmbH',
            pickupAddress: 'Hauptstraße 123, 10115 Berlin',
            destinationAddress: 'Bahnhofstraße 45, 20095 Hamburg',
            price: '245,00'
        },
        {
            date: '14.12.2024',
            driver: 'Anna Schmidt',
            driverId: 'driver2',
            customer: 'Privatkunde Müller',
            pickupAddress: 'Musterweg 67, 80331 München',
            destinationAddress: 'Königsallee 12, 40212 Düsseldorf',
            price: '189,50'
        },
        {
            date: '13.12.2024',
            driver: 'Tom Weber',
            driverId: 'driver3',
            customer: 'Logistik XYZ',
            pickupAddress: 'Industriepark 8, 70565 Stuttgart',
            destinationAddress: 'Hafenstraße 23, 20457 Hamburg',
            price: '320,00'
        },
        {
            date: '12.12.2024',
            driver: 'Lisa Müller',
            driverId: 'driver4',
            customer: 'Event Service Plus',
            pickupAddress: 'Festplatz 1, 50667 Köln',
            destinationAddress: 'Messegelände 5, 30521 Hannover',
            price: '156,75'
        },
        {
            date: '11.12.2024',
            driver: 'Max Mustermann',
            driverId: 'driver1',
            customer: 'Transport AG',
            pickupAddress: 'Lagerstraße 15, 60313 Frankfurt',
            destinationAddress: 'Güterbahnhof 3, 44137 Dortmund',
            price: '278,90'
        }
    ];
}

// Utility functions
function showLoadingState() {
    const tableBody = document.getElementById('fahrtenTableBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align: center; padding: 2rem;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="31.416" stroke-dashoffset="31.416">
                            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
                        </svg>
                        Lade Daten...
                </div>
            </td>
        </tr>
    `;
}

function hideLoadingState() {
    // Data will be loaded by the calling function
}

function updateResultsCount(count) {
    document.getElementById('resultsCount').textContent = count;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Navbar and Sidebar initialization
function initializeNavbar() {
    // Initialize navbar functionality
    const fahrlyLink = document.getElementById('fahrlyLink');
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (fahrlyLink) {
        fahrlyLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '../../index.html';
        });
    }
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotification('Benachrichtigungen werden geladen...', 'info');
        });
    }
}

function initializeSidebar() {
    // Initialize sidebar functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const sidebar = document.getElementById('sidebar');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // Ensure initial state is correct
    if (sidebar && sidebar.classList.contains('active')) {
        body.classList.add('sidebar-open');
    } else {
        body.classList.remove('sidebar-open');
    }
    
    // Function to toggle sidebar state
    function toggleSidebar() {
        const isActive = sidebar.classList.contains('active');
        
        if (isActive) {
            // Close sidebar
            sidebar.classList.remove('active');
            hamburgerMenu.classList.remove('active');
            body.classList.remove('sidebar-open');
        } else {
            // Open sidebar
            sidebar.classList.add('active');
            hamburgerMenu.classList.add('active');
            body.classList.add('sidebar-open');
        }
    }
    
    // Hamburger menu toggle
    if (hamburgerMenu && sidebar) {
        hamburgerMenu.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            toggleSidebar();
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (sidebar && sidebar.classList.contains('active') && 
            !sidebar.contains(e.target) && 
            !hamburgerMenu.contains(e.target)) {
            toggleSidebar();
        }
    });
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });
    
    // Handle navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
            
            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                setTimeout(() => {
                    toggleSidebar();
                }, 300); // Small delay for smooth transition
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Close sidebar on mobile when switching to desktop
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            body.classList.remove('sidebar-open');
        }
    });
} 