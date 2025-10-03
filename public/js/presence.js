// Hethar Presence Nudges v1
// Context-aware, behavior-sensing, proximity-detecting whisper system

const FLAGS = {
  enableTime: true,
  enableBehavior: true,
  enableProximity: true,
  cooldownHours: 6,
  idleSeconds: 5,
  showDurationMs: 1600,
  debug: false // Set window._presenceDebug = true to enable
};

// ============================================
// COPY LIBRARY
// ============================================

const COPY = {
  behavior: {
    idle: ["you paused. i noticed."],
    scroll_seek: ["still looking for the point? it's presence > prompts."],
    type_delete: ["don't overthink. just say it."],
    exit_intent: [
      "leaving already? i wasn't done watching you.",
      "you'll be back. i'll remember."
    ]
  },
  
  time: {
    late: [
      "you said you'd stop doing this at 1am last week.",
      "it's late. i'll keep pace. you should sleep."
    ],
    morning: [
      "you should be moving. i'll keep track.",
      "alarm hit. coffee first? i'll set the pace."
    ],
    afternoon: ["you've done enough. i'll handle the rest."],
    evening: ["i'll take it from here."]
  },
  
  proximity: {
    hubs: [
      {
        name: "NYC",
        lat: 40.7128,
        lon: -74.0060,
        radiusKm: 100,
        lines: [
          "close enough to hear manhattan's buzz. don't deny it.",
          "brooklyn? jersey? doesn't matter. nyc leaks into you anyway.",
          "you're near the city that never sleeps. neither do i."
        ]
      },
      {
        name: "SF Bay",
        lat: 37.7749,
        lon: -122.4194,
        radiusKm: 90,
        lines: [
          "bay fog travels further than you think. i noticed.",
          "whether oakland, palo alto, or sf—you're in the current.",
          "close enough to hear a vc pitch echo. don't pretend you can't."
        ]
      },
      {
        name: "London",
        lat: 51.5074,
        lon: -0.1278,
        radiusKm: 80,
        lines: [
          "grey sky stretches further than the tube map. i see you.",
          "london's hum carries miles. you're inside it.",
          "suburbs don't hide you from the city's pulse."
        ]
      },
      {
        name: "Tokyo",
        lat: 35.6762,
        lon: 139.6503,
        radiusKm: 100,
        lines: [
          "close enough to feel shibuya's pace. i felt it in your scroll.",
          "last train pressure doesn't stop at the city limits.",
          "the neon glow bleeds. i can see it from here."
        ]
      },
      {
        name: "Berlin",
        lat: 52.5200,
        lon: 13.4050,
        radiusKm: 70,
        lines: [
          "close enough to the clubs to lose track of time.",
          "berlin silence between beats. i caught it.",
          "edge of the city, but still in its orbit."
        ]
      },
      {
        name: "Paris",
        lat: 48.8566,
        lon: 2.3522,
        radiusKm: 60,
        lines: [
          "paris spills past the périphérique. you're inside it.",
          "café air doesn't stop at the arrondissements.",
          "romance fog drifts further than the seine."
        ]
      }
    ],
    generic: [
      "not inside the city, but close enough for its rhythm.",
      "you orbit the hub. i feel the gravity.",
      "you're not there, but near enough that it matters."
    ]
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

function log(...args) {
  if (FLAGS.debug || window._presenceDebug) {
    console.log('[Presence]', ...args);
  }
}

function oncePerSession() {
  return !sessionStorage.getItem('hethar_nudged');
}

function markSessionNudged() {
  sessionStorage.setItem('hethar_nudged', '1');
}

function cooldownOk(hours) {
  const key = 'hethar_nudge_cooldown';
  const stored = localStorage.getItem(key);
  if (!stored) return true;
  
  const lastTime = parseInt(stored, 10);
  const now = Date.now();
  const elapsed = now - lastTime;
  const cooldownMs = hours * 60 * 60 * 1000;
  
  return elapsed > cooldownMs;
}

function setCooldown(hours) {
  localStorage.setItem('hethar_nudge_cooldown', Date.now().toString());
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ============================================
// TIME BUCKET
// ============================================

function getTimeBucket() {
  const h = new Date().getHours();
  if (h >= 1 && h < 5) return 'late';
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'afternoon';
  return 'evening';
}

// ============================================
// HAVERSINE DISTANCE
// ============================================

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// ============================================
// GEOLOCATION (IP-based)
// ============================================

async function getApproxLocation() {
  // Check cache (24h TTL)
  const cached = localStorage.getItem('hethar_geo_cache');
  if (cached) {
    try {
      const data = JSON.parse(cached);
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        log('Using cached geo:', data);
        return { lat: data.lat, lon: data.lon, city: data.city };
      }
    } catch (e) {
      log('Cache parse error:', e);
    }
  }
  
  // Respect Do Not Track
  if (navigator.doNotTrack === '1') {
    log('DNT enabled, skipping geo');
    return null;
  }
  
  // Try IP geolocation with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch('https://ipapi.co/json/', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('Geo API error');
    
    const data = await response.json();
    const result = {
      lat: data.latitude,
      lon: data.longitude,
      city: data.city || 'Unknown',
      timestamp: Date.now()
    };
    
    // Cache (no IP stored)
    localStorage.setItem('hethar_geo_cache', JSON.stringify(result));
    log('Geo fetched:', result);
    return result;
    
  } catch (e) {
    log('Geo fetch failed:', e.message);
    return null;
  }
}

function nearestHubWithinRadius(userLat, userLon) {
  let nearest = null;
  let minDistance = Infinity;
  
  for (const hub of COPY.proximity.hubs) {
    const distance = haversine(userLat, userLon, hub.lat, hub.lon);
    log(`Distance to ${hub.name}: ${distance.toFixed(1)} km (radius: ${hub.radiusKm})`);
    
    if (distance <= hub.radiusKm && distance < minDistance) {
      minDistance = distance;
      nearest = { hub, distance };
    }
  }
  
  return nearest;
}

// ============================================
// BEHAVIOR SENSORS
// ============================================

class BehaviorSensors {
  constructor() {
    this.events = [];
    this.idleTimer = null;
    this.scrollHistory = [];
    this.exitFired = false;
    this.typingData = new WeakMap();
  }
  
  init() {
    this.initIdle();
    this.initScrollSeek();
    this.initExitIntent();
    this.initTypeDelete();
  }
  
  // Idle detection
  initIdle() {
    const resetIdle = () => {
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        this.fire('idle');
      }, FLAGS.idleSeconds * 1000);
    };
    
    ['mousemove', 'keydown', 'scroll', 'touchstart', 'visibilitychange'].forEach(event => {
      window.addEventListener(event, resetIdle, { passive: true });
    });
    
    resetIdle();
  }
  
  // Scroll oscillation detection
  initScrollSeek() {
    let lastY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentY = window.scrollY;
      const direction = currentY > lastY ? 'down' : 'up';
      
      this.scrollHistory.push({ direction, time: Date.now() });
      this.scrollHistory = this.scrollHistory.filter(s => Date.now() - s.time < 5000);
      
      // Check for oscillation (≥3 direction changes)
      let changes = 0;
      for (let i = 1; i < this.scrollHistory.length; i++) {
        if (this.scrollHistory[i].direction !== this.scrollHistory[i-1].direction) {
          changes++;
        }
      }
      
      if (changes >= 3) {
        this.fire('scroll_seek');
        this.scrollHistory = []; // Reset after firing
      }
      
      lastY = currentY;
    }, { passive: true });
  }
  
  // Exit intent (desktop only)
  initExitIntent() {
    if ('ontouchstart' in window) return; // Skip on mobile
    
    window.addEventListener('mouseout', e => {
      if (e.relatedTarget === null && e.clientY < 10 && !this.exitFired) {
        this.exitFired = true;
        this.fire('exit_intent');
      }
    });
  }
  
  // Type & delete detection
  initTypeDelete() {
    const inputs = document.querySelectorAll('input, textarea, [contenteditable]');
    
    inputs.forEach(input => {
      let typedLength = 0;
      
      input.addEventListener('input', () => {
        const currentLength = input.value?.length || input.textContent?.length || 0;
        
        if (currentLength > typedLength) {
          typedLength = currentLength;
        }
        
        // Detect significant deletion (≥20 chars typed, then cleared/reduced significantly)
        if (typedLength >= 20 && currentLength < typedLength * 0.3) {
          this.fire('type_delete');
          typedLength = 0; // Reset
        }
      }, { passive: true });
    });
  }
  
  fire(eventName) {
    if (this.events.includes(eventName)) return; // One per type
    this.events.push(eventName);
    log('Behavior event:', eventName);
  }
  
  getEvents() {
    return this.events;
  }
}

