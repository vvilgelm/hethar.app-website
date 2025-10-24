// Tweet Copy-to-Clipboard Generator
// Shows after N seconds with pre-filled tweet draft

const TWEET_CONFIG = {
  delay: 15000, // 15 seconds
  shown: false,
  storageKey: 'hethar_tweet_shown'
};

const TWEET_TEMPLATES = [
  "i just saw hethar. 'do you want to live with it?' wild.",
  "this website has a cursor that predicts my movements. wtf.",
  "hethar just asked me to 'retire the prompt' and i'm not ready for this conversation.",
  "presence > prompts. this site gets it.",
  "they built a website that remembers where my cursor moved. uncanny.",
  "the future of AI isn't chat. it's presence. hethar gets it."
];

function initTweetGenerator() {
  // Don't show if already shown this session
  if (sessionStorage.getItem(TWEET_CONFIG.storageKey)) return;
  
  setTimeout(() => {
    if (TWEET_CONFIG.shown) return;
    showTweetPrompt();
  }, TWEET_CONFIG.delay);
}

function showTweetPrompt() {
  const template = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
  const tweetText = `${template}\n\nhethar.app`;
  
  const popup = document.createElement('div');
  popup.style.cssText = `
    position:fixed;
    bottom:28px;
    left:28px;
    max-width:380px;
    padding:18px 20px;
    background:rgba(10,10,10,0.95);
    backdrop-filter:blur(12px);
    border-radius:12px;
    border:1px solid rgba(255,255,255,0.08);
    z-index:100;
    font-family:ui-monospace,monospace;
    font-size:13px;
    color:#e8e8e8;
    opacity:0;
    transform:translateY(12px);
    transition:opacity .3s,transform .3s;
  `;
  
  popup.innerHTML = `
    <div style="margin-bottom:12px;color:#9aa0a6">worth sharing?</div>
    <div style="margin-bottom:14px;padding:10px;background:rgba(255,255,255,0.03);border-radius:6px;font-size:12px;line-height:1.5">
      ${escapeHtml(tweetText)}
    </div>
    <div style="display:flex;gap:8px">
      <button id="copyTweet" style="flex:1;padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:#00ff7f;color:#000;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer">
        copy to clipboard
      </button>
      <button id="dismissTweet" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:transparent;color:#9aa0a6;font-family:inherit;font-size:12px;cursor:pointer">
        skip
      </button>
    </div>
  `;
  
  document.body.appendChild(popup);
  
  // Animate in
  requestAnimationFrame(() => {
    popup.style.opacity = '1';
    popup.style.transform = 'translateY(0)';
  });
  
  // Copy button
  document.getElementById('copyTweet').addEventListener('click', () => {
    navigator.clipboard.writeText(tweetText).then(() => {
      document.getElementById('copyTweet').textContent = 'copied!';
      setTimeout(() => popup.remove(), 1500);
      
      // Track
      if (window.plausible) {
        window.plausible('tweet_copy');
      }
      
      sessionStorage.setItem(TWEET_CONFIG.storageKey, '1');
      TWEET_CONFIG.shown = true;
    });
  });
  
  // Dismiss button
  document.getElementById('dismissTweet').addEventListener('click', () => {
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(12px)';
    setTimeout(() => popup.remove(), 300);
    
    sessionStorage.setItem(TWEET_CONFIG.storageKey, '1');
    TWEET_CONFIG.shown = true;
  });
}

function escapeHtml(s){ 
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); 
}

// Auto-init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTweetGenerator);
} else {
  initTweetGenerator();
}

