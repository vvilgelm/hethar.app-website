// Copy Rails: Toggle between calm and feral copy sets

const COPY_SETS = {
  feral: [
    'retire the prompt.',
    'inputs are over.',
    'you don't use it. it lives with you.',
    'your ai assistant is mid.',
    'copilots ≠ pilots — they autocomplete, they don't lead.',
    'memory ≠ intelligence — remembering isn't knowing.',
    'assistants ≠ partners — they take orders. we take outcomes.',
    'not a copilot. a co-you.',
    'the mind — lives across your devices. acts before you ask.',
    'the body — a discreet sense organ that feeds the mind.',
    'stop managing life. start living it.',
    'presence > prompts.',
    'we built a second presence.',
    'you don't use hethar. you live with it.'
  ],
  
  calm: [
    'outcomes over inputs.',
    'life runs on autopilot.',
    'intelligence that anticipates.',
    'your assistant waits for prompts. we act first.',
    'copilots assist. we execute.',
    'memory is storage. intelligence is action.',
    'assistants respond. partners lead.',
    'not a tool. a presence.',
    'distributed intelligence across your ecosystem.',
    'ambient awareness. decisive action.',
    'let go of interfaces. live with intelligence.',
    'presence architecture.',
    'a second intelligence layer.',
    'hethar integrates with your life. not your workflow.'
  ]
};

const RAIL_CONFIG = {
  storageKey: 'hethar_copy_rail',
  default: 'feral' // or 'calm' for press/enterprise weeks
};

function getCurrentRail() {
  return localStorage.getItem(RAIL_CONFIG.storageKey) || RAIL_CONFIG.default;
}

function setRail(rail) {
  if (!COPY_SETS[rail]) return;
  localStorage.setItem(RAIL_CONFIG.storageKey, rail);
  console.log('[Copy Rail] Set to:', rail);
}

function getCopyLines() {
  const rail = getCurrentRail();
  return COPY_SETS[rail];
}

function toggleRail() {
  const current = getCurrentRail();
  const next = current === 'feral' ? 'calm' : 'feral';
  setRail(next);
  location.reload(); // Reload to apply
}

// Export
window.CopyRails = {
  getCurrentRail,
  setRail,
  getCopyLines,
  toggleRail
};

// Add toggle button (hidden, for internal use)
if (window.location.search.includes('debug=1')) {
  const toggle = document.createElement('button');
  toggle.textContent = `rail: ${getCurrentRail()}`;
  toggle.style.cssText = `
    position:fixed;
    bottom:20px;
    right:20px;
    padding:8px 12px;
    background:rgba(255,255,255,0.05);
    border:1px solid rgba(255,255,255,0.1);
    color:#9aa0a6;
    font-family:monospace;
    font-size:11px;
    border-radius:8px;
    cursor:pointer;
    z-index:300;
  `;
  toggle.addEventListener('click', toggleRail);
  document.body.appendChild(toggle);
}

