#!/bin/bash
# Hethar Asset Generator

set -e

echo "🎨 Generating Hethar PNG assets..."

# Check for tools
if ! command -v rsvg-convert &> /dev/null; then
    echo "❌ rsvg-convert not found"
    echo "📦 Installing librsvg..."
    brew install librsvg
fi

cd favicons

# Generate favicons
echo "⚙️  Generating favicons..."
rsvg-convert -w 16 -h 16 favicon.svg -o favicon-16x16.png
rsvg-convert -w 32 -h 32 favicon.svg -o favicon-32x32.png
rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png
rsvg-convert -w 512 -h 512 favicon.svg -o favicon-512x512.png

echo "✅ Favicons generated"

# Generate OG image
cd ../opengraph
echo "⚙️  Generating OG image..."
rsvg-convert -w 1200 -h 630 -f png og.svg -o og-temp.png

# Convert to JPG for smaller file size
if command -v sips &> /dev/null; then
    sips -s format jpeg og-temp.png --out og.jpg -s formatOptions 85
    rm og-temp.png
    echo "✅ OG image generated (JPG)"
else
    mv og-temp.png og.jpg
    echo "✅ OG image generated (PNG renamed to JPG)"
fi

cd ../..

echo "✨ All assets generated successfully!"

