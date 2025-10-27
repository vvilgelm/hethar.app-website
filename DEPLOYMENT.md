# METHOD LAB — Deployment Guide

## 📦 What You Have

### 1. Main Landing Page (GitHub Pages)
**Live at:** `https://hethar.app`
- Location: `/public/index.html`
- Deployed via: `gh-pages` branch
- Automatic deployment when you push to `main` branch

### 2. Conversational Intake Form (Next.js App)
**To be deployed on:** Vercel
- Location: `/method-lab-intake/`
- Full CRM integration (Airtable/HubSpot)
- Email notifications (Resend)
- Slack notifications
- Cal.com booking embed

---

## 🚀 Deploy the Intake Form to Vercel

### Step 1: Prepare the Form App

```bash
cd method-lab-intake
npm install
```

### Step 2: Deploy to Vercel

#### Option A: Via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd method-lab-intake
vercel
```

Follow the prompts:
- Link to existing project? **No**
- Project name: `method-lab-intake`
- Directory: `./` (current directory)

#### Option B: Via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repo: `vvilgelm/hethar.app-website`
3. **Important:** Set Root Directory to `method-lab-intake`
4. Add environment variables (see below)
5. Deploy

### Step 3: Add Environment Variables in Vercel

Go to Project Settings → Environment Variables and add:

```
USE_CRM=airtable
AIRTABLE_API_KEY=your_key
AIRTABLE_BASE_ID=your_base
AIRTABLE_TABLE_NAME=Leads
RESEND_API_KEY=your_key
FROM_EMAIL=no-reply@methodlab.app
NOTIFY_EMAILS=team@methodlab.app
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
CAL_URL=https://cal.com/methodlab/intro
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### Step 4: Set Up Integrations

#### Airtable Setup
1. Go to https://airtable.com/account
2. Generate API key
3. Create base with "Leads" table
4. Add fields (see README.md in method-lab-intake/)

#### Resend Setup
1. Sign up at https://resend.com
2. Verify your domain
3. Get API key

#### Slack Setup (Optional)
1. Create incoming webhook
2. Add URL to environment variables

#### Cal.com Setup
1. Get your Cal.com booking URL
2. Add to `CAL_URL` variable

### Step 5: Test the Form

1. Visit your Vercel URL
2. Fill out the form
3. Check:
   - Airtable for new record
   - Email inbox for notifications
   - Slack channel (if configured)
   - Cal.com embed appears after submission

---

## 🔗 Link the Form to Your Main Site

### Option 1: Update Main Site Button

Edit `/public/index.html` and change the "enter the lab" button:

```html
<a href="https://your-vercel-url.vercel.app" class="btn lab-btn">
  <span class="main-text">enter the lab</span>
  <span class="alt-text">ready?</span>
</a>
```

### Option 2: Embed Form Inline

Replace the apply section in `/public/index.html` with an iframe:

```html
<section id="apply" class="apply-section">
  <iframe 
    src="https://your-vercel-url.vercel.app" 
    width="100%" 
    height="800px"
    frameborder="0"
    style="border: none; border-radius: 12px;"
  ></iframe>
</section>
```

### Option 3: Custom Domain

Set up a subdomain like `apply.hethar.app`:

1. In Vercel: Project Settings → Domains → Add `apply.hethar.app`
2. Add CNAME record in your DNS: `apply` → `cname.vercel-dns.com`
3. Update button to point to `https://apply.hethar.app`

---

## 🔄 Update the Main Site

To update the main METHOD LAB landing page:

```bash
# Edit public/index.html
# Then commit and it auto-deploys to GitHub Pages

git add public/index.html
git commit -m "update: main site changes"
git push origin main

# Wait ~30 seconds for GitHub Pages deployment
# Then hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```

---

## 🔄 Update the Form App

To update the intake form:

```bash
cd method-lab-intake

# Make your changes
# Then deploy

vercel --prod
```

Or push to GitHub and Vercel will auto-deploy if connected.

---

## 📊 Monitoring

### Check Form Submissions
- **Airtable:** View your Leads table
- **Email:** Check NOTIFY_EMAILS inbox
- **Slack:** Check your channel

### Check Deployments
- **Main Site:** https://github.com/vvilgelm/hethar.app-website/actions
- **Form App:** https://vercel.com/dashboard (deployments tab)

---

## 🐛 Troubleshooting

### Main Site Not Updating
1. Check GitHub Pages is enabled: Settings → Pages → Source: `gh-pages` branch
2. Wait 1-2 minutes for CDN cache to clear
3. Hard refresh browser: Cmd+Shift+R
4. Try incognito/private mode

### Form Not Submitting
1. Check browser console for errors
2. Verify environment variables in Vercel
3. Test API routes: `/api/lead` should return 500 if env vars missing
4. Check Vercel logs: Dashboard → Project → Logs

### Emails Not Sending
1. Verify Resend API key is correct
2. Check FROM_EMAIL domain is verified in Resend
3. Check Resend dashboard for delivery logs

### Airtable Errors
1. Verify API key has write permissions
2. Check Base ID format: starts with `app`
3. Ensure table name matches exactly (case-sensitive)
4. Check field names match schema

---

## 📱 Embed VSL Video

To add your founder video to the main site:

Edit `/public/index.html`, find the video section:

```html
<div class="video-container">
  <!-- Replace with your video embed -->
  <iframe 
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    width="100%" 
    height="100%"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>
```

Or use Loom, Vimeo, or any video platform.

---

## ✅ Checklist

- [ ] Main site live at `hethar.app`
- [ ] Form app deployed to Vercel
- [ ] Airtable configured with Leads table
- [ ] Resend API key added and domain verified
- [ ] NOTIFY_EMAILS receiving notifications
- [ ] Slack webhook configured (optional)
- [ ] Cal.com URL updated
- [ ] Form linked from main site
- [ ] Test submission end-to-end
- [ ] VSL video embedded (optional)

---

## 🎯 Next Steps

1. **Deploy the intake form to Vercel** (see Step 2 above)
2. **Set up Airtable** with your API key and Leads table
3. **Configure Resend** for email notifications
4. **Link the form** to your main site
5. **Test everything** with a real submission
6. **Add your VSL video** to the main site
7. **Share** `hethar.app` with the world!

---

Need help? Check the README in `/method-lab-intake/` for detailed integration guides.

