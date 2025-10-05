// Hover POV Tooltips - "Invisible companion" observations on hover

const POV_MESSAGES = [
  { selector: '.line', messages: [
    "you pause here. this is where you overthink endings.",
    "third time you've hovered this. it matters.",
    "you read this slower than the others.",
    "you're deciding if you believe it.",
    "this one makes you uncomfortable. good."
  ]},
  { selector: '.btn', messages: [
    "you'll click in 3... 2...",
    "hover doesn't commit. i know.",
    "still deciding. i'll wait.",
    "cursor hesitation detected.",
    "you'll be back. they always come back."
  ]},
  { selector: '.whisper', messages: [
    "you noticed me. i noticed you first.",
    "these aren't random. you know that.",
    "i time these. you sense it.",
    "you're reading your own pattern."
  ]}
];

let hoveredElements = new Map();
let povTimeout = null;

function initHoverPOV() {
  POV_MESSAGES.forEach(({ selector, messages }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('mouseenter', () => handleHover(el, messages));
      el.addEventListener('mouseleave', clearPOV);
    });
  });
}

function handleHover(el, messages) {
  // Don't spam - only show POV after 800ms hover
  povTimeout = setTimeout(() => {
    let hoverCount = hoveredElements.get(el) || 0;
    hoveredElements.set(el, hoverCount + 1);
    
    // Pick message based on hover count
    const messageIdx = Math.min(hoverCount, messages.length - 1);
    showPOV(el, messages[messageIdx]);
  }, 800);
}

function showPOV(el, message) {
  clearPOV();
  
  const pov = document.createElement('div');
  pov.className = 'hover-pov';
  pov.textContent = message;
  pov.style.cssText = `
    position:fixed;
    background:rgba(10,10,10,0.95);
    backdrop-filter:blur(8px);
    color:#9aa0a6;
    padding:8px 12px;
    border-radius:8px;
    font-family:ui-monospace,monospace;
    font-size:12px;
    max-width:280px;
    pointer-events:none;
    z-index:200;
    opacity:0;
    transform:translateY(6px);
    transition:opacity 0.2s,transform 0.2s;
    border:1px solid rgba(255,255,255,0.06);
    line-height:1.4;
  `;
  
  document.body.appendChild(pov);
  
  const rect = el.getBoundingClientRect();
  pov.style.left = rect.left + 'px';
  pov.style.top = (rect.bottom + 12) + 'px';
  
  requestAnimationFrame(() => {
    pov.style.opacity = '1';
    pov.style.transform = 'translateY(0)';
  });
  
  pov._element = el;
  window._activePOV = pov;
  
  // Track
  if (window.plausible) {
    window.plausible('pov_shown', { props: { message } });
  }
}

function clearPOV() {
  clearTimeout(povTimeout);
  if (window._activePOV) {
    window._activePOV.style.opacity = '0';
    window._activePOV.style.transform = 'translateY(6px)';
    setTimeout(() => {
      if (window._activePOV) {
        window._activePOV.remove();
        window._activePOV = null;
      }
    }, 200);
  }
}

// Export
window.HoverPOV = {
  init: initHoverPOV
};

// Auto-init after dossiers load
setTimeout(() => {
  if (document.getElementById('dossierContainer').style.display === 'block') {
    initHoverPOV();
  }
}, 3000);

