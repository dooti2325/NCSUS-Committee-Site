# Google Sheets Integration Setup Guide

This guide will help you connect your Durga Puja Dashboard to Google Sheets for automatic data updates.

## Step 1: Create Google Sheets

### 1.1 Create Finance Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named "Durga Puja Finance Data"
3. Add the following columns in the first row:
   ```
   Type | Category | Amount | Date | Description | Source
   ```
4. Add some sample data:
   ```
   Collection | Sponsors | 50000 | 2024-10-01 | Corporate Sponsorship | ABC Corp
   Collection | Community Donation | 25000 | 2024-10-02 | Community Collection | Local Residents
   Spending | Decor | 30000 | 2024-10-05 | Pandal Decoration | Decor Company
   ```

### 1.2 Create Events Sheet
1. Create another spreadsheet named "Durga Puja Events Data"
2. Add the following columns in the first row:
   ```
   Title | Date | Time | Description | Location | Status
   ```
3. Add some sample data:
   ```
   Mahalaya | 2024-10-12 | 05:00 | Mahalaya Amavasya | Main Pandal | Scheduled
   Shashthi | 2024-10-16 | 06:00 | Goddess Durga arrives | Main Pandal | Scheduled
   ```

## Step 2: Publish Sheets to Web

### 2.1 Publish Finance Sheet
1. Open your Finance spreadsheet
2. Go to **File** → **Share** → **Publish to web**
3. Select "Entire Document" and "Web page"
4. Click **Publish**
5. Copy the generated URL

### 2.2 Publish Events Sheet
1. Open your Events spreadsheet
2. Go to **File** → **Share** → **Publish to web**
3. Select "Entire Document" and "Web page"
4. Click **Publish**
5. Copy the generated URL

## Step 3: Update Configuration

### 3.1 Get Sheet IDs
From your published URLs, extract the Sheet IDs:
- URL format: `https://docs.google.com/spreadsheets/d/SHEET_ID/pub?output=csv`
- Example: `https://docs.google.com/spreadsheets/d/1ABC123DEF456/pub?output=csv`

### 3.2 Update script.js
Open `script.js` and update the `GOOGLE_SHEETS_CONFIG`:

```javascript
const GOOGLE_SHEETS_CONFIG = {
    // Replace with your actual Google Sheets URLs
    financeSheetUrl: 'https://docs.google.com/spreadsheets/d/YOUR_FINANCE_SHEET_ID/pub?output=csv',
    eventsSheetUrl: 'https://docs.google.com/spreadsheets/d/YOUR_EVENTS_SHEET_ID/pub?output=csv',
    refreshInterval: 300000 // 5 minutes
};
```

Replace `YOUR_FINANCE_SHEET_ID` and `YOUR_EVENTS_SHEET_ID` with your actual Sheet IDs.

## Step 4: Test the Integration

1. Start your local server: `python server.py`
2. Open `http://localhost:8000/durga-puja.html`
3. The dashboard should automatically load data from your Google Sheets
4. Make changes in your Google Sheets and refresh the page to see updates

## Step 5: Automatic Updates

The dashboard will automatically:
- Load data when the page loads
- Refresh data every 5 minutes
- Show notifications when data is loaded
- Fall back to sample data if Google Sheets is unavailable

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure your sheets are published to web
2. **Data not loading**: Check that your sheet URLs are correct
3. **Wrong data format**: Ensure your sheet has the correct column headers
4. **No updates**: The refresh interval is 5 minutes by default

### Data Format Requirements:

**Finance Sheet Columns:**
- Type: "Collection" or "Spending"
- Category: Any category name
- Amount: Numeric value
- Date: YYYY-MM-DD format
- Description: Text description
- Source: Source of the transaction

**Events Sheet Columns:**
- Title: Event name
- Date: YYYY-MM-DD format
- Time: HH:MM format
- Description: Event description
- Location: Event location
- Status: "Scheduled", "Completed", etc.

## Security Notes

- Published Google Sheets are publicly accessible
- Only share data that is meant to be public
- Consider using Google Sheets API for more secure access (requires authentication)

## Advanced Configuration

### Change Refresh Interval
Update the `refreshInterval` in `GOOGLE_SHEETS_CONFIG`:
```javascript
refreshInterval: 60000 // 1 minute
refreshInterval: 300000 // 5 minutes (default)
refreshInterval: 900000 // 15 minutes
```

### Add Manual Refresh Button
Add this HTML to your dashboard:
```html
<button id="refreshData" class="btn btn-primary">
    <i class="fas fa-sync-alt"></i> Refresh Data
</button>
```

The button will automatically work with the existing JavaScript code.

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify your Google Sheets URLs
3. Ensure your sheets are published to web
4. Check that your data format matches the requirements 