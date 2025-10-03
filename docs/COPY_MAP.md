# Copy Map

## Voice & Tone

### Principles
- **Direct**: No jargon, no qualifiers, no apologies
- **Lowercase**: Headlines feel conversational, not marketed
- **Present tense**: Presence is now, not future
- **Absence > decoration**: One idea per screen

### What We Don't Say
- ❌ "platform", "layer", "ambient", "infrastructure"
- ❌ "revolutionizing", "game-changing", "disrupting"
- ❌ "AI-powered", "cutting-edge", "next-generation"
- ❌ Product screenshots, feature grids, "book a demo"

### What We Do Say
- ✅ "presence over prompts"
- ✅ "inputs are over"
- ✅ "life, handled"
- ✅ Direct contrasts: "copilots ≠ pilots"

## Content Hierarchy

### Hero (above fold)
**Primary**: `retire the prompt.`  
**Secondary**: `presence over prompts. live with intelligence, not interfaces.`  
**Adaptive**: Time-based one-liner (morning/afternoon/night)  
**CTAs**: `drop your assistant →` | `schedule nothing`

### Interjections (full viewport statements)
1. `inputs are over.`
2. `life is outcomes-only.`
3. `you don't use it. it lives with you.`

### Contrast (competitor comparison)
**Head**: `your ai assistant is mid.`

**Statements**:
- `copilots ≠ pilots — they autocomplete. they don't lead.`
- `memory ≠ intelligence — remembering isn't knowing.`
- `assistants ≠ partners — they take orders. we take outcomes.`

**CTA**: `drop your assistant today →`

### Differentiator (product substance)
**Head**: `not a copilot. a co-you.`

**Left Column (The Mind)**:  
`the mind — lives across your devices. acts before you ask.`

**Right Column (The Body)**:  
`the body — a pendant that sees/hears/feels. feeds the mind.`

**Kicker**: `if your ai isn't living with you, it's dead weight.`

### Vision (manifesto)
**Head**: `stop managing life. start living it.`

**Lines**:
- `assistants are mid.`
- `copilots are passengers.`
- `presence > prompts.`
- `we built a second presence.`

**Closer**: `you don't use hethar. you live with it.`

### Final (choice moment)
**Head**: `life, handled.`  
**CTAs**: `join the team` | `schedule nothing`

## Adaptive Copy

### Time-Based (browser local time)
- **Morning (5am-11:59am)**: `you should be moving. i'll keep track.`
- **Afternoon (12pm-5:59pm)**: `you've done enough. i'll handle the rest.`
- **Night (6pm-4:59am)**: `you should be winding down. i'll handle the rest.`
- **Fallback**: `i'll take it from here.`

### Geo-Aware (optional, one-time per session)
If `window.__CITY` is set:
- **San Francisco**: `fog again. i'll cut through the haze.`
- **New York**: `late calls. crowded nights. i'll keep pace.`
- **London**: `grey skies. sharp moves.`

## Whispers (contextual micro-copy)

### Idle (4s no interaction)
`you paused. i noticed.`

### Seeking (repeated scroll up/down)
`looking for the point? here: presence > prompts.`

### Exit Intent (mouse leaves top)
`don't worry. i keep going.`

## Email Addresses

- **Join**: `team@hethar.app`
- **Press**: `press@hethar.app`
- **Drop Assistant**: `ditch@hethar.app`

## Usage Notes

All copy is stored in `/public/js/copy.js` as `window.COPY` object.  
Edit there; the site auto-updates.

**Single source of truth**: Never hardcode strings in HTML.  
**Lowercase headlines**: Keep as-is for brand consistency.  
**Punctuation**: Minimal. No exclamation marks.

