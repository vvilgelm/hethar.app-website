# Method Lab Intake — Conversational Lead Form

A minimal, chat-style intake form for Method Lab that feels like DM'ing a founder, not filling out a corporate form.

## 🎯 Features

- **Chat-style Progressive Form** — Questions reveal one at a time as you answer
- **CRM Integration** — Airtable (default) or HubSpot
- **Email Notifications** — Via Resend (to team + lead confirmation)
- **Slack Notifications** — Optional webhook ping
- **Cal.com Embed** — Book a call right after submitting
- **LocalStorage Persistence** — Answers saved if you refresh
- **Clean, Human Copy** — Sounds like a real person, not a bot

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `env.example` to `.env.local`:

```bash
cp env.example .env.local
```

Fill in your credentials:

```env
# Choose your CRM
USE_CRM=airtable

# Airtable (if using Airtable)
AIRTABLE_API_KEY=your_key_here
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_TABLE_NAME=Leads

# HubSpot (alternative to Airtable)
HUBSPOT_PRIVATE_APP_TOKEN=your_token_here

# Resend (for emails)
RESEND_API_KEY=your_resend_key
FROM_EMAIL=no-reply@methodlab.app
NOTIFY_EMAILS=team@methodlab.app

# Slack (optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Cal.com
CAL_URL=https://cal.com/methodlab/intro
CAL_SIGNING_SECRET=your_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Set Up Airtable (if using Airtable)

Create a table called `Leads` with these fields:

| Field Name | Type |
|------------|------|
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

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Form Flow

The form asks these questions in order:

1. What's your startup called?
2. Product URL (optional)
3. Where are you at right now? (stage)
4. What's your goal for the next 90 days?
5. What's your current engine? (channels)
6. Budget band you're comfortable with?
7. What would make this worth it in 60 days?
8. Best contact name?
9. Email address
10. Timezone (auto-detected)
11. Twitter handle (optional)

After submission:
- Cal.com embed appears inline
- Team gets email notification
- Lead gets friendly confirmation
- Slack gets pinged (if configured)
- Airtable/HubSpot record created

## 🔧 API Routes

### `POST /api/lead`

Submit a new lead.

**Body:**
```json
{
  "product_name": "Acme Inc",
  "product_url": "https://acme.com",
  "stage": "beta",
  "goals": ["paying users", "activation"],
  "channels": ["twitter", "meta ads"],
  "budget_band": "$3–10k",
  "success_metric": "100 paying users",
  "name": "Jane Doe",
  "email": "jane@acme.com",
  "timezone": "America/Los_Angeles",
  "twitter_handle": "@janedoe"
}
```

**Response:**
```json
{
  "ok": true
}
```

### `POST /api/cal-webhook`

Cal.com webhook handler. Marks lead as "Booked" in CRM when they book a call.

**Body:** Cal.com webhook payload (configure in Cal.com settings)

## 🎨 Styling

The form uses Tailwind CSS with a minimal, clean aesthetic:
- White background
- Generous whitespace
- 1px borders
- Black & gray color scheme
- System fonts (Inter)

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
npm run build
```

### Environment Variables in Vercel

Make sure to add all variables from `.env.local` in your Vercel project settings.

## 🔗 Integration Setup

### Airtable

1. Get API key from https://airtable.com/account
2. Find Base ID from your Airtable URL: `https://airtable.com/[BASE_ID]/...`
3. Create table with fields listed above

### HubSpot

1. Create private app in HubSpot
2. Grant `crm.objects.contacts.write` scope
3. Add custom properties for: `product_stage`, `goals_90d`, `channels`, `budget_band`, `success_metric`

### Resend

1. Sign up at https://resend.com
2. Verify your domain
3. Create API key

### Slack

1. Create incoming webhook: https://api.slack.com/messaging/webhooks
2. Add webhook URL to `.env.local`

### Cal.com

1. Get your Cal.com booking URL
2. Optional: Set up webhook in Cal.com to point to `/api/cal-webhook`

## 🐛 Troubleshooting

**Form not submitting:**
- Check browser console for errors
- Verify all env variables are set
- Check API routes in Network tab

**Emails not sending:**
- Verify Resend API key
- Check FROM_EMAIL is a verified domain

**Airtable errors:**
- Verify API key has write permissions
- Check Base ID and Table Name match exactly
- Ensure all required fields exist in table

## 📝 License

MIT

---

Built with ❤️ for Method Lab

