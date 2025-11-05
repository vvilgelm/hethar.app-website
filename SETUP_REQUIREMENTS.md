# METHOD LAB — Complete Setup Requirements

## 🎯 What You Need to Make EVERYTHING Work

This is the **complete list** of everything you need to provide, configure, and set up to have a fully functional METHOD LAB website with all features working.

---

## ✅ MAIN WEBSITE (Currently Live at usemethod.pro)

### What's Already Working:
- [x] Domain: `usemethod.pro` is live
- [x] Design & interactions
- [x] All animations
- [x] Basic contact form (frontend only)

### What You Need to Provide:

#### 1. **Founder VSL Video** 
**What**: Your 3-minute video explaining METHOD LAB  
**Where**: Section 4 of the homepage  
**How**: 
- Upload video to YouTube, Vimeo, or Loom
- Get embed code
- Replace placeholder in `/public/index.html` line ~XX

**Example**:
```html
<!-- Find this in public/index.html -->
<div class="video-container">
  [VSL embed placeholder — add your video URL]
</div>

<!-- Replace with: -->
<div class="video-container">
  <iframe 
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    width="100%" 
    height="100%"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>
```

**Cost**: Free (YouTube/Loom) or $7/mo (Vimeo)  
**Status**: ⚠️ NEEDED

---

## 📋 CONVERSATIONAL INTAKE FORM (Next.js App)

This is the advanced form system with CRM integration. You need to deploy it and connect it to services.

### Required Services & API Keys:

#### 2. **Vercel Account** (Free Tier Works)
**What**: Hosting platform for the Next.js form app  
**Why**: Deploy the conversational intake form  
**How**:
1. Sign up at https://vercel.com (free)
2. Connect your GitHub account
3. Import repo: `vvilgelm/usemethod.pro-website`
4. Set root directory to: `method-lab-intake`
5. Deploy

**Cost**: Free (Hobby plan supports everything)  
**Status**: ⚠️ NEEDED

---

#### 3. **Airtable Account + API Key**
**What**: Database to store lead information  
**Why**: Track all form submissions  
**How**:

**Step 1: Create Airtable Account**
- Go to https://airtable.com/signup
- Sign up (free tier is fine for now)

**Step 2: Create Base & Table**
- Click "Create a base"
- Name it: "METHOD LAB Leads"
- Click on the default table, rename it to: `Leads`

**Step 3: Create These Fields** (exact names):
| Field Name | Field Type |
|------------|------------|
| Product Name | Single line text |
| Product URL | URL |
| Stage | Single line text |
| Goals (90d) | Long text |
| Channels | Long text |
| Budget Band | Single line text |
| Success Metric | Long text |
| Name | Single line text |
| Email | Email |
| Timezone | Single line text |
| Twitter | Single line text |
| Source | Single line text |
| Booked? | Checkbox |
| Created At | Date |

**Step 4: Get API Credentials**
- Go to https://airtable.com/account
- Click "Generate API key"
- Copy the key (starts with `key...`)

**Step 5: Get Base ID**
- Open your base in Airtable
- Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
- Copy the part that starts with `app` (e.g., `appBa8tS4N5Xk2Oj9`)

**What to Provide**:
```
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Leads
```

**Cost**: Free (up to 1,200 records/base)  
**Status**: ⚠️ REQUIRED

---

#### 4. **Resend Account + API Key**
**What**: Email service for sending notifications  
**Why**: Send emails to you when leads submit + confirmation to leads  
**How**:

**Step 1: Create Resend Account**
- Go to https://resend.com/signup
- Sign up with your email

**Step 2: Verify Your Domain**
- Go to Domains → Add Domain
- Enter: `usemethod.pro` (or use a subdomain like `mail.usemethod.pro`)
- Add DNS records they provide:
  - TXT record for verification
  - MX records for email
  - DKIM records for authentication
- Wait for verification (~5-30 minutes)

**Step 3: Get API Key**
- Go to API Keys
- Click "Create API Key"
- Name it: "METHOD LAB Production"
- Copy the key (starts with `re_...`)

