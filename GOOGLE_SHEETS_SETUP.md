# Google Sheets Form Data Collection Setup

## 📝 Step-by-Step Instructions

### 1. Create Your Google Sheet

1. Go to https://sheets.google.com
2. Create a new sheet called "METHOD Leads"
3. In row 1, add these headers:
   ```
   Timestamp | Name | Email | Startup | Building | Drag | Tried | Stage | Acquisition | Blocker | Final Note
   ```

### 2. Add Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete any existing code
3. Paste this code:

```javascript
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add a new row with the form data
    sheet.appendRow([
      new Date(),                    // Timestamp
      data.name || '',               // Name
      data.email || '',              // Email
      data.startup || '',            // Startup
      data.building || '',           // Building (what they're making)
      data.drag || '',               // Biggest Drag
      data.tried || '',              // What they tried
      data.stage || '',              // Stage
      data.acquisition || '',        // Acquisition channel
      data.blocker || '',            // Blocker
      data.finalNote || ''           // Final note
    ]);
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Save** (💾 icon)
5. Click **Deploy → New deployment**
6. Click the gear icon ⚙️ next to "Select type"
7. Choose **Web app**
8. Configure:
   - Description: "METHOD Form Handler"
   - Execute as: **Me**
   - Who has access: **Anyone**
9. Click **Deploy**
10. **Copy the Web App URL** (it looks like: `https://script.google.com/macros/s/AKfyc.../exec`)
11. Click **Done**

### 3. Test It (Optional)

You can test the webhook with this curl command:

```bash
curl -X POST "YOUR_WEBHOOK_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "startup": "Test Startup",
    "building": "AI Tool",
    "drag": "traffic-flat",
    "stage": "launched"
  }'
```

Check your Google Sheet - you should see a new row!

---

## 🔧 Alternative: Email-Only Setup (No Sheets)

If you just want emails with the form data, you can use:

### Resend (Recommended - Free 100/day)
1. Sign up at https://resend.com
2. Verify your domain `usemethod.pro`
3. Get API key

### Or use Gmail SMTP
- Just configure with your Gmail credentials
- No API needed

---

## 📊 Alternative: Notion Database

1. Create a Notion database
2. Use Notion API to send form data
3. Get API key from https://www.notion.so/my-integrations

---

## 🎯 What You Need for Your Website

Once you deploy the form backend to Vercel, you'll add this environment variable:

```
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/AKfyc.../exec
```

That's it! Every form submission will automatically appear in your Google Sheet.

