const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Default Open Graph card (1200x630): brand green background, Lucide Sprout icon and wordmark in white.

function buildSvg() {
  const width = 1200;
  const height = 630;
  
  const iconSize = 144;
  const scale = iconSize / 24; // Lucide icons are drawn on a 24px grid

  const fontSize = 92;
  const gap = 48;

  // icon + gap + ~690px of text is ~882px wide, so start at (1200 - 882) / 2
  const startX = 160;
  const centerY = height / 2;

  const iconY = centerY - iconSize / 2;
  const textX = startX + iconSize + gap;
  const textY = centerY + 32; // optical baseline alignment

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700&amp;display=swap');
      .brand-title {
        font-family: 'Plus Jakarta Sans', 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
        font-size: ${fontSize}px;
        font-weight: 700;
        fill: #ffffff;
        letter-spacing: -0.02em;
      }
      .domain-accent {
        fill: #ffffff;
        opacity: 0.9;
        font-weight: 600;
      }
    </style>
  </defs>

  <!-- Background in exact brand green -->
  <rect width="${width}" height="${height}" fill="#16a34a"/>

  <!-- Centered Content: Sprout Icon + Pflanzengilde.de -->
  <g>
    <!-- Exact Lucide Sprout vector icon from favicon.svg / Navbar -->
    <g transform="translate(${startX}, ${iconY}) scale(${scale})" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 20h10"/>
      <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
      <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
      <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
    </g>

    <!-- Clean modern title -->
    <text x="${textX}" y="${textY}" class="brand-title">Pflanzengilde<tspan class="domain-accent">.de</tspan></text>
  </g>
</svg>
`.trim();
}

async function generate() {
  const svg = buildSvg();
  const publicDir = path.join(__dirname, '..', 'public');
  const svgPath = path.join(publicDir, 'og-image.svg');
  const pngPath = path.join(publicDir, 'og-image.png');
  const jpgPath = path.join(publicDir, 'og-image.jpg');

  fs.writeFileSync(svgPath, svg, 'utf8');
  console.log('Saved SVG to:', svgPath);

  await sharp(Buffer.from(svg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(pngPath);
  console.log('Generated PNG:', pngPath);

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(jpgPath);
  console.log('Generated JPG:', jpgPath);

  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(jpgPath, path.join(distDir, 'og-image.jpg'));
    fs.copyFileSync(pngPath, path.join(distDir, 'og-image.png'));
    fs.copyFileSync(svgPath, path.join(distDir, 'og-image.svg'));
    console.log('Mirrored to dist directory.');
  }
}

generate().catch(err => {
  console.error('Generation failed:', err);
  process.exit(1);
});
