# Hethar Implementation Map

Complete guide to where every feature from the Full Presence Design Spec v1.0 is implemented.

---

## 📁 File Structure

```
/public
  /css
    styles.css          ← All visual styling, motion, layout
  /js
    copy.js            ← Single source of truth for all text content
    main.js            ← All interactive behaviors
  index.html           ← Semantic structure, placeholders
  /assets
    /favicons/*        ← (placeholder references)
    /opengraph/*       ← (placeholder references)
/docs
  README.md            ← Deployment instructions
  COPY_MAP.md          ← Content structure documentation
  ACCESSIBILITY.md     ← A11y features
  IMPLEMENTATION_MAP.md ← This file
```

---

## 🎨 Visual Language

### Colors (`:root` tokens)
**File**: `public/css/styles.css` (lines 1-8 in `<style>` tag of `index.html`)

```css
--ink: #0A0A0A     /* Background */
--paper: #FFFFFF   /* Text */
--muted: #8A8D91   /* Secondary copy */
--hair: #C7CBD1    /* Hairlines */
--ease: cubic-bezier(.22,.61,.36,1)
```

### Typography
**File**: `public/css/styles.css`

- `.h1` (lines 4-12): Headlines, `clamp(40px, 8vw, 120px)`
- `.h2` (lines 23-27): Section heads
- `.line` (lines 29-32): Interjection statements
- Font weight: 800, letter-spacing: -0.01em

---

## 🎬 Motion — "Anticipation Engine"

### 1. Breath Animation
**File**: `public/css/styles.css` (lines 14-22)

```css
.h1.breath { animation: breath 6s ease-in-out infinite; }
@keyframes breath {
  0% { transform: scale(0.998); }
  50% { transform: scale(1); }
  100% { transform: scale(0.998); }
}
```

**Applied to**: Hero headline (`#hero-headline`)

### 2. Echo Shadow
**CSS**: `public/css/styles.css` (line 18-20)
**JS**: `public/js/main.js` (lines 147-167)

- Static CSS: `text-shadow: 1px 1px 0 rgba(255,255,255,.08)`
- Dynamic JS: Shadow follows cursor with 120-180ms lag (0.08 lerp factor)
- Applied to all `.echo` elements

### 3. Pre-hover Nudge (Anticipation)
**File**: `public/js/main.js` (lines 124-145)

```javascript
const anticipate = (el, r = 40) => {
  // Detects mouse proximity 40px around element
  // Lifts element translateY(-1px) BEFORE actual hover
  // 80ms cubic-bezier(.22,.61,.36,1) transition
};
```

**Applied to**: All `.btn` and `a` elements

---

## 🎭 Interaction Patterns

### 1. Entry Sequence
**CSS**: `public/css/styles.css` (lines 77-83)
**JS**: `public/js/main.js` (lines 103-105)

- Body fades from `opacity: 0` → `1` with 400ms delay
- Scroll locked for 1.2s via `.no-scroll` class

### 2. Room Tone Sound
**File**: `public/js/main.js` (lines 68-101)

```javascript
playRoomTone() {
  // 110 Hz sine wave, 1s duration
  // Gain: 0.04 (~-24 LUFS)
  // Plays once per session
  // Respects prefers-reduced-motion
}
```

**Trigger**: 400ms after page load

### 3. Adaptive Time-Based Copy
**File**: `public/js/main.js` (lines 107-112)

```javascript
const h = new Date().getHours();
// Morning (5-12): "you should be moving..."
// Afternoon (12-18): "you've done enough..."
// Night (22-5): "you should be winding down..."
// Fallback (18-22): "i'll take it from here."
```

**Location**: `#adaptive-line` in Hero section

### 4. Geo One-Liner (Optional)
**File**: `public/js/main.js` (lines 114-120)

Set `window.__CITY` before `main.js` loads:
```html
<script>window.__CITY = "San Francisco";</script>
```

Messages defined in `public/js/copy.js` → `geoOnce` object

