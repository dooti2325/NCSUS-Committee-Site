// Durga Puja Dashboard JavaScript

// Global variables
let financeData = [];
let eventsData = [];
let financeChart = null;
let collectionChart = null;

// Google Sheets Configuration
const GOOGLE_SHEETS_CONFIG = {
    // Updated Google Sheets URLs for finance and events data
    financeSheetUrl: 'https://docs.google.com/spreadsheets/d/1wD6e_s4OBn82v6rZ2qBmKCuss6_Tb51X3h1sq71OrUA/pub?output=csv',
    eventsSheetUrl: 'https://docs.google.com/spreadsheets/d/1Yh4B2A3arpPWk7ygb9XH0B5Pzq_Mho_uyyVXk6ecYzU/pub?output=csv',
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
function setupEventListeners() {
    // File upload listeners (kept for fallback)
    document.getElementById('financeFile').addEventListener('change', handleFinanceFileUpload);
    document.getElementById('eventsFile').addEventListener('change', handleEventsFileUpload);
    
    // Manual refresh button (if you add one)
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
                showNotification('Finance data loaded from Google Sheets!', 'success');
            } else {
                console.error('Failed to load finance data from Google Sheets');
                loadSampleData(); // Fallback to sample data
            }
        } catch (error) {
            console.error('Error fetching finance data:', error);
            loadSampleData(); // Fallback to sample data
        }
        
        // Load events data
        try {
            const eventsResponse = await fetch(GOOGLE_SHEETS_CONFIG.eventsSheetUrl);
            if (eventsResponse.ok) {
                const eventsCsv = await eventsResponse.text();
                eventsData = processCsvData(eventsCsv, 'events');
                showNotification('Events data loaded from Google Sheets!', 'success');
            } else {
                console.error('Failed to load events data from Google Sheets');
                loadSampleData(); // Fallback to sample data
            }
        } catch (error) {
            console.error('Error fetching events data:', error);
            loadSampleData(); // Fallback to sample data
        }
        
        updateDashboard();
        
    } catch (error) {
        console.error('Error loading data from Google Sheets:', error);
        showNotification('Error loading data from Google Sheets. Using sample data.', 'warning');
        loadSampleData(); // Fallback to sample data
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

// Handle finance file upload (fallback)
function handleFinanceFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                financeData = processFinanceData(jsonData);
                updateDashboard();
                showNotification('Finance data loaded successfully!', 'success');
            } catch (error) {
                showNotification('Error loading finance data: ' + error.message, 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

// Handle events file upload (fallback)
function handleEventsFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                
                eventsData = processEventsData(jsonData);
                updateDashboard();
                showNotification('Events data loaded successfully!', 'success');
            } catch (error) {
                showNotification('Error loading events data: ' + error.message, 'error');
            }
        };
        reader.readAsArrayBuffer(file);
    }
}

// Process finance data from Excel (fallback)
function processFinanceData(data) {
    return data.map(item => ({
        type: item.Type || item.type || 'Collection',
        category: item.Category || item.category || 'Other',
        amount: parseFloat(item.Amount || item.amount || 0),
        date: item.Date || item.date || new Date().toISOString().split('T')[0],
        description: item.Description || item.description || '',
        source: item.Source || item.source || ''
    }));
}

// Process events data from Excel (fallback)
function processEventsData(data) {
    return data.map(item => ({
        title: item.Title || item.title || 'Event',
        date: item.Date || item.date || new Date().toISOString().split('T')[0],
        time: item.Time || item.time || '00:00',
        description: item.Description || item.description || '',
        location: item.Location || item.location || '',
        status: item.Status || item.status || 'Scheduled'
    }));
}

// Load sample data for demonstration
function loadSampleData() {
    // Sample finance data
    financeData = [
        { type: 'Collection', category: 'Sponsors', amount: 50000, date: '2024-10-01', description: 'Corporate Sponsorship', source: 'ABC Corp' },
        { type: 'Collection', category: 'Community Donation', amount: 25000, date: '2024-10-02', description: 'Community Collection', source: 'Local Residents' },
        { type: 'Collection', category: 'Others', amount: 15000, date: '2024-10-03', description: 'Miscellaneous', source: 'Various' },
        { type: 'Spending', category: 'Decor', amount: 30000, date: '2024-10-05', description: 'Pandal Decoration', source: 'Decor Company' },
        { type: 'Spending', category: 'Prasad', amount: 20000, date: '2024-10-06', description: 'Food Items', source: 'Catering' },
        { type: 'Spending', category: 'Artists', amount: 25000, date: '2024-10-07', description: 'Cultural Program', source: 'Artist Group' },
        { type: 'Spending', category: 'Lighting', amount: 15000, date: '2024-10-08', description: 'Electrical Work', source: 'Electrician' }
    ];

    // Sample events data
    eventsData = [
        { title: 'Mahalaya', date: '2024-10-12', time: '05:00', description: 'Mahalaya Amavasya - Beginning of Durga Puja', location: 'Main Pandal', status: 'Scheduled' },
        { title: 'Shashthi', date: '2024-10-16', time: '06:00', description: 'Goddess Durga arrives with her children', location: 'Main Pandal', status: 'Scheduled' },
        { title: 'Saptami', date: '2024-10-17', time: '06:00', description: 'First day of Durga Puja', location: 'Main Pandal', status: 'Scheduled' },
        { title: 'Ashtami', date: '2024-10-18', time: '06:00', description: 'Sandhi Puja and Kumari Puja', location: 'Main Pandal', status: 'Scheduled' },
        { title: 'Navami', date: '2024-10-19', time: '06:00', description: 'Maha Navami Puja', location: 'Main Pandal', status: 'Scheduled' },
        { title: 'Dashami', date: '2024-10-20', time: '06:00', description: 'Vijaya Dashami - Immersion', location: 'River Ghat', status: 'Scheduled' },
        { title: 'Cultural Program', date: '2024-10-18', time: '19:00', description: 'Evening cultural performances', location: 'Community Hall', status: 'Scheduled' },
        { title: 'Community Feast', date: '2024-10-19', time: '12:00', description: 'Community lunch for all', location: 'Community Ground', status: 'Scheduled' }
    ];

    updateDashboard();
}

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

// Load data function (called from HTML)
function loadData() {
    const financeFile = document.getElementById('financeFile').files[0];
    const eventsFile = document.getElementById('eventsFile').files[0];
    
    if (!financeFile && !eventsFile) {
        showNotification('Please select at least one file to load data.', 'warning');
        return;
    }
    
    if (financeFile) {
        handleFinanceFileUpload({ target: { files: [financeFile] } });
    }
    
    if (eventsFile) {
        handleEventsFileUpload({ target: { files: [eventsFile] } });
    }
}

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