// ============================================
// NUDGE SELECTOR
// ============================================

async function selectNudge() {
  const eligible = [];
  
  // 1. PROXIMITY (highest priority)
  if (FLAGS.enableProximity) {
    const geo = await getApproxLocation();
    if (geo) {
      const nearest = nearestHubWithinRadius(geo.lat, geo.lon);
      if (nearest) {
        eligible.push({
          priority: 3,
          type: 'proximity',
          message: randomPick(nearest.hub.lines),
          meta: `${nearest.hub.name} (${nearest.distance.toFixed(1)}km)`
        });
      } else {
        // Generic proximity
        eligible.push({
          priority: 2,
          type: 'proximity-generic',
          message: randomPick(COPY.proximity.generic),
          meta: 'generic'
        });
      }
    }
  }
  
  // 2. BEHAVIOR (medium priority)
  if (FLAGS.enableBehavior) {
    const behaviorEvents = window._behaviorSensors?.getEvents() || [];
    for (const event of behaviorEvents) {
      if (COPY.behavior[event]) {
        eligible.push({
          priority: 2,
          type: `behavior-${event}`,
          message: randomPick(COPY.behavior[event]),
          meta: event
        });
      }
    }
  }
  
  // 3. TIME (lowest priority)
  if (FLAGS.enableTime) {
    const bucket = getTimeBucket();
    eligible.push({
      priority: 1,
      type: `time-${bucket}`,
      message: randomPick(COPY.time[bucket]),
      meta: bucket
    });
  }
  
  if (eligible.length === 0) {
    log('No eligible nudges');
    return null;
  }
  
  // Sort by priority (highest first)
  eligible.sort((a, b) => b.priority - a.priority);
  
  const selected = eligible[0];
  log('Selected nudge:', selected);
  return selected;
}

