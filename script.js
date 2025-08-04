// Durga Puja Dashboard JavaScript

// Global variables
let financeData = [];
let eventsData = [];
let financeChart = null;
let collectionChart = null;

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // Updated Google Sheets URLs for finance and events data
    financeSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVGox77jAxaIaOiP7BcFVSju01tkDgcDAh7yFgzXEFNdFnADIVYq75blbiA7m12akLWHKbwbbag5k2/pub?output=csv',
    eventsSheetUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSOCtcARb_U7UAs-bU4k24KzQ7oXEMahspOyCPdVX0pJ0yn_iY03DRwAnqAyj9MxYEJiqycsy96yyR_/pub?output=csv',
    // Auto-refresh interval in milliseconds (5 minutes)
    refreshInterval: 300000
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadDataFromGoogleSheets();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Auto-refresh data from Google Sheets
    setInterval(loadDataFromGoogleSheets, GOOGLE_SHEETS_CONFIG.refreshInterval);
});

// Initialize dashboard
function initializeDashboard() {
    console.log('Initializing Durga Puja Dashboard...');
    setupEventListeners();
    createCharts();
}

// Setup event listeners
setInterval(function() {
    document.getElementById("refreshData").click();
}, 100000); 
function setupEventListeners() {
    // Manual refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadDataFromGoogleSheets);
    }
}

// Load data from Google Sheets
async function loadDataFromGoogleSheets() {
    try {
        showNotification('Loading data from Google Sheets...', 'info');
        
        // Load finance data
        try {
            const financeResponse = await fetch(GOOGLE_SHEETS_CONFIG.financeSheetUrl);
            if (financeResponse.ok) {
                const financeCsv = await financeResponse.text();
                financeData = processCsvData(financeCsv, 'finance');
                //showNotification('Finance data loaded from Google Sheets!', 'success');
            } else {
                console.error('Failed to load finance data from Google Sheets');
                showNotification('Failed to load finance data from Google Sheets. Please check your connection and sheet URL.', 'error');
                financeData = []; // Initialize with empty array instead of sample data
            }
        } catch (error) {
            console.error('Error fetching finance data:', error);
            showNotification('Error fetching finance data from Google Sheets. Please check your connection and sheet URL.', 'error');
            financeData = []; // Initialize with empty array instead of sample data
        }
        
        // Load events data
        try {
            const eventsResponse = await fetch(GOOGLE_SHEETS_CONFIG.eventsSheetUrl);
            if (eventsResponse.ok) {
                const eventsCsv = await eventsResponse.text();
                eventsData = processCsvData(eventsCsv, 'events');
                //showNotification('Events data loaded from Google Sheets!', 'success');
            } else {
                console.error('Failed to load events data from Google Sheets');
                showNotification('Failed to load events data from Google Sheets. Please check your connection and sheet URL.', 'error');
                eventsData = []; // Initialize with empty array instead of sample data
            }
        } catch (error) {
            console.error('Error fetching events data:', error);
            showNotification('Error fetching events data from Google Sheets. Please check your connection and sheet URL.', 'error');
            eventsData = []; // Initialize with empty array instead of sample data
        }
        
        updateDashboard();
        
    } catch (error) {
        console.error('Error loading data from Google Sheets:', error);
        showNotification('Error loading data from Google Sheets. Please check your connection and sheet URLs.', 'error');
        financeData = [];
        eventsData = [];
        updateDashboard();
    }
}

// Process CSV data from Google Sheets
function processCsvData(csvText, dataType) {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            if (dataType === 'finance') {
                data.push({
                    type: row.Type || row.type || 'Collection',
                    category: row.Category || row.category || 'Other',
                    amount: parseFloat(row.Amount || row.amount || 0),
                    date: row.Date || row.date || new Date().toISOString().split('T')[0],
                    description: row.Description || row.description || '',
                    source: row.Source || row.source || ''
                });
            } else if (dataType === 'events') {
                data.push({
                    title: row.Title || row.title || '',
                    date: row.Date || row.date || '',
                    time: row.Time || row.time || '',
                    description: row.Description || row.description || '',
                    location: row.Location || row.location || '',
                    status: row.Status || row.status || 'Upcoming'
                });
            }
        }
    }
    
    return data;
}

// File upload handlers and processors have been removed as we now only use Google Sheets data