### 5. Whispers (Behavior-Aware)
**File**: `public/js/main.js` (lines 122-157)

#### Idle Whisper
- **Trigger**: 4s of no activity
- **Message**: "you paused. i noticed."
- **Implementation**: Lines 101-107

#### Repeated Scroll
- **Trigger**: Change direction 4+ times
- **Message**: "looking for the point? here: presence > prompts."
- **Implementation**: Lines 109-118

#### Exit Intent
- **Trigger**: Mouse leaves viewport top
- **Message**: "don't worry. i keep going."
- **Implementation**: Lines 120-122

**Whisper CSS**: `public/css/styles.css` (lines 173-186)
- Fixed bottom-left positioning
- 1600ms fade duration
- Auto-remove after 2s

---

## 📐 Page Architecture

### All Sections (in order)

| Section | HTML ID | Content Source | File |
|---------|---------|----------------|------|
| Hero | `#hero` | `COPY.heroHeadline`, `COPY.heroSub`, `COPY.timeBased` | `index.html` lines 31-43 |
| Interjection 1 | `#interjection-1` | `COPY.interjections[0]` | `index.html` lines 46-50 |
| Interjection 2 | `#interjection-2` | `COPY.interjections[1]` | `index.html` lines 53-57 |
| Interjection 3 | `#interjection-3` | `COPY.interjections[2]` | `index.html` lines 60-64 |
| Contrast | `#contrast` | `COPY.contrast.*` | `index.html` lines 67-75 |
| Different | `#different` | `COPY.different.*` | `index.html` lines 78-90 |
| Vision | `#vision` | `COPY.vision.*` | `index.html` lines 93-100 |
| Final CTA | `#final` | `COPY.final.*` | `index.html` lines 103-112 |
| Footer | `#footer` | Static + email | `index.html` lines 117-122 |

### Dynamic Content Population
**File**: `public/js/main.js` (lines 3-64)

All content is injected from `window.COPY` object on page load.

---

## ♿️ Accessibility

### Reduced Motion
**CSS**: `public/css/styles.css` (lines 214-223)
**JS**: `public/js/main.js` (lines 169-176)

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

JS disables:
- Room tone sound
- Echo shadow (sets to `none`)
- Breath animation (via CSS)

### Keyboard Navigation
- Skip link: `index.html` line 30
- Focus styles: `.btn:focus-visible`, `a:focus-visible`
- All interactive elements keyboard-accessible

### Semantic HTML
- Landmarks: `<main>`, `<section>`, `<footer>`
- Proper heading hierarchy: `<h1>`, `<h2>`
- ARIA implicit roles via semantic tags

---

## 📊 Performance

### Bundle Sizes (Gzipped)
```
JS:  2.1 KB  (budget: 12 KB) ✓
CSS: 1.5 KB  (budget: 25 KB) ✓
```

**Check**: `cd public && gzip -c js/main.js | wc -c`

### Analytics Hooks
**File**: `public/js/main.js` (lines 178-183)

```javascript
window.dataLayer = window.dataLayer || [];
const track = (event, payload) => window.dataLayer.push({event, ...payload, ts: Date.now()});
```

Events emitted:
- `cta_click` (all button clicks, includes label)

---

## 🎯 Quick Reference

### Want to change text?
→ Edit `public/js/copy.js`

### Want to adjust timing?
→ Edit `public/js/main.js`:
- Entry lock: Line 105 (`1200`)
- Idle whisper: Line 103 (`4000`)
- Whisper fade: Line 97 (`1600`)
- Room tone: Line 101 (`400`)

### Want to modify colors?
→ Edit `public/css/styles.css` `:root` variables

### Want to adjust motion?
→ Edit `public/css/styles.css`:
- Breath: Lines 14-22
- Easing: `--ease` variable
- Transitions: `.btn`, `.whisper`

---

## 🔍 Testing Checklist

See `TESTING_GUIDE.md` for complete test procedures.

