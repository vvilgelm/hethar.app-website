# Hethar Assets

## Generating PNGs from SVG

The SVG source files are in this directory:
- favicon.svg (512x512 monochrome "H" mark)
- og.svg (1200x630 social card)

### To generate PNGs:

#### Option 1: Using librsvg (recommended)
```bash
brew install librsvg

# Generate favicons
rsvg-convert -w 16 -h 16 favicon.svg -o favicon-16x16.png
rsvg-convert -w 32 -h 32 favicon.svg -o favicon-32x32.png
rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png
rsvg-convert -w 512 -h 512 favicon.svg -o favicon-512x512.png

# Generate OG image
cd ../opengraph
rsvg-convert -w 1200 -h 630 -f png og.svg -o og.png
# Convert to JPG for better compression
sips -s format jpeg og.png --out og.jpg
rm og.png
```

#### Option 2: Using ImageMagick
```bash
brew install imagemagick

convert -resize 16x16 favicon.svg favicon-16x16.png
convert -resize 32x32 favicon.svg favicon-32x32.png
convert -resize 180x180 favicon.svg apple-touch-icon.png
convert -resize 512x512 favicon.svg favicon-512x512.png

cd ../opengraph
convert -resize 1200x630 og.svg og.jpg
```

#### Option 3: Online converter
Upload SVG files to https://cloudconvert.com/svg-to-png

## Current Status

SVG files are ready. Modern browsers support SVG favicons directly.
For full compatibility, run one of the commands above to generate PNGs.
