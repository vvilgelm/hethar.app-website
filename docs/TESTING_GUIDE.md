# Hethar Testing Guide

Complete testing procedures for all presence behaviors.

---

## 🚀 Setup

### 1. Start Local Server

```bash
cd /Users/vilgelm/hethar.app-website/public
python3 -m http.server 8000
```

**Open**: http://localhost:8000

### 2. Enable Browser Console

- **Chrome/Arc**: `Cmd + Option + J`
- **Safari**: `Cmd + Option + C`
- **Firefox**: `Cmd + Option + K`

---

## 🧪 Test Procedures

### ✅ Test 1: Entry Sequence (400ms + 1.2s lock)

**What to test**: Page loads to black, fades in, scroll locked

**Steps**:
1. Hard refresh: `Cmd + Shift + R`
2. Observe black screen
3. After ~400ms → Page fades in
4. Try scrolling immediately → Should be locked
5. After ~1.2s → Scrolling works

**Expected**:
- ✓ Black screen on load
- ✓ Fade-in at 400ms
- ✓ Scroll disabled for 1.2s
- ✓ Scroll enabled after

**Implementation**: `public/js/main.js` lines 103-105

---

### 🔊 Test 2: Room Tone Sound

**What to test**: Subtle low hum on first visit (1s, very quiet)

**Steps**:
1. Open browser console
2. Run: `sessionStorage.removeItem('roomTonePlayed')`
3. Hard refresh: `Cmd + Shift + R`
4. Listen closely (use headphones)
5. After ~400ms → Low frequency hum (110 Hz) for 1s

**Expected**:
- ✓ Barely audible low tone
- ✓ Plays once per session
- ✓ Does NOT play on subsequent refreshes (unless you clear sessionStorage)

**To test again**:
```javascript
sessionStorage.removeItem('roomTonePlayed')
location.reload()
```

**Implementation**: `public/js/main.js` lines 68-101

**Note**: Some browsers may block autoplay. If no sound, check console for errors.

---

### ⏰ Test 3: Time-Based Copy

**What to test**: Adaptive line changes based on time of day

**Current time-based message location**: Under hero subline

**Steps**:

#### Option A: Wait for time changes
- Morning (5am-12pm): "you should be moving. i'll keep track."
- Afternoon (12pm-6pm): "you've done enough. i'll handle the rest."
- Evening (6pm-10pm): "i'll take it from here."
- Night (10pm-5am): "you should be winding down. i'll handle the rest."

#### Option B: Override time in console
```javascript
// Test morning message
document.getElementById('adaptive-line').textContent = "you should be moving. i'll keep track.";

// Test afternoon
document.getElementById('adaptive-line').textContent = "you've done enough. i'll handle the rest.";

// Test night
document.getElementById('adaptive-line').textContent = "you should be winding down. i'll handle the rest.";
```

**Expected**:
- ✓ Message matches current time
- ✓ Changes automatically on reload at different times

**Implementation**: `public/js/main.js` lines 107-112

---

### 🌍 Test 4: Geo One-Liner (Optional)

**What to test**: City-specific whisper on first visit

**Steps**:
1. Open console
2. Run: `sessionStorage.removeItem('geoLineShown')`
3. Add before page loads:
   ```javascript
   window.__CITY = "San Francisco"
   ```
   
   Or inject via HTML before `main.js`:
   ```html
   <script>window.__CITY = "San Francisco";</script>
   <script src="/js/main.js" defer></script>
   ```

4. Refresh page
5. Look for whisper bottom-left

**Available cities**:
- "San Francisco" → "fog again. i'll cut through the haze."
- "New York" → "late calls. crowded nights. i'll keep pace."
- "London" → "grey skies. sharp moves."

**Expected**:
- ✓ Whisper appears bottom-left
- ✓ Shows once per session
- ✓ Only for cities in COPY object

**Implementation**: `public/js/main.js` lines 114-120

---

### 💬 Test 5: Whispers (Behavior-Aware)