**Step 4: Set Email Addresses**
- Decide on FROM email: `no-reply@usemethod.pro` or `hello@usemethod.pro`
- Decide where YOU want to receive notifications: `your@email.com`

**What to Provide**:
```
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
FROM_EMAIL=no-reply@usemethod.pro
NOTIFY_EMAILS=your@email.com,partner@email.com
```

**Cost**: Free (100 emails/day) or $20/mo (unlimited)  
**Status**: ⚠️ REQUIRED

---

#### 5. **Cal.com Account + Booking Link**
**What**: Calendar booking system  
**Why**: Let leads book a call with you after submitting  
**How**:

**Step 1: Create Cal.com Account**
- Go to https://cal.com/signup
- Sign up (free tier works)

**Step 2: Set Up Event Type**
- Click "Event Types" → "New Event Type"
- Name: "METHOD LAB Intro Call"
- Duration: 30 or 60 minutes
- Set your availability
- Save

**Step 3: Get Booking URL**
- Click on your event type
- Copy the public URL (e.g., `https://cal.com/yourusername/intro`)

**Step 4: Optional - Set Up Webhook**
- Go to Settings → Developer → Webhooks
- Add webhook: `https://your-vercel-app.vercel.app/api/cal-webhook`
- Select trigger: "Booking Created"
- Copy signing secret

**What to Provide**:
```
CAL_URL=https://cal.com/yourusername/intro
CAL_SIGNING_SECRET=cal_XXX... (optional)
```

**Cost**: Free (basic features) or $12/mo (pro features)  
**Status**: ⚠️ REQUIRED

---

#### 6. **Slack Webhook** (OPTIONAL)
**What**: Get pinged in Slack when leads submit  
**Why**: Real-time notifications to your team  
**How**:

**Step 1: Create Slack Webhook**
- Go to https://api.slack.com/messaging/webhooks
- Click "Create your Slack app"
- Choose "From scratch"
- Name: "METHOD LAB Leads"
- Choose your workspace

