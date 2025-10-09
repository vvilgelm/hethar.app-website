// Legal Banner Joke - Tongue-in-cheek, performative, short-lived

const LEGAL_CONFIG = {
  enabled: false, // Enable manually for campaigns
  storageKey: 'hethar_legal_dismissed',
  duration: 48 * 60 * 60 * 1000 // 48 hours
};

function showLegalBanner() {
  if (!LEGAL_CONFIG.enabled) return;
  if (localStorage.getItem(LEGAL_CONFIG.storageKey)) return;
  
  const banner = document.createElement('div');
  banner.style.cssText = `
    position:fixed;
    bottom:0;
    left:0;
    right:0;
    background:rgba(10,10,10,0.98);
    border-top:1px solid rgba(255,255,255,0.08);
    padding:16px 20px;
    font-family:ui-monospace,monospace;
    font-size:12px;
    color:#9aa0a6;
    z-index:250;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:20px;
    transform:translateY(100%);
    transition:transform 0.3s cubic-bezier(.22,.61,.36,1);
  `;
  
  banner.innerHTML = `
    <div style="flex:1">
      <span style="color:#e8e8e8">⚠️ legal notice:</span> 
      by continuing you agree hethar may witness your indecisions.
      <span style="color:#666;font-size:11px;margin-left:8px">(we're kidding. but also not.)</span>
    </div>
    <button id="dismissLegal" style="
      padding:6px 14px;
      border-radius:6px;
      border:1px solid rgba(255,255,255,0.1);
      background:transparent;
      color:#9aa0a6;
      font-family:inherit;
      font-size:11px;
      cursor:pointer;
      white-space:nowrap;
      transition:all 0.2s;
    ">
      understood
    </button>
  `;
  
  document.body.appendChild(banner);
  
  // Slide in
  requestAnimationFrame(() => {
    banner.style.transform = 'translateY(0)';
  });
  
  // Dismiss
  document.getElementById('dismissLegal').addEventListener('click', () => {
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => banner.remove(), 300);
    
    localStorage.setItem(LEGAL_CONFIG.storageKey, Date.now());
    
    if (window.plausible) {
      window.plausible('legal_banner_dismissed');
    }
  });
  
  // Auto-dismiss after 20 seconds
  setTimeout(() => {
    if (banner.parentNode) {
      banner.style.transform = 'translateY(100%)';
      setTimeout(() => banner.remove(), 300);
    }
  }, 20000);
}

// Export
window.LegalBanner = {
  show: showLegalBanner,
  enable: () => { LEGAL_CONFIG.enabled = true; showLegalBanner(); },
  disable: () => { LEGAL_CONFIG.enabled = false; }
};

// Enable via query param for testing: ?legal=1
if (window.location.search.includes('legal=1')) {
  LEGAL_CONFIG.enabled = true;
  setTimeout(showLegalBanner, 2000);
}

