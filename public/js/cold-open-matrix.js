// Hethar Matrix Operator Cold Open
// Cinematic, uncanny entrance

function coldOpenMatrix() {
  const overlay = document.createElement('div');
  overlay.id = 'cold-open';
  overlay.style.cssText = 'position:fixed;inset:0;background:#000;color:#0f0;display:grid;place-items:center;z-index:10000;font-family:"Courier New",monospace;';
  
  const text = document.createElement('div');
  text.style.cssText = 'font:500 clamp(18px,3vw,28px)/1.4 "Courier New",monospace;text-align:center;letter-spacing:1px;max-width:90vw;';
  overlay.appendChild(text);
  document.body.appendChild(overlay);
  
  // Disable scroll + hide cursor (uncanny control)
  document.documentElement.classList.add('no-scroll');
  document.body.style.cursor = 'none';
  
  // Phase 1: Silent blackout (400ms) - already black
  setTimeout(() => {
    // Phase 2: Operator whisper - appears in CLUSTERS (not linear)
    const clusters = [
      "you didn't",
      " prompt.",
      " i was",
      " already here."
    ];
    
    let clusterIndex = 0;
    function typeCluster() {
      if (clusterIndex < clusters.length) {
        text.textContent += clusters[clusterIndex];
        clusterIndex++;
        // Variable timing (40-150ms) - feels transmitted, not typed
        setTimeout(typeCluster, Math.random() * 110 + 40);
      } else {
        // Phase 3: Screen flicker + letter glitch (300ms)
        setTimeout(() => {
          text.style.animation = 'glitchText 0.3s steps(6)';
          overlay.style.animation = 'screenFlicker 0.3s';
          
          // Swap random letters (o→0, i→!, a→@)
          const originalText = text.textContent;
          let glitchCount = 0;
          const glitchInterval = setInterval(() => {
            if (glitchCount < 8) {
              const glitched = originalText.split('').map(c => 
                Math.random() > 0.7 ? (c === 'o' ? '0' : c === 'i' ? '!' : c === 'a' ? '@' : c) : c
              ).join('');
              text.textContent = glitched;
              glitchCount++;
            } else {
              clearInterval(glitchInterval);
              text.textContent = originalText;
            }
          }, 40);
          
          setTimeout(() => {
            // Phase 4: Collapse to dot (like it vanished into the matrix)
            text.style.transition = 'all 0.2s cubic-bezier(.4,0,.2,1)';
            text.style.transform = 'scale(0.05)';
            text.style.opacity = '0';
            
            setTimeout(() => {
              // Phase 5: SYSTEM OVERRIDE - Console command takeover
              text.textContent = '';
              text.style.cssText = 'font:700 clamp(40px,8vw,120px)/1.05 "Courier New",monospace;text-align:center;color:#fff;text-transform:uppercase;letter-spacing:-2px;';
              overlay.style.background = '#000';
              
              // Slam in BLOCKS (like a system command)
              const blocks = ['RETIRE', '_THE_', 'PROMPT'];
              let blockIndex = 0;
              
              const slamInterval = setInterval(() => {
                if (blockIndex < blocks.length) {
                  text.textContent += blocks[blockIndex];
                  // Screen shake on each slam
                  overlay.style.transform = `translate(${Math.random()*6-3}px, ${Math.random()*6-3}px)`;
                  setTimeout(() => overlay.style.transform = '', 40);
                  blockIndex++;
                } else {
                  clearInterval(slamInterval);
                  
                  // Phase 6: Transform to final state + period click
                  setTimeout(() => {
                    text.textContent = 'retire the prompt';
                    text.style.textTransform = 'lowercase';
                    text.style.letterSpacing = '-0.02em';
                    
                    // Add period with "click" (rapid flash)
                    setTimeout(() => {
                      text.textContent += '.';
                      overlay.style.animation = 'staticCrack 0.08s';
                      
                      setTimeout(() => {
                        // Phase 7: INSTANT VANISH with white flash
                        overlay.style.background = '#fff';
                        overlay.style.transition = 'none';
                        text.style.color = '#000';
                        
                        setTimeout(() => {
                          // Remove overlay
                          overlay.remove();
                          document.documentElement.classList.remove('no-scroll');
                          document.body.style.cursor = '';
                          
                          // Flash body white briefly
                          document.body.style.background = '#fff';
                          setTimeout(() => {
                            document.body.style.background = '';
                            document.body.style.transition = 'background 0.25s ease';
                          }, 60);
                          
                          // Init echo cursor
                          if (typeof initEchoCursor === 'function') {
                            initEchoCursor();
                          }
                        }, 100);
                      }, 350);
                    }, 100);
                  }, 120);
                }
              }, 90); // Block slam timing
            }, 220);
          }, 320);
        }, 850);
      }
    }
    
    typeCluster();
  }, 400);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes glitchText {
    0%, 100% { transform: translate(0); filter: none; }
    20% { transform: translate(-2px, 1px); filter: hue-rotate(90deg); }
    40% { transform: translate(2px, -1px); color: #f0f; }
    60% { transform: translate(-1px, 2px); color: #0ff; }
    80% { transform: translate(1px, -2px); filter: invert(0.8); }
  }
  
  @keyframes screenFlicker {
    0%, 100% { opacity: 1; }
    20%, 60% { opacity: 0.8; background: #001a00; }
    40%, 80% { opacity: 1; background: #000; }
  }
  
  @keyframes staticCrack {
    0%, 100% { filter: none; }
    25% { filter: brightness(2) contrast(3); }
    50% { filter: invert(1); }
    75% { filter: saturate(5) hue-rotate(180deg); }
  }
`;
document.head.appendChild(style);

// Export
if (typeof module !== 'undefined') module.exports = { coldOpenMatrix };

