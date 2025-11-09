# 📧 Email-Only Setup for hethar.app Form

## ⏱️ Total Time: ~7 minutes

Super simple! Just get an API key and deploy. Every form submission will arrive in your email inbox.

---

## 🎯 What You'll Get:

Every time someone submits the form, you'll receive an email with:
- ✅ All their answers
- ✅ Their contact info
- ✅ Full JSON data (for import to spreadsheet if needed later)

**BONUS:** The user also gets a confirmation email!

---

## 📋 STEP 1: Get Resend API Key (3 minutes)

Resend is a developer-friendly email service. Free tier = 100 emails/day (plenty!).

### 1.1 Sign Up

1. Go to: **https://resend.com/signup**
2. Sign up with your email or GitHub
3. Verify your email

### 1.2 Add Your Domain (for professional emails)

**Option A: Use hethar.app (Recommended)**

1. In Resend dashboard, click **"Domains"**
2. Click **"Add Domain"**
3. Enter: `hethar.app`
4. Resend will show you DNS records to add
5. Add these **TXT records** to your DNS (where you manage hethar.app):
   ```
   Type: TXT
   Name: resend._domainkey
   Value: [value from Resend]
   
   Type: TXT
   Name: @
   Value: [value from Resend]
   ```
6. Wait 5-10 minutes, click **"Verify"** in Resend

**Option B: Use Resend's Domain (Quick test)**

Skip domain setup and use: `onboarding@resend.dev` (comes with free tier)

### 1.3 Get API Key

1. In Resend dashboard, click **"API Keys"**
2. Click **"Create API Key"**
3. Name it: "hethar Form"
4. Click **"Add"**
5. **📋 COPY THE API KEY** (starts with `re_`)
6. **SAVE IT** - you'll need it in Step 2!

✅ **Resend is ready!**

---

## 🚀 STEP 2: Deploy to Vercel (4 minutes)

### 2.1 Sign Up for Vercel

1. Go to: **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Sign in and authorize

### 2.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Find: **`hethar.app-website`**
3. Click **"Import"**

### 2.3 Configure Build Settings

⚠️ **CRITICAL:**

1. Find **"Root Directory"**
2. Click **"Edit"**
3. Type: `method-lab-intake`
4. Click **"Continue"**

### 2.4 Add Environment Variables

Add these **3 variables**:

**Variable 1:**
- **Name:** `RESEND_API_KEY`
- **Value:** Your API key from Step 1.3 (starts with `re_`)

**Variable 2:**
- **Name:** `FROM_EMAIL`
- **Value:** 
  - If you verified hethar.app: `no-reply@hethar.app`
  - If using Resend domain: `onboarding@resend.dev`

**Variable 3:**
- **Name:** `NOTIFY_EMAILS`
- **Value:** Your email where you want to receive form submissions
  - Example: `youremail@gmail.com`
  - Multiple emails: `email1@gmail.com,email2@gmail.com`

### 2.5 Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. **🎉 Deployment complete!**
4. **📋 COPY YOUR DEPLOYMENT URL**
   - Looks like: `https://hethar-app-website-xxx.vercel.app`

✅ **Backend deployed!**

---

## 🔗 STEP 3: Connect Website to Backend

**Just tell me your Vercel URL and I'll update the website!**

Say something like:
> "My Vercel URL is: https://hethar-app-website-abc123.vercel.app"

I'll automatically:
- Update the form endpoint
- Deploy the changes
- Your form will be live!

---

## ✅ STEP 4: Test It!

1. Visit: **https://hethar.app**
2. Fill out the form
3. Click submit
4. **Check your email inbox!** 📬

You should receive an email with all the form data!

---

## 📧 What the Email Looks Like:

```
Subject: New lead — John Doe (john@example.com)

New Lead Received
=================

Name: John Doe
Email: john@example.com
Startup: example.com

Building:
AI-powered analytics tool

Biggest Drag: traffic-flat
What They've Tried: SEO, ads
Stage: launched
Acquisition: organic
Blocker: N/A
Final Note: Looking forward to chatting!

---
JSON:
{
  "name": "John Doe",
  "email": "john@example.com",
  ...
}
```

---

## 💡 Pro Tips:

### Save Emails to Spreadsheet Later
The email includes JSON data - you can:
1. Copy the JSON from emails
2. Use a tool like [JSON to CSV converter](https://www.convertcsv.com/json-to-csv.htm)
3. Import to Google Sheets/Excel

### Create Gmail Filter
Set up a filter to auto-label form submissions:
1. Search: `from:(noreply@hethar.app) subject:(New lead)`
2. Create filter → Apply label "Form Submissions"

### Forward to Slack
Use Gmail → Slack integration to get instant notifications

---

## 🆘 Troubleshooting

### "Email not arriving"
- ✅ Check spam folder
- ✅ Verify RESEND_API_KEY is correct in Vercel
- ✅ Verify FROM_EMAIL domain is verified in Resend
- ✅ Check Resend dashboard → Logs for errors

### "User not getting confirmation"
- This is optional, don't worry if it fails
- Usually means FROM_EMAIL domain isn't verified

### Form submits but no email
- Check Vercel logs: Project → Deployments → Latest → View Function Logs
- Look for "✅ Email with form data sent"

---

## 🎯 Ready?

**Start with STEP 1:** Get your Resend API key!

When you have it, move to STEP 2 (Vercel).

After deployment, come back and share your Vercel URL - I'll connect everything! 🚀