**Step 2: Activate Incoming Webhooks**
- Go to "Incoming Webhooks"
- Toggle "Activate Incoming Webhooks" to ON
- Click "Add New Webhook to Workspace"
- Choose channel (e.g., #leads or #sales)
- Authorize

**Step 3: Copy Webhook URL**
- Copy the webhook URL (starts with `https://hooks.slack.com/services/...`)

**What to Provide**:
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR_WEBHOOK_URL_HERE
```

**Cost**: Free  
**Status**: ⭐ OPTIONAL (but recommended)

---

### Summary: Environment Variables for Vercel

Once you have all the above, add these to your Vercel project:

```bash
# CRM (REQUIRED)
USE_CRM=airtable
AIRTABLE_API_KEY=keyXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Leads

# Email (REQUIRED)
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXX
FROM_EMAIL=no-reply@usemethod.pro
NOTIFY_EMAILS=your@email.com

# Calendar (REQUIRED)
CAL_URL=https://cal.com/yourusername/intro
NEXT_PUBLIC_CAL_URL=https://cal.com/yourusername/intro

# Slack (OPTIONAL)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/HERE

# App URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🔗 CONNECTING EVERYTHING TOGETHER

### 7. **Link Form to Main Site**

Once your Vercel app is deployed (e.g., `https://methodlab-intake.vercel.app`), update the main site:

**Option A: Direct Link**
Edit `/public/index.html`, find the "enter the lab" button:

```html
<!-- Change from: -->
<a href="#apply" class="btn lab-btn">

<!-- To: -->
<a href="https://your-vercel-app.vercel.app" class="btn lab-btn">
```

**Option B: Custom Subdomain** (Recommended)
1. In Vercel: Settings → Domains → Add `apply.usemethod.pro`
2. Add CNAME in your DNS: `apply` → `cname.vercel-dns.com`
3. Update button to: `href="https://apply.usemethod.pro"`

**Status**: ⚠️ NEEDED AFTER FORM DEPLOYMENT

---

## 💳 COST SUMMARY

| Service | Free Tier | Paid Plan | What You Need |
|---------|-----------|-----------|---------------|
| **Vercel** | ✅ Unlimited (Hobby) | $20/mo (Pro) | Free tier is perfect |
| **Airtable** | ✅ 1,200 records/base | $10/mo (Plus) | Free tier works |
| **Resend** | ✅ 100 emails/day | $20/mo (unlimited) | Free tier initially |
| **Cal.com** | ✅ Basic features | $12/mo (Pro) | Free tier works |
| **Slack** | ✅ Always free | - | Optional |
| **GitHub Pages** | ✅ Always free | - | Already using |
| **Domain (usemethod.pro)** | - | ~$12/year | Already have |

**Total Monthly Cost (Free Tier)**: $0  
**Total Monthly Cost (All Paid)**: ~$62/mo  
**Recommended Start**: $0 (free tier everything)

---

## 📧 EMAIL SETUP

### 8. **DNS Records for Resend**

You'll need to add these DNS records to `usemethod.pro`:

**TXT Record** (Verification):
```
Name: @
Value: [Provided by Resend]
```

**MX Records** (Email Delivery):
```
Priority: 10
Name: @
Value: feedback-smtp.us-east-1.amazonses.com
```

**DKIM Records** (Authentication):
```
Name: [Provided by Resend, looks like: resend._domainkey]
Value: [Long string provided by Resend]
Type: TXT
```

**SPF Record**:
```
Name: @
Value: v=spf1 include:amazonses.com ~all
Type: TXT
```

**Where to Add**:
- Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
- Find "DNS Management" or "DNS Records"
- Add each record exactly as Resend shows you

**Status**: ⚠️ REQUIRED (for emails to work)

---

## 🧪 TESTING CHECKLIST

After everything is set up, test each feature:

### Main Website
- [ ] Visit `https://usemethod.pro`
- [ ] Custom cursor follows mouse (desktop)
- [ ] Scroll animations trigger
- [ ] SVG diagram draws itself
- [ ] "enter the lab" button flickers to "ready?" on hover
- [ ] All sections visible and styled correctly
- [ ] Video plays (after you add embed)
- [ ] Footer hover effects work

### Form Submission Flow
- [ ] Visit form app (Vercel URL or `apply.usemethod.pro`)
- [ ] Fill out all questions
- [ ] Questions reveal progressively as you type
- [ ] Typing indicators appear
- [ ] Responses show after 800ms
- [ ] Submit button clickable
- [ ] Success message appears
- [ ] Cal.com embed appears inline

### Backend Integration
- [ ] New record appears in Airtable
- [ ] You receive email notification
- [ ] Lead receives confirmation email
- [ ] Slack message appears (if configured)
- [ ] Check Vercel logs for any errors

### Calendar Integration
- [ ] Click Cal.com embed after form submission
- [ ] Can select date/time
- [ ] Booking confirmation works
- [ ] Airtable "Booked?" checkbox updates (if webhook configured)

---

## 🚀 DEPLOYMENT STEPS (In Order)

### Step 1: Set Up Services (Before Deployment)
1. Create Airtable account → Create base → Get API key & Base ID
2. Create Resend account → Verify domain → Get API key
3. Create Cal.com account → Create event type → Get booking URL
4. Optional: Create Slack webhook

### Step 2: Deploy Form to Vercel
1. Go to https://vercel.com/new
2. Import GitHub repo: `vvilgelm/usemethod.pro-website`
3. **Set Root Directory**: `method-lab-intake`
4. Add all environment variables (see summary above)
5. Click "Deploy"
6. Wait 2-3 minutes
7. Copy Vercel URL (e.g., `methodlab-intake.vercel.app`)

### Step 3: Test Form App
1. Visit Vercel URL
2. Fill out form completely
3. Submit
4. Check Airtable for new record
5. Check email for notifications
6. Verify Cal.com embed appears

### Step 4: Update Main Site
1. Edit `/public/index.html`
2. Update "enter the lab" button href
3. Add your VSL video embed
4. Commit and push:
```bash
cd /Users/vilgelm/usemethod.pro-website
git add public/index.html
git commit -m "update: add form link and VSL video"
git push origin main
```

### Step 5: Deploy to GitHub Pages
Wait ~30 seconds for auto-deployment, then visit `usemethod.pro`

### Step 6: Optional - Custom Domain for Form
1. In Vercel: Project → Settings → Domains
2. Add `apply.usemethod.pro`
3. Add CNAME in DNS: `apply` → `cname.vercel-dns.com`
4. Update main site button to `https://apply.usemethod.pro`

---

## 📋 QUICK SETUP CHECKLIST

Print this and check off as you go:

**Accounts to Create:**
- [ ] Vercel account
- [ ] Airtable account
- [ ] Resend account
- [ ] Cal.com account
- [ ] Slack workspace (optional)

**Information to Collect:**
- [ ] Airtable API Key
- [ ] Airtable Base ID
- [ ] Resend API Key
- [ ] Cal.com booking URL
- [ ] Slack webhook URL (optional)
- [ ] Email addresses for notifications

**DNS Records to Add:**
- [ ] Resend verification TXT
- [ ] Resend MX records
- [ ] Resend DKIM TXT
- [ ] Resend SPF TXT
- [ ] Cal.com CNAME (if using custom domain)

**Deployment Steps:**
- [ ] Deploy form to Vercel
- [ ] Add environment variables
- [ ] Test form submission
- [ ] Verify Airtable record created
- [ ] Verify emails received
- [ ] Update main site with form link
- [ ] Add VSL video
- [ ] Test end-to-end flow

**Testing:**
- [ ] Main site loads at `usemethod.pro`
- [ ] All animations work
- [ ] Form link works
- [ ] Form submission works
- [ ] Airtable updated
- [ ] Emails sent
- [ ] Slack notification (if configured)
- [ ] Cal.com embed appears
- [ ] Booking works

---

## 🆘 GETTING HELP

If you get stuck on any step:

1. **Check Vercel Logs**:
   - Vercel Dashboard → Project → Logs
   - Look for error messages

2. **Check Airtable**:
   - Is the table name exactly "Leads"?
   - Are field names spelled correctly?
   - Is API key active?

3. **Check Resend Dashboard**:
   - Are emails showing as sent?
   - Is domain verified?
   - Check email deliverability

4. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed requests

5. **Common Issues**:
   - **"AIRTABLE_API_KEY not found"**: Add env var in Vercel
   - **"Domain not verified"**: Wait 30 mins, check DNS records
   - **"Cal.com not loading"**: Check NEXT_PUBLIC_CAL_URL
   - **"No email received"**: Check spam folder, verify FROM_EMAIL domain

---

## 🎯 FINAL CHECKLIST

Everything working when:
- ✅ Main site live at `usemethod.pro`
- ✅ Custom cursor and animations working
- ✅ VSL video playing
- ✅ Form accessible via link/subdomain
- ✅ Form submission creates Airtable record
- ✅ You receive email notification
- ✅ Lead receives confirmation email
- ✅ Slack ping received (optional)
- ✅ Cal.com embed appears after submission
- ✅ Booking through Cal.com works
- ✅ No console errors
- ✅ Mobile responsive

---

## 💡 NEXT STEPS AFTER SETUP

Once everything is working:

1. **Test with Real Data**:
   - Submit 2-3 test leads
   - Verify all notifications
   - Book a test call

2. **Share with Team**:
   - Send main URL to team
   - Explain the flow
   - Set expectations for lead follow-up

3. **Monitor**:
   - Check Airtable daily for new leads
   - Respond within 24h as promised
   - Update "Booked?" checkbox manually if needed

4. **Iterate**:
   - Adjust form questions based on feedback
   - Tweak copy if needed
   - A/B test different CTAs

---

**Everything you need is in this document. Set aside 2-3 hours to complete the setup, and you'll have a fully functional lead generation machine.** 🚀

