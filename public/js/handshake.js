// Handshake Animation - Theatrical micro-contract after CTA

function showHandshakeAnimation(onComplete) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.95);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:150;
    opacity:0;
    transition:opacity 0.3s;
  `;
  
  overlay.innerHTML = `
    <div style="text-align:center;font-family:ui-monospace,monospace">
      <div id="handshakeIcon" style="font-size:64px;margin-bottom:24px;opacity:0;transform:scale(0.8);transition:all 0.4s cubic-bezier(.22,.61,.36,1)">
        🤝
      </div>
      <div id="handshakeText" style="font-size:20px;color:#e8e8e8;margin-bottom:12px;opacity:0;transform:translateY(12px);transition:all 0.3s 0.2s">
        i'll keep watch.
      </div>
      <div id="handshakeSubtext" style="font-size:14px;color:#9aa0a6;opacity:0;transform:translateY(12px);transition:all 0.3s 0.4s">
        you can undo anytime: <span style="color:#00ff7f">team@hethar.app</span>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Animate in
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    requestAnimationFrame(() => {
      document.getElementById('handshakeIcon').style.opacity = '1';
      document.getElementById('handshakeIcon').style.transform = 'scale(1)';
      document.getElementById('handshakeText').style.opacity = '1';
      document.getElementById('handshakeText').style.transform = 'translateY(0)';
      document.getElementById('handshakeSubtext').style.opacity = '1';
      document.getElementById('handshakeSubtext').style.transform = 'translateY(0)';
    });
  });
  
  // Hold, then fade out
  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      if (onComplete) onComplete();
    }, 300);
  }, 2400);
  
  // Track
  if (window.plausible) {
    window.plausible('handshake_shown');
  }
}

// Export
window.Handshake = {
  show: showHandshakeAnimation
};