// This function has been removed as we now only use Google Sheets data
// The sample data functionality has been removed to ensure only real data is displayed

// Update dashboard with current data
function updateDashboard() {
    updateStatistics();
    updateCharts();
    updateFinanceLists();
    updateEventsList();
    updateCountdown();
}

// Update statistics
function updateStatistics() {
    const collections = financeData.filter(item => item.type === 'Collection');
    const expenditures = financeData.filter(item => item.type === 'Spending');
    
    const totalCollection = collections.reduce((sum, item) => sum + item.amount, 0);
    const totalSpending = expenditures.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalCollection - totalSpending;
    
    const upcomingEvents = eventsData.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        return eventDate >= today;
    }).length;

    document.getElementById('totalCollection').textContent = `₹${totalCollection.toLocaleString()}`;
    document.getElementById('totalSpending').textContent = `₹${totalSpending.toLocaleString()}`;
    document.getElementById('balance').textContent = `₹${balance.toLocaleString()}`;
    document.getElementById('upcomingEvents').textContent = upcomingEvents;
}

// Create charts
function createCharts() {
    // Finance Chart (Collection vs Spending)
    const financeCtx = document.getElementById('financeChart').getContext('2d');
    financeChart = new Chart(financeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Collections', 'Spending'],
            datasets: [{
                data: [0, 0],
                backgroundColor: ['#059669', '#d97706'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // Collection Categories Chart
    const collectionCtx = document.getElementById('collectionChart').getContext('2d');
    collectionChart = new Chart(collectionCtx, {
        type: 'pie',
        data: {
            labels: ['Sponsors', 'Community Donation', 'Others'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Update charts with current data
function updateCharts() {
    const collections = financeData.filter(item => item.type === 'Collection');
    const expenditures = financeData.filter(item => item.type === 'Spending');
    
    const totalCollection = collections.reduce((sum, item) => sum + item.amount, 0);
    const totalSpending = expenditures.reduce((sum, item) => sum + item.amount, 0);

    // Update finance chart
    financeChart.data.datasets[0].data = [totalCollection, totalSpending];
    financeChart.update();

    // Update collection categories chart
    const sponsorAmount = collections.filter(item => item.category === 'Sponsors').reduce((sum, item) => sum + item.amount, 0);
    const communityAmount = collections.filter(item => item.category === 'Community Donation').reduce((sum, item) => sum + item.amount, 0);
    const othersAmount = collections.filter(item => item.category === 'Others').reduce((sum, item) => sum + item.amount, 0);

    collectionChart.data.datasets[0].data = [sponsorAmount, communityAmount, othersAmount];
    collectionChart.update();
}

// Update finance lists
function updateFinanceLists() {
    const collections = financeData.filter(item => item.type === 'Collection');
    const expenditures = financeData.filter(item => item.type === 'Spending');

    // Update collections list
    const collectionsList = document.getElementById('collectionsList');
    collectionsList.innerHTML = collections.map(item => `
        <div class="finance-item fade-in">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="finance-amount text-success">₹${item.amount.toLocaleString()}</div>
                    <div class="finance-category">${item.category}</div>
                    <div class="finance-date">${formatDate(item.date)}</div>
                </div>
                <div class="text-end">
                    <small class="text-muted">${item.description}</small>
                    ${item.source ? `<br><small class="text-muted">${item.source}</small>` : ''}
                </div>
            </div>
        </div>
    `).join('');

    // Update expenditures list
    const expendituresList = document.getElementById('expendituresList');
    expendituresList.innerHTML = expenditures.map(item => `
        <div class="finance-item expenditure fade-in">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <div class="finance-amount text-warning">₹${item.amount.toLocaleString()}</div>
                    <div class="finance-category">${item.category}</div>
                    <div class="finance-date">${formatDate(item.date)}</div>
                </div>
                <div class="text-end">
                    <small class="text-muted">${item.description}</small>
                    ${item.source ? `<br><small class="text-muted">${item.source}</small>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Update events list
function updateEventsList() {
    const eventsList = document.getElementById('eventsList');
    const today = new Date().toISOString().split('T')[0];
    
    const sortedEvents = eventsData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    eventsList.innerHTML = sortedEvents.map(event => {
        const eventDate = new Date(event.date);
        const todayDate = new Date();
        const isToday = event.date === today;
        const isUpcoming = eventDate > todayDate;
        
        let statusClass = '';
        if (isToday) statusClass = 'today';
        else if (isUpcoming) statusClass = 'upcoming';
        
        return `
            <div class="event-item ${statusClass} fade-in">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="event-title">${event.title}</div>
                        <div class="event-time">${event.time}</div>
                        <div class="event-description">${event.description}</div>
                        <div class="event-date">${formatDate(event.date)} - ${event.location}</div>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-${isToday ? 'danger' : isUpcoming ? 'success' : 'secondary'}">${event.status}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter events
function filterEvents(filter) {
    const eventsList = document.getElementById('eventsList');
    const today = new Date().toISOString().split('T')[0];
    const todayDate = new Date();
    
    let filteredEvents = eventsData;
    
    switch(filter) {
        case 'today':
            filteredEvents = eventsData.filter(event => event.date === today);
            break;
        case 'upcoming':
            filteredEvents = eventsData.filter(event => new Date(event.date) > todayDate);
            break;
        case 'all':
        default:
            filteredEvents = eventsData;
            break;
    }
    
    const sortedEvents = filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    eventsList.innerHTML = sortedEvents.map(event => {
        const eventDate = new Date(event.date);
        const isToday = event.date === today;
        const isUpcoming = eventDate > todayDate;
        
        let statusClass = '';
        if (isToday) statusClass = 'today';
        else if (isUpcoming) statusClass = 'upcoming';
        
        return `
            <div class="event-item ${statusClass} slide-in">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="event-title">${event.title}</div>
                        <div class="event-time">${event.time}</div>
                        <div class="event-description">${event.description}</div>
                        <div class="event-date">${formatDate(event.date)} - ${event.location}</div>
                    </div>
                    <div class="text-end">
                        <span class="badge bg-${isToday ? 'danger' : isUpcoming ? 'success' : 'secondary'}">${event.status}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Update countdown timer
function updateCountdown() {
    const durgaPujaDate = new Date('2024-10-16T00:00:00'); // Shashthi - First day
    const now = new Date();
    const timeLeft = durgaPujaDate - now;
    
    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('countdown').innerHTML = `
            <div class="row text-center">
                <div class="col-3">
                    <div class="countdown-item">
                        <div class="countdown-number">${days}</div>
                        <div class="countdown-label">Days</div>
                    </div>
                </div>
                <div class="col-3">
                    <div class="countdown-item">
                        <div class="countdown-number">${hours}</div>
                        <div class="countdown-label">Hours</div>
                    </div>
                </div>
                <div class="col-3">
                    <div class="countdown-item">
                        <div class="countdown-number">${minutes}</div>
                        <div class="countdown-label">Minutes</div>
                    </div>
                </div>
                <div class="col-3">
                    <div class="countdown-item">
                        <div class="countdown-number">${seconds}</div>
                        <div class="countdown-label">Seconds</div>
                    </div>
                </div>
            </div>
        `;
    } else {
        document.getElementById('countdown').innerHTML = `
            <div class="text-center">
                <h3>🎉 Durga Puja is here! 🎉</h3>
                <p>May Goddess Durga bless us all!</p>
            </div>
        `;
    }
}

// Load data function has been removed as we now only use Google Sheets data

// Export data function
function exportData() {
    try {
        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Export finance data
        if (financeData.length > 0) {
            const financeWS = XLSX.utils.json_to_sheet(financeData);
            XLSX.utils.book_append_sheet(wb, financeWS, 'Finance Data');
        }
        
        // Export events data
        if (eventsData.length > 0) {
            const eventsWS = XLSX.utils.json_to_sheet(eventsData);
            XLSX.utils.book_append_sheet(wb, eventsWS, 'Events Data');
        }
        
        // Download file
        XLSX.writeFile(wb, 'Durga_Puja_Data.xlsx');
        showNotification('Data exported successfully!', 'success');
    } catch (error) {
        showNotification('Error exporting data: ' + error.message, 'error');
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS for countdown timer
const countdownStyles = `
<style>
.countdown-item {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    padding: 10px;
    margin: 5px;
}

.countdown-number {
    font-size: 2rem;
    font-weight: bold;
    color: white;
}

.countdown-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 1px;
}

@media (max-width: 768px) {
    .countdown-number {
        font-size: 1.5rem;
    }
    
    .countdown-label {
        font-size: 0.8rem;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', countdownStyles);