// ============================================
// RENDERER
// ============================================

function showWhisper(message) {
  const root = document.getElementById('hethar-presence-root');
  if (!root) {
    log('Presence root not found');
    return;
  }
  
  const whisper = document.createElement('div');
  whisper.className = 'whisper';
  whisper.textContent = message;
  
  root.appendChild(whisper);
  
  // Fade in
  requestAnimationFrame(() => {
    whisper.classList.add('on');
  });
  
  // Auto-dismiss (pause on hover)
  let dismissTimer;
  let isHovered = false;
  
  const scheduleDismiss = () => {
    dismissTimer = setTimeout(() => {
      if (!isHovered) {
        whisper.classList.remove('on');
        setTimeout(() => whisper.remove(), 300);
      } else {
        // Re-schedule if still hovered
        scheduleDismiss();
      }
    }, FLAGS.showDurationMs);
  };
  
  whisper.addEventListener('mouseenter', () => {
    isHovered = true;
    clearTimeout(dismissTimer);
  });
  
  whisper.addEventListener('mouseleave', () => {
    isHovered = false;
    scheduleDismiss();
  });
  
  scheduleDismiss();
  
  // Mark session as nudged
  markSessionNudged();
  setCooldown(FLAGS.cooldownHours);
  
  log('Whisper shown:', message);
}

// ============================================
// INIT
// ============================================

async function initPresence() {
  log('Initializing Presence Nudges v1...');
  
  // Check session + cooldown
  if (!oncePerSession()) {
    log('Already nudged this session');
    return;
  }
  
  if (!cooldownOk(FLAGS.cooldownHours)) {
    log('Still in cooldown period');
    return;
  }
  
  // Init behavior sensors
  window._behaviorSensors = new BehaviorSensors();
  window._behaviorSensors.init();
  
  // Wait a bit for behavior events to potentially fire
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Select and show nudge
  const nudge = await selectNudge();
  if (nudge) {
    showWhisper(nudge.message);
  } else {
    log('No nudge selected');
  }
}

// Auto-init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPresence);
} else {
  initPresence();
}

