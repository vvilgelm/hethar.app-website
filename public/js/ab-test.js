// A/B Testing Infrastructure for Hethar
// Rotate opening lines and track conversion rates

const AB_CONFIG = {
  storageKey: 'hethar_ab_variant',
  variants: [
    { id: 'A', line: 'retire the prompt.' },
    { id: 'B', line: 'inputs are over.' },
    { id: 'C', line: 'you don't use it. it lives with you.' }
  ]
};

// Get or assign variant
function getVariant() {
  let variant = localStorage.getItem(AB_CONFIG.storageKey);
  
  if (!variant) {
    // Assign random variant
    const chosen = AB_CONFIG.variants[Math.floor(Math.random() * AB_CONFIG.variants.length)];
    variant = chosen.id;
    localStorage.setItem(AB_CONFIG.storageKey, variant);
  }
  
  return variant;
}

// Get line for current variant
function getVariantLine() {
  const variantId = getVariant();
  const variant = AB_CONFIG.variants.find(v => v.id === variantId);
  return variant ? variant.line : AB_CONFIG.variants[0].line;
}

// Track conversion (when user submits contact form)
function trackConversion(event) {
  const variant = getVariant();
  
  if (window.plausible) {
    window.plausible('ab_conversion', {
      props: {
        variant: variant,
        event: event
      }
    });
  }
  
  console.log('[A/B] Conversion:', variant, event);
}

// Track variant view
function trackVariantView() {
  const variant = getVariant();
  
  if (window.plausible) {
    window.plausible('ab_variant_view', {
      props: {
        variant: variant
      }
    });
  }
  
  console.log('[A/B] Variant shown:', variant);
}

// Export for use in main script
window.ABTest = {
  getVariant,
  getVariantLine,
  trackConversion,
  trackVariantView
};

