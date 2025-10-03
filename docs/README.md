# Hethar Website

Presence over prompts. Live with intelligence, not interfaces.

## Quick Start

### Local Development

```bash
# Serve locally
npx serve public

# Or with Python
python3 -m http.server 8000 --directory public

# Or with Node
cd public && node -e "require('http').createServer((req,res)=>{require('fs').createReadStream('index.html').pipe(res)}).listen(8000)"
```

Visit: `http://localhost:8000`

### Deploy

#### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=public
```

#### Cloudflare Pages
1. Connect your repo to Cloudflare Pages
2. Set build directory: `public`
3. No build command needed (static site)

#### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod public
```

## Structure

```
/public
  index.html          # Main HTML with semantic structure
  /css/styles.css     # Complete design system
  /js/copy.js         # Copy library (single source of truth)
  /js/main.js         # Behaviors (adaptive, whispers, anticipation)
  /assets/*           # Images, favicons, fonts
/docs
  README.md           # This file
  COPY_MAP.md         # Content guidelines
  ACCESSIBILITY.md    # A11y implementation notes
```

## Performance Budget

- JS: ≤ 12KB gzipped
- CSS: ≤ 25KB gzipped
- First paint: < 1s on 4G

## Browser Support

- Modern browsers (last 2 versions)
- Graceful degradation for older browsers
- Full keyboard navigation
- Screen reader tested

## Key Features

- **Adaptive Copy**: Time-aware messaging (morning/afternoon/night)
- **Anticipation**: Pre-hover nudges on interactive elements
- **Echo Effect**: Cursor-lagged text shadows on headlines
- **Whispers**: Contextual micro-interactions (idle, exit, seeking)
- **Reduced Motion**: Respects user preferences

## Configuration

### Geo-Aware Copy (Optional)
Set `window.__CITY` before loading main.js:

```html
<script>window.__CITY = "San Francisco";</script>
<script src="/js/main.js"></script>
```

### Analytics
Events are pushed to `window.dataLayer` for easy integration with GA4 or other analytics:

```javascript
window.dataLayer.push({
  event: 'cta_click',
  label: 'drop your assistant →',
  ts: 1234567890
});
```

## License

© 2025 Hethar, Inc. All rights reserved.

