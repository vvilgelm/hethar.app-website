# Deploy Form Backend to Vercel + usemethod.pro

## 🚀 Step-by-Step Deployment

### Step 1: Deploy to Vercel (5 minutes)

1. **Go to Vercel:** https://vercel.com/signup
   - Sign up with GitHub (easiest)

2. **Import Your Repository:**
   - Click "Add New..." → "Project"
   - Select: `vvilgelm/hethar.app-website`

3. **Configure Project Settings:**
   - **Project Name:** `usemethod-api` (or any name you like)
   - **Framework Preset:** Next.js
   - **Root Directory:** Click "Edit" → Select `method-lab-intake` ✅ (IMPORTANT!)
   - Leave build settings as default

4. **Add Environment Variables:**
   Click "Environment Variables" and add:

   **Required:**
   ```
   GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
   (Get this from Google Sheets Apps Script deployment - see GOOGLE_SHEETS_SETUP.md)

   **Optional but recommended:**
   ```
   NOTIFY_EMAILS=your-email@gmail.com
   FROM_EMAIL=no-reply@usemethod.pro
   ```

5. **Click "Deploy"**
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://usemethod-api.vercel.app`

---

### Step 2: Connect Custom Domain

#### Option A: Use Subdomain (Recommended)
Use `api.usemethod.pro` for your form backend:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Domains
   - Click "Add Domain"
   - Enter: `api.usemethod.pro`
   - Click "Add"

2. **In Your DNS Provider:**
   Add this CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: cname.vercel-dns.com
   ```

3. **Wait 5-10 minutes** for DNS propagation
   - Vercel will auto-provision SSL certificate

#### Option B: Use Path on Main Domain
Keep everything on `usemethod.pro/api/lead`:

1. Create a `vercel.json` in your main site
2. Add proxy rules (more complex, not recommended)

---

### Step 3: Update Your Website Form

Update the form in `public/index.html`:

**Find this line (~line 1002):**
```javascript
fetch('/api/lead', {
```

**Change to:**
```javascript
fetch('https://api.usemethod.pro/api/lead', {
```

Or use the Vercel URL if you skip custom domain:
```javascript
fetch('https://usemethod-api.vercel.app/api/lead', {
```

**Commit and push:**
```bash
git add public/index.html
git commit -m "Update form API endpoint"
git push origin main
```

---

## ✅ Testing Your Deployment

### Test the API:
```bash
curl -X POST https://api.usemethod.pro/api/lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "startup": "Test Co",
    "building": "Testing the form",
    "drag": "testing",
    "stage": "launched"
  }'
```

Should return: `{"ok":true}`

### Test the Form:
1. Visit `https://usemethod.pro`
2. Fill out the form
3. Submit
4. Check your Google Sheet for new row!

---

## 🔧 Troubleshooting

### "404 Not Found"
- Check Root Directory is set to `method-lab-intake` in Vercel
- Redeploy if needed

### "500 Internal Server Error"
- Check Environment Variables are set in Vercel
- Check Vercel Logs: Dashboard → Your Project → Deployments → Latest → View Function Logs

### DNS Not Working
- Wait 5-15 minutes for propagation
- Check DNS with: `dig api.usemethod.pro CNAME`
- Should show: `cname.vercel-dns.com`

### Form Not Submitting
- Check browser console for CORS errors
- Verify API URL in form is correct
- Test API endpoint with curl command above

---

## 📊 Quick DNS Setup Summary

For your domain registrar, add these records:

**Main site (GitHub Pages):**
```
Type: A,    Name: @,    Value: 185.199.108.153
Type: A,    Name: @,    Value: 185.199.109.153
Type: A,    Name: @,    Value: 185.199.110.153
Type: A,    Name: @,    Value: 185.199.111.153
Type: CNAME, Name: www, Value: vvilgelm.github.io
```

**Form API (Vercel):**
```
Type: CNAME, Name: api, Value: cname.vercel-dns.com
```

---

## 🎯 Final Architecture

```
usemethod.pro                    → GitHub Pages (static site)
api.usemethod.pro/api/lead       → Vercel (form backend)
                                    ↓
                               Google Sheets
```

Your visitors will see `usemethod.pro` in their browser, but the form will submit to `api.usemethod.pro` seamlessly!

