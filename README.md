# Durga Puja Dashboard - Netaji Colony Sarbajanin Utsav Samiti

A dynamic web application for managing and displaying financial records and event schedules for the Durga Puja celebration.

## Features

### 📊 Financial Management
- **Interactive Charts**: Visual representation of collections vs. spending using pie charts
- **Category-wise Breakdown**: Collections (Sponsors, Community Donation, Others) and Spending (Decor, Prasad, Artists, etc.)
- **Real-time Updates**: Automatically reflects changes from Excel/Google Sheets
- **Google Sheets Integration**: Direct connection to Google Sheets for automatic updates
- **Export Functionality**: Download data in Excel format

### 📅 Event Schedule
- **Chronological Display**: Events sorted by date and time
- **Filter Options**: View all events, today's events, or upcoming events
- **Status Indicators**: Visual indicators for event status
- **Countdown Timer**: Real-time countdown to Durga Puja

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Beautiful Animations**: Smooth transitions and hover effects
- **Color-coded Elements**: Easy identification of different data types
- **Real-time Notifications**: User feedback for data operations

## Setup Instructions

### 1. File Structure
```
Netaji Colony Sarbajanin Utsav Samiti/
├── index.html          # Main dashboard file
├── styles.css          # Custom styling
├── script.js           # JavaScript functionality
├── sample_finance_data.csv    # Sample finance data
├── sample_events_data.csv     # Sample events data
└── README.md           # This file
```

### 2. Running the Application
1. Start the local server by running `python server.py`
2. The dashboard will automatically open in your default browser
3. The dashboard will load data from the configured Google Sheets automatically
4. If Google Sheets data is unavailable, it will fall back to sample data
5. **Google Sheets Integration**: Already configured with sample sheets. See `GOOGLE_SHEETS_SETUP.md` for customization
1. Start the local server by running `python server.py`
2. The dashboard will automatically open in your default browser
3. The dashboard will load data from the configured Google Sheets automatically
4. If Google Sheets data is unavailable, it will fall back to sample data
5. **Google Sheets Integration**: Already configured with sample sheets. See `GOOGLE_SHEETS_SETUP.md` for customization

### 3. Data Format Requirements

#### Finance Data (Excel/CSV)
Your Excel file should have the following columns:
- **Type**: "Collection" or "Spending"
- **Category**: Category name (e.g., "Sponsors", "Decor", "Prasad")
- **Amount**: Numeric value (in rupees)
- **Date**: Date in YYYY-MM-DD format
- **Description**: Brief description of the transaction
- **Source**: Source of collection or vendor name

Example:
```
Type,Category,Amount,Date,Description,Source
Collection,Sponsors,50000,2024-10-01,Corporate Sponsorship,ABC Corp
Spending,Decor,30000,2024-10-05,Pandal Decoration,Decor Company
```

#### Events Data (Excel/CSV)
Your Excel file should have the following columns:
- **Title**: Event name
- **Date**: Date in YYYY-MM-DD format
- **Time**: Time in HH:MM format
- **Description**: Event description
- **Location**: Event location
- **Status**: Event status (e.g., "Scheduled", "Completed")

Example:
```
Title,Date,Time,Description,Location,Status
Mahalaya,2024-10-12,05:00,Mahalaya Amavasya,Main Pandal,Scheduled
Shashthi,2024-10-16,06:00,Goddess Durga arrives,Main Pandal,Scheduled
```

## Usage Guide

### Loading Data

#### Option 1: Google Sheets Integration (Recommended)
1. **Setup Google Sheets**: Follow the guide in `GOOGLE_SHEETS_SETUP.md`
2. **Configure URLs**: Update the sheet URLs in `script.js`
3. **Automatic Updates**: Data will refresh automatically every 5 minutes
4. **Manual Refresh**: Use the "Refresh from Google Sheets" button

#### Option 2: File Upload (Fallback)
1. **Prepare Excel Files**: Create Excel files with the required format (see sample files)
2. **Upload Files**: Use the file upload section at the bottom of the dashboard
3. **Load Data**: Files will be processed automatically when uploaded
4. **View Results**: Data will be automatically displayed in charts and lists

### Dashboard Features

#### 📈 Financial Overview
- **Total Collection**: Sum of all collections
- **Total Spending**: Sum of all expenditures
- **Balance**: Net amount (Collection - Spending)
- **Upcoming Events**: Count of future events

#### 📊 Charts
- **Collection vs Spending**: Doughnut chart showing income vs. expenditure
- **Collection Categories**: Pie chart showing breakdown of collection sources

#### 📋 Detailed Lists
- **Collections**: Detailed list of all income sources
- **Expenditures**: Detailed list of all spending items
- **Events**: Chronological list of all events with filtering options

### Data Management
- **Auto-refresh**: Data updates automatically every 5 minutes
- **Export**: Download current data as Excel file
- **Notifications**: Real-time feedback for all operations

## Google Sheets Integration

The dashboard now supports direct integration with Google Sheets for automatic data updates. This eliminates the need for manual file uploads.

### Key Benefits:
- **Automatic Updates**: Data refreshes every 5 minutes
- **Real-time Sync**: Changes in Google Sheets appear on the dashboard
- **No Manual Upload**: No need to upload files repeatedly
- **Fallback Support**: File upload still available as backup

### Setup Instructions:
1. **Create Google Sheets**: Set up finance and events sheets
2. **Publish to Web**: Make sheets publicly accessible
3. **Configure URLs**: Update the URLs in `script.js`
4. **Test Integration**: Verify data loads automatically

For detailed setup instructions, see `GOOGLE_SHEETS_SETUP.md`.

## Customization

### Colors and Styling
- Edit `styles.css` to change colors, fonts, and layout
- Modify CSS variables in `:root` for theme changes

### Data Categories
- Update the JavaScript code to add new collection/spending categories
- Modify chart configurations for different visualizations

### Event Types
- Add new event statuses in the JavaScript code
- Customize event display format

## Browser Compatibility

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

## Technical Details

### Libraries Used
- **Bootstrap 5.3.0**: Responsive UI framework
- **Chart.js**: Interactive charts and graphs
- **SheetJS (XLSX)**: Excel file processing
- **Font Awesome**: Icons

### Features
- **No Server Required**: Runs entirely in the browser
- **Offline Capable**: Works without internet connection
- **Data Privacy**: All data stays on your device
- **Cross-platform**: Works on Windows, Mac, Linux

## Support

For technical support or customization requests:
1. Check the sample data files for format examples
2. Ensure Excel files follow the required column structure
3. Use modern browsers for best compatibility
4. Clear browser cache if experiencing issues

## Future Enhancements

- [x] Google Sheets direct integration
- [ ] Multiple language support
- [ ] Advanced reporting features
- [ ] Mobile app version
- [ ] Cloud backup functionality
- [ ] User authentication system

---

**Developed for Netaji Colony Sarbajanin Utsav Samiti**  
*May Goddess Durga bless us all! 🕉️*