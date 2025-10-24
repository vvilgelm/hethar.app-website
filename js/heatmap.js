// Privacy-Friendly Heatmap - Track where users stall (no keystroke recording)

const HEATMAP_CONFIG = {
  enabled: true,
  stallThreshold: 2000, // 2s of no movement = stall
  storageKey: 'hethar_heatmap_data',
  maxDataPoints: 100
};

let heatmapData = [];
let lastMovement = Date.now();
let currentPosition = { x: 0, y: 0 };
let stallTimer = null;

function initHeatmap() {
  if (!HEATMAP_CONFIG.enabled) return;
  
  // Load existing data
  const stored = localStorage.getItem(HEATMAP_CONFIG.storageKey);
  if (stored) {
    try {
      heatmapData = JSON.parse(stored);
    } catch(e) {}
  }
  
  // Track mouse movement
  window.addEventListener('mousemove', (e) => {
    currentPosition = { x: e.clientX, y: e.clientY };
    lastMovement = Date.now();
    
    // Reset stall timer
    clearTimeout(stallTimer);
    stallTimer = setTimeout(recordStall, HEATMAP_CONFIG.stallThreshold);
  }, { passive: true });
  
  // Track scrolls (indicate reading/stalling)
  let lastScroll = Date.now();
  window.addEventListener('scroll', () => {
    const now = Date.now();
    if (now - lastScroll > 3000) {
      // User stopped scrolling for 3s, then resumed
      recordEvent('scroll_resume', { y: window.scrollY });
    }
    lastScroll = now;
  }, { passive: true });
  
  // Send data periodically
  setInterval(flushHeatmapData, 30000); // every 30s
}

function recordStall() {
  const section = getSectionAtPosition(currentPosition.y);
  
  recordEvent('stall', {
    x: Math.round(currentPosition.x),
    y: Math.round(currentPosition.y),
    section: section,
    timestamp: Date.now()
  });
}

function recordEvent(type, data) {
  heatmapData.push({
    type,
    ...data,
    viewport: {
      w: window.innerWidth,
      h: window.innerHeight
    }
  });
  
  // Limit data size
  if (heatmapData.length > HEATMAP_CONFIG.maxDataPoints) {
    heatmapData = heatmapData.slice(-HEATMAP_CONFIG.maxDataPoints);
  }
  
  // Save to localStorage
  localStorage.setItem(HEATMAP_CONFIG.storageKey, JSON.stringify(heatmapData));
}

function getSectionAtPosition(y) {
  const scrollY = window.scrollY + y;
  const dossiers = document.querySelectorAll('.dossier');
  
  for (let i = 0; i < dossiers.length; i++) {
    const rect = dossiers[i].getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const bottom = top + rect.height;
    
    if (scrollY >= top && scrollY <= bottom) {
      return `dossier_${i}`;
    }
  }
  
  return 'unknown';
}

function flushHeatmapData() {
  if (!heatmapData.length) return;
  
  // In production, send to analytics endpoint
  // fetch('/api/heatmap', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ events: heatmapData })
  // });
  
  console.log('[Heatmap] Flushing', heatmapData.length, 'events');
  
  // Track aggregated stats with Plausible
  if (window.plausible) {
    const stallCount = heatmapData.filter(e => e.type === 'stall').length;
    if (stallCount > 0) {
      window.plausible('heatmap_stalls', { props: { count: stallCount } });
    }
  }
  
  // Clear after flush
  heatmapData = [];
  localStorage.removeItem(HEATMAP_CONFIG.storageKey);
}

// Export
window.Heatmap = {
  init: initHeatmap,
  getData: () => heatmapData,
  flush: flushHeatmapData
};

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeatmap);
} else {
  initHeatmap();
}

