# 🚀 Setup Form Data Storage for hethar.app

Follow these steps to save all form submissions to Google Sheets!

---

## ⏱️ Total Time: ~15 minutes

---

## 📋 STEP 1: Create Google Sheet (5 minutes)

### 1.1 Create the Sheet
1. Go to: **https://sheets.google.com**
2. Click **"+ Blank"** to create new sheet
3. Rename it to: **"hethar Leads"**

### 1.2 Add Column Headers
In **Row 1**, add these headers (copy and paste):

```
Timestamp	Name	Email	Startup	Building	Drag	Tried	Stage	Acquisition	Blocker	Final Note
```

Or add them one by one:
- Column A: `Timestamp`
- Column B: `Name`
- Column C: `Email`
- Column D: `Startup`
- Column E: `Building`
- Column F: `Drag`
- Column G: `Tried`
- Column H: `Stage`
- Column I: `Acquisition`
- Column J: `Blocker`
- Column K: `Final Note`

### 1.3 Create the Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. **Delete all existing code** in the editor
3. **Copy and paste this code:**

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

4. Click the **💾 Save icon** (or press Cmd+S / Ctrl+S)
5. Name it: "hethar Form Handler"

### 1.4 Deploy the Script

1. Click **Deploy** → **New deployment**
2. Click the **⚙️ gear icon** next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** "hethar Form Handler"
   - **Execute as:** **Me** (your email)
   - **Who has access:** **Anyone** ⚠️ (Important!)
5. Click **Deploy**
6. Click **Authorize access**
7. Choose your Google account
8. Click **Advanced** → **Go to hethar Form Handler (unsafe)**
9. Click **Allow**
10. **📋 COPY THE WEB APP URL** (looks like: `https://script.google.com/macros/s/AKfyc...../exec`)
11. **SAVE THIS URL** - you'll need it in the next step!

✅ **Google Sheet is ready!**

---

## 🚀 STEP 2: Deploy Backend to Vercel (5 minutes)

### 2.1 Sign Up for Vercel

1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Sign in with your GitHub account
4. Authorize Vercel

### 2.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find and select: **`hethar.app-website`** (or `vvilgelm/hethar.app-website`)
3. Click **"Import"**

### 2.3 Configure Build Settings

⚠️ **CRITICAL STEP:**

1. Under **"Configure Project"**
2. Find **"Root Directory"**
3. Click **"Edit"**
4. Type: `method-lab-intake`
5. Click **"Continue"**

### 2.4 Add Environment Variable

1. Scroll down to **"Environment Variables"**
2. Add this variable:
   - **Name:** `GOOGLE_SHEETS_WEBHOOK_URL`
   - **Value:** Paste the URL you copied from Step 1.4 (the `https://script.google.com/macros/s/...` URL)
3. Click **"Add"**

### 2.5 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for deployment
3. You'll see **"Congratulations!"** when done
4. **📋 COPY YOUR DEPLOYMENT URL** (looks like: `https://hethar-app-website-xxx.vercel.app`)

✅ **Backend is deployed!**

---

## 🔗 STEP 3: Connect Your Website to the Backend (2 minutes)

### 3.1 Update the Form API Endpoint

Come back to me and share your **Vercel deployment URL**, and I'll update your website to use it!

Or you can tell me: "Update form to use Vercel URL: [your-url]"

---

## ✅ STEP 4: Test It!

Once I update your website:

1. Visit: **https://hethar.app**
2. Fill out the form
3. Submit
4. Check your Google Sheet → **New row should appear!** 🎉

---

## 🆘 Troubleshooting

### Google Script Issues
- Make sure "Who has access" is set to **"Anyone"**
- Make sure you clicked **"Allow"** during authorization
- Test the webhook URL directly with curl (I can help with this)

### Vercel Issues
- Double-check Root Directory is: `method-lab-intake`
- Verify the GOOGLE_SHEETS_WEBHOOK_URL is correct
- Check deployment logs in Vercel dashboard

### Form Not Submitting
- Check browser console (F12) for errors
- Verify the website has been updated with new API URL
- Try in incognito/private mode

---

## 📞 Need Help?

Just tell me:
- "I'm stuck on step X"
- "Can you help with [specific issue]"
- Share your Vercel URL when you get it!

---

**Ready to start? Begin with STEP 1!** 🚀

