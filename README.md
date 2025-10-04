# hethar.app — Presence Breach Website

**Not an assistant. A second presence that lives with you.**

This is the public marketing site for Hethar, implementing the "Presence Breach" concept — an interactive, cinematic experience that demonstrates presence as a product philosophy.

## 🎭 Features

### Core Experience
- **Console Breach**: Typing animation with city detection, authentication, and Matrix-style breach
- **Dossier Screens**: Scroll through philosophical statements, one per viewport
- **Behavior Whispers**: Context-aware messages based on idle time, exit intent, scrolling
- **Final CTA**: "DO YOU WANT TO LIVE WITH IT?" with Y/N choice

### Wild Features (Implemented)
- **Shadow Cursor**: Predictive companion cursor that anticipates user movement
- **Memory Residue**: Visual trail of user's cursor path that fades slowly
- **Temporal Rewind**: Press 'R' to scrub through your session history
- **Proximity Geo**: Optional geolocation for personalized city-aware messages
- **Exit Intent**: Messages when user tries to leave
- **Pause Toggle**: Control for all presence features

### Accessibility & Performance
- Skip intro button with localStorage memory
- Keyboard navigation (arrows, Y/N, ESC, R)
- `prefers-reduced-motion` support
- Focus management and ARIA labels
- Mobile-optimized touch zones
- Safe-area insets for notched devices
- Service worker for offline support

### SEO & Meta
- OpenGraph and Twitter Card tags
- Canonical URLs
- Sitemap.xml and robots.txt
- Semantic HTML structure
- No-JS fallback page

### Security
- Content Security Policy
- HSTS, X-Frame-Options, etc.
- Rate-limited contact API
- Honeypot spam detection
- Input validation

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Cloudflare Pages
```bash
# Install Wrangler
npm install -g wrangler

# Deploy
wrangler pages publish public
```

## 📁 Structure

```
├── public/
│   ├── index.html          # Main presence breach experience
│   ├── noscript.html       # Static fallback for no-JS users
│   ├── 404.html            # 404 error page
│   ├── 500.html            # 500 error page
│   ├── offline.html        # Offline fallback
│   ├── sw.js               # Service worker
│   ├── robots.txt          # SEO crawlers
│   ├── sitemap.xml         # SEO sitemap
│   └── assets/
│       ├── favicons/       # Icons
│       ├── fonts/          # Custom fonts (if any)
│       └── opengraph/      # Social share images
├── api/
│   └── contact.js          # Serverless contact form handler
├── netlify.toml            # Netlify configuration
├── vercel.json             # Vercel configuration
└── _headers                # HTTP security headers
```

## 🔧 Configuration

### Environment Variables

Set these in your hosting platform (Netlify/Vercel dashboard):

```bash
# Email service (Resend, SendGrid, etc.)
RESEND_API_KEY=your_key_here

# Database (Airtable, Supabase, etc.)
AIRTABLE_API_KEY=your_key_here
AIRTABLE_BASE_ID=your_base_id

# Analytics (optional)
PLAUSIBLE_DOMAIN=hethar.app
```

### Analytics

The site uses [Plausible.io](https://plausible.io) for privacy-friendly analytics. Events tracked:

- `page_load` - Initial page load
- `skip_intro` - User skips intro sequence
- `dossier_view` - User scrolls to new dossier
- `dossier_start` - Dossiers begin showing
- `geo_prompt_show` - Proximity permission shown
- `geo_allow` / `geo_skip` - Geo permission response
- `modal_open` - Contact modal opened
- `contact_submit_success` - Form submitted successfully
- `whisper_show` - Behavior whisper displayed
- `exit_intent` - User attempts to leave
- `presence_toggle` - Presence features paused/resumed

### API Rate Limiting

The contact API implements in-memory rate limiting:
- 3 submissions per hour per IP
- Honeypot spam detection
- Email/phone validation
- CORS enabled for cross-origin requests

For production, use Redis or KV storage for distributed rate limiting.

## 🎨 Customization

### Copy
All text is hardcoded in `index.html` in the `LINES` array. Edit that array to change the dossier screens.

### Colors
Edit CSS variables in `:root`:
```css
--bg: #000;           /* Background */
--fg: #e8e8e8;        /* Foreground text */
--muted: #9aa0a6;     /* Muted text */
--accent: #00ff7f;    /* Accent (green) */
```

### Behavior
Adjust timeouts and thresholds in the JavaScript `CONFIG` object:
```javascript
const CONFIG = {
  apiEndpoint: '/api/contact',
  skipIntroKey: 'hethar_skip_intro',
  // ... etc
};
```

## 📱 Mobile Support

- Touch swipe navigation (up/down to navigate dossiers)
- iOS Safari 100vh fixes
- Safe-area insets for notched devices
- Debounced scroll on mobile
- Thumb-zone optimized buttons
- Hidden rewind UI on mobile (desktop-only feature)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Skip intro works and persists
- [ ] Console sequence types correctly
- [ ] City detection shows proper node
- [ ] Dossiers scroll smoothly
- [ ] Keyboard nav works (arrows, Y/N, R, ESC)
- [ ] Shadow cursor predicts movement
- [ ] Memory residue draws path
- [ ] Geo permission shows (if not already asked)
- [ ] Whispers appear on idle (4s)
- [ ] Exit intent triggers
- [ ] Modal opens on Y
- [ ] Contact form validates
- [ ] Tweet button works
- [ ] Pause toggle stops all effects
- [ ] Reduced motion disables animations
- [ ] Mobile touch works
- [ ] Offline page loads when offline
- [ ] 404 page works

### Browser Testing
- Chrome/Edge (desktop & mobile)
- Safari (desktop & iOS)
- Firefox (desktop & mobile)
- Test with reduced motion enabled
- Test with JavaScript disabled (noscript.html)

## 📄 License

Proprietary. © 2025 Hethar. All rights reserved.

## 🔗 Links

- Website: https://hethar.app
- Contact: team@hethar.app
- Press: press@hethar.app

---

**presence > prompts.**

