#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateAssets() {
  console.log('🎨 Generating Hethar PNG assets with Sharp...\n');

  const faviconSvg = path.join(__dirname, 'public/assets/favicons/favicon.svg');
  const ogSvg = path.join(__dirname, 'public/assets/opengraph/og.svg');

  // Generate favicons
  const sizes = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 512, name: 'favicon-512x512.png' }
  ];

  console.log('⚙️  Generating favicons...');
  for (const { size, name } of sizes) {
    const output = path.join(__dirname, 'public/assets/favicons', name);
    await sharp(faviconSvg)
      .resize(size, size)
      .png()
      .toFile(output);
    console.log(`  ✓ ${name} (${size}x${size})`);
  }

  // Generate OG image as JPG
  console.log('\n⚙️  Generating OG image...');
  const ogOutput = path.join(__dirname, 'public/assets/opengraph/og.jpg');
  await sharp(ogSvg)
    .resize(1200, 630)
    .jpeg({ quality: 85 })
    .toFile(ogOutput);
  console.log('  ✓ og.jpg (1200x630)');

  console.log('\n✨ All assets generated successfully!');
}

generateAssets().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});

