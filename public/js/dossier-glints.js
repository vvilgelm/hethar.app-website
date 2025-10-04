// Dossier Glints - Micro SVG glyphs representing "saved concepts"

const GLINT_TYPES = [
  { id: 'dot', svg: '<circle cx="6" cy="6" r="3" fill="rgba(0,255,127,0.4)"/>', label: 'tracked event' },
  { id: 'envelope', svg: '<path d="M2,4 L10,4 L10,10 L2,10 Z M2,4 L6,7 L10,4" stroke="rgba(0,255,127,0.4)" stroke-width="1" fill="none"/>', label: 'pending message' },
  { id: 'pulse', svg: '<circle cx="6" cy="6" r="2" fill="rgba(0,255,127,0.6)"><animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite"/></circle>', label: 'active monitoring' }
];

function initDossierGlints() {
  const dossiers = document.querySelectorAll('.dossier');
  if (!dossiers.length) return;
  
  dossiers.forEach((dossier, idx) => {
    // Add 1-2 glints per dossier randomly
    const numGlints = Math.random() > 0.7 ? 2 : 1;
    
    for (let i = 0; i < numGlints; i++) {
      const glint = GLINT_TYPES[Math.floor(Math.random() * GLINT_TYPES.length)];
      addGlint(dossier, glint, i);
    }
  });
}

function addGlint(dossier, glintType, index) {
  const glintEl = document.createElement('div');
  glintEl.className = 'dossier-glint';
  glintEl.style.cssText = `
    position:absolute;
    left:${20 + index * 24}px;
    top:50%;
    transform:translateY(-50%);
    width:12px;
    height:12px;
    cursor:help;
    opacity:0.6;
    transition:opacity 0.2s,transform 0.2s;
  `;
  
  glintEl.innerHTML = `
    <svg width="12" height="12" viewBox="0 0 12 12">
      ${glintType.svg}
    </svg>
  `;
  
  // Tooltip on hover
  glintEl.addEventListener('mouseenter', () => {
    glintEl.style.opacity = '1';
    glintEl.style.transform = 'translateY(-50%) scale(1.3)';
    showGlintTooltip(glintEl, glintType.label);
  });
  
  glintEl.addEventListener('mouseleave', () => {
    glintEl.style.opacity = '0.6';
    glintEl.style.transform = 'translateY(-50%) scale(1)';
    hideGlintTooltip();
  });
  
  dossier.appendChild(glintEl);
}

let activeTooltip = null;

function showGlintTooltip(el, text) {
  hideGlintTooltip();
  
  const tooltip = document.createElement('div');
  tooltip.className = 'glint-tooltip';
  tooltip.textContent = text;
  tooltip.style.cssText = `
    position:fixed;
    background:rgba(10,10,10,0.95);
    color:#9aa0a6;
    padding:6px 10px;
    border-radius:6px;
    font-family:ui-monospace,monospace;
    font-size:11px;
    pointer-events:none;
    z-index:200;
    white-space:nowrap;
    border:1px solid rgba(255,255,255,0.06);
  `;
  
  document.body.appendChild(tooltip);
  
  const rect = el.getBoundingClientRect();
  tooltip.style.left = (rect.right + 12) + 'px';
  tooltip.style.top = (rect.top + rect.height/2 - tooltip.offsetHeight/2) + 'px';
  
  activeTooltip = tooltip;
}

function hideGlintTooltip() {
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
}

// Export
window.DossierGlints = {
  init: initDossierGlints
};

// Auto-init when dossiers are shown
document.addEventListener('DOMContentLoaded', () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.target.id === 'dossierContainer' && 
          mutation.target.style.display === 'block') {
        setTimeout(initDossierGlints, 500);
        observer.disconnect();
      }
    });
  });
  
  const container = document.getElementById('dossierContainer');
  if (container) {
    observer.observe(container, { attributes: true, attributeFilter: ['style'] });
  }
});

