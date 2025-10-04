# 🚀 Deployment Guide for hethar.app

## Quick Deploy (3 options)

### Option 1: Netlify (Recommended)

**Step 1:** Install Netlify CLI
```bash
npm install -g netlify-cli
```

**Step 2:** Login to Netlify
```bash
netlify login
```

**Step 3:** Deploy
```bash
cd /Users/vilgelm/hethar.app-website
netlify deploy --prod --dir=public
```

**Step 4:** Set environment variables in Netlify dashboard
- Go to https://app.netlify.com → Your site → Site settings → Environment variables
- Add: `RESEND_API_KEY`, `AIRTABLE_API_KEY`, etc.

**Step 5:** Configure custom domain
- Go to Domain settings → Add custom domain → `hethar.app`
- Update DNS on Namecheap to point to Netlify

---

### Option 2: Vercel

**Step 1:** Install Vercel CLI
```bash
npm install -g vercel
```

**Step 2:** Deploy
```bash
cd /Users/vilgelm/hethar.app-website
vercel --prod
```

**Step 3:** Configure
- Set environment variables in Vercel dashboard
- Connect your custom domain

---

### Option 3: Cloudflare Pages

**Step 1:** Install Wrangler
```bash
npm install -g wrangler
```

**Step 2:** Login
```bash
wrangler login
```

**Step 3:** Deploy
```bash
cd /Users/vilgelm/hethar.app-website
wrangler pages publish public --project-name=hethar-app
```

---

## DNS Configuration (Namecheap)

### For Netlify:
Add these records in Namecheap DNS:

```
Type    Host    Value
A       @       75.2.60.5
CNAME   www     your-site-name.netlify.app
```

### For Vercel:
```
Type    Host    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### For Cloudflare Pages:
```
Type    Host    Value
CNAME   @       your-project.pages.dev
CNAME   www     your-project.pages.dev
```

---

## Post-Deployment Checklist

### ✅ Functionality Tests
- [ ] Console sequence types correctly
- [ ] City detection works
- [ ] Shadow cursor follows mouse
- [ ] Memory residue draws
- [ ] Dossiers scroll smoothly
- [ ] Whispers appear on idle
- [ ] Exit intent works
- [ ] Contact form submits (check backend logs)
- [ ] 404 page loads
- [ ] Offline page works
- [ ] Service worker registers

### ✅ Performance
- [ ] First paint < 1s
- [ ] Total JS < 60KB
- [ ] Lighthouse score > 90

### ✅ Security
- [ ] HTTPS enabled
- [ ] Security headers present (check devtools → Network → Headers)
- [ ] CSP working (no console errors)

### ✅ SEO
- [ ] Meta tags present (view-source)
- [ ] OG image loads (test: https://metatags.io)
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Google Search Console submitted

### ✅ Analytics
- [ ] Plausible events firing (check dashboard)
- [ ] `page_load` event tracked
- [ ] `contact_submit` event tracked

---

## Backend Setup

### Email Service (Resend)
1. Sign up: https://resend.com
2. Get API key
3. Add to environment variables: `RESEND_API_KEY=re_xxx`
4. Uncomment email code in `api/contact.js`

### Database (Airtable)
1. Create base: https://airtable.com
2. Create table "Contacts" with fields: Contact, Timestamp, Source, IP
3. Get API key + Base ID
4. Add to environment: `AIRTABLE_API_KEY=xxx`, `AIRTABLE_BASE_ID=xxx`
5. Uncomment Airtable code in `api/contact.js`

### Alternative: Supabase
```javascript
// In api/contact.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

await supabase.from('contacts').insert({
  contact: trimmed,
  timestamp,
  source,
  ip
});
```

---

## Monitoring

### Uptime Monitoring
- Add to UptimeRobot: https://uptimerobot.com
- Monitor: https://hethar.app

### Error Tracking (Sentry)
```html
<!-- Add to <head> in index.html -->
<script src="https://js.sentry-cdn.com/xxx.min.js"></script>
```

### Analytics Dashboard
- Plausible: https://plausible.io/hethar.app
- Track: page_load, dossier_view, contact_submit, etc.

---

## Troubleshooting

### Contact form not working
- Check browser console for errors
- Verify API endpoint is accessible: `/api/contact`
- Check backend logs in Netlify/Vercel functions
- Verify environment variables are set

### Effects not working
- Check "Pause presence" toggle (top-left)
- Check browser supports modern JavaScript
- Check reduced-motion preference: System Preferences → Accessibility
- Check console for errors

### Mobile issues
- Test on real device (not just simulator)
- Check safe-area insets are working
- Verify touch swipe works
- Test in Safari iOS (not just Chrome)

---

## Production Optimizations

### Enable Brotli Compression
Already configured in `netlify.toml` and `_headers`.

### Enable CDN Caching
Assets are cached for 1 year (immutable).
HTML is always fresh (max-age=0).

### Add Custom 404/500
Already implemented: `404.html` and `500.html`.

### Monitor Bundle Size
```bash
# Check JS size
wc -c public/index.html
# Should be < 100KB total HTML+CSS+JS
```

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Test in incognito mode
3. Check Netlify/Vercel function logs
4. Email: team@hethar.app

---

**Now deploy and watch people screenshot the fuck out of it.** 🎭