#### 5A: Idle Whisper (4s)

**Steps**:
1. Load page
2. Don't move mouse, don't scroll, don't type
3. Wait 4 seconds
4. Look bottom-left

**Expected**:
- ✓ After 4s idle → "you paused. i noticed."
- ✓ Fades in smoothly
- ✓ Disappears after ~1.6s
- ✓ Resets timer on any interaction

**Test reset**: Move mouse → wait 4s → whisper appears again

---

#### 5B: Repeated Scroll Whisper

**Steps**:
1. Scroll down
2. Scroll up
3. Scroll down
4. Scroll up
5. Scroll down (5th direction change)
6. Look bottom-left

**Expected**:
- ✓ After ~4-5 scroll direction changes → "looking for the point? here: presence > prompts."

**Implementation**: `public/js/main.js` lines 109-118

---

#### 5C: Exit Intent Whisper

**Steps**:
1. Move mouse slowly toward top of screen
2. Move cursor OFF the top edge of the browser window
3. Look bottom-left

**Expected**:
- ✓ "don't worry. i keep going."
- ✓ Triggers when `mouseout` with no `relatedTarget`

**Implementation**: `public/js/main.js` lines 120-122

---

### 🎯 Test 6: Anticipation (Pre-Hover Nudge)

**What to test**: Buttons lift BEFORE you hover them

**Steps**:
1. Move mouse slowly toward any button/link
2. Stop ~40px away from the button
3. Watch the button closely
4. Move closer (within 40px)

**Expected**:
- ✓ Button lifts `translateY(-1px)` BEFORE cursor touches it
- ✓ Transition: 80ms
- ✓ Resets when you move away

**To see it clearly**:
- Use slow mouse movements
- Try with "drop your assistant →" button
- Look for subtle upward shift

**Implementation**: `public/js/main.js` lines 124-145

---

### 👻 Test 7: Echo Shadow (Cursor Lag)

**What to test**: Headline shadow follows cursor with delay

**Steps**:
1. Move mouse over hero headline
2. Move in circles slowly
3. Observe shadow direction
4. Move quickly → shadow "lags" behind

**Expected**:
- ✓ Shadow position changes based on cursor
- ✓ Lag: ~120-180ms (0.08 lerp factor)
- ✓ Opacity: 0.08
- ✓ Works on all `.echo` elements

**Elements with echo**:
- Hero headline
- All interjection headlines
- Vision section lines

**Implementation**: `public/js/main.js` lines 147-167

---

### 💨 Test 8: Breath Animation

**What to test**: Hero headline subtly scales in/out

**Steps**:
1. Look at hero headline: "retire the prompt."
2. Watch closely for ~6 seconds
3. Notice very subtle "breathing" (scale change)

**Expected**:
- ✓ Scale: 0.998 → 1.000 → 0.998
- ✓ Duration: 6s loop
- ✓ Infinite
- ✓ Barely perceptible

**To see it better**:
Open console and run:
```javascript
document.querySelector('.h1.breath').style.animation = 'breath 2s ease-in-out infinite';
```

**Implementation**: `public/css/styles.css` lines 14-22

---

### ♿️ Test 9: Reduced Motion

**What to test**: All motion disabled for accessibility

**Steps (macOS)**:
1. System Preferences → Accessibility → Display
2. Enable "Reduce motion"
3. Refresh page

**Expected**:
- ✓ No breath animation
- ✓ No echo shadow
- ✓ No room tone sound
- ✓ No entry fade animation
- ✓ Site still fully functional

**Verify**:
```javascript
window.matchMedia('(prefers-reduced-motion: reduce)').matches
// Should return: true
```

**Implementation**:
- CSS: `public/css/styles.css` lines 214-223
- JS: `public/js/main.js` lines 169-176

---

### 📱 Test 10: Mobile/Responsive

**Steps**:
1. Chrome DevTools → `Cmd + Shift + M`
2. Select "iPhone 14 Pro" or similar
3. Test all interactions:
   - Touch/tap CTAs
   - Scroll behavior
   - Whispers appear correctly
   - Text is readable

**Expected**:
- ✓ All CTAs tappable with thumb
- ✓ Typography scales (clamp())
- ✓ Whispers don't overlap content
- ✓ No horizontal scroll

---

### 📊 Test 11: Analytics Events

**What to test**: `window.dataLayer` events fire on CTA clicks

**Steps**:
1. Open console
2. Run: `window.dataLayer = []`
3. Click "drop your assistant →" button
4. Check console: `window.dataLayer`

**Expected**:
```javascript
[
  {
    event: "cta_click",
    label: "drop your assistant →",
    ts: 1704123456789
  }
]
```

**Implementation**: `public/js/main.js` lines 178-183

---

## 🎬 Full QA Session (10 min)

Complete test from fresh state:

### Minute 0-2: Entry
- [ ] Hard refresh with sound on
- [ ] Black screen appears
- [ ] Fade-in at 400ms
- [ ] Subtle room tone heard
- [ ] Scroll locked for 1.2s
- [ ] Hero headline breathing

### Minute 2-4: Adaptive Content
- [ ] Time-based copy shows correct message
- [ ] Hero headline has echo shadow
- [ ] Move cursor → shadow lags

### Minute 4-6: Interactions
- [ ] Hover buttons → pre-nudge before hover
- [ ] Idle 4s → whisper appears
- [ ] Scroll up/down repeatedly → whisper
- [ ] Move mouse off top → exit whisper

### Minute 6-8: Navigation
- [ ] Scroll through all sections
- [ ] Each interjection = full screen
- [ ] Vision lines = full screen each
- [ ] All content from COPY object

### Minute 8-10: Accessibility
- [ ] Tab through all CTAs
- [ ] Focus rings visible
- [ ] Enable reduced motion → everything calm
- [ ] Mobile view responsive

---

## 🐛 Debugging

### No sound?
```javascript
// Check if already played
sessionStorage.getItem('roomTonePlayed') // null = will play

// Check reduced motion
window.matchMedia('(prefers-reduced-motion: reduce)').matches // should be false

// Force play (browser console)
const audioCtx = new AudioContext();
const osc = audioCtx.createOscillator();
const gain = audioCtx.createGain();
osc.connect(gain);
gain.connect(audioCtx.destination);
gain.gain.value = 0.1;
osc.start();
setTimeout(() => osc.stop(), 1000);
```

### Whispers not appearing?
```javascript
// Manually trigger
const whisper = (msg) => {
  const w = document.createElement('div');
  w.className='whisper';
  w.textContent=msg;
  document.body.appendChild(w);
  requestAnimationFrame(()=>w.classList.add('on'));
  setTimeout(()=>w.classList.remove('on'),1600);
  setTimeout(()=>w.remove(),2000);
};

whisper('test message');
```

### Echo shadow not working?
```javascript
// Check elements
document.querySelectorAll('.echo').length // Should be > 0

// Check mouse events
window.addEventListener('mousemove', e => console.log(e.clientX, e.clientY));
```

---

## 📸 Screenshot Audit

Take screenshots at these scroll positions:

1. **Hero** (0%): "retire the prompt."
2. **Interjection 1** (20%): "inputs are over."
3. **Contrast** (40%): "your ai assistant is mid."
4. **Vision line 1** (60%): "assistants are mid."
5. **Final** (80%): "life, handled."

**Each should be viral-tweet-worthy.**

---

## 🎯 Success Criteria

All tests pass if:
- ✓ Every behavior triggers as expected
- ✓ No console errors
- ✓ Performance budget met (JS < 12KB, CSS < 25KB)
- ✓ Lighthouse scores: Performance ≥95, A11y ≥90
- ✓ Feels like **presence**, not interface

---

**Questions?** Check `IMPLEMENTATION_MAP.md` for code locations.

