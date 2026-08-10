const sharp = require('sharp');
const fs = require('fs');

const svg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="#0f0f23"/>
    </radialGradient>
    <radialGradient id="moon" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#00d4aa"/>
      <stop offset="100%" stop-color="#0099ff"/>
    </radialGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="20" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1024" height="1024" rx="200" fill="url(#bg)"/>
  <circle cx="512" cy="512" r="380" fill="url(#moon)" filter="url(#glow)"/>
  <circle cx="512" cy="512" r="280" fill="url(#bg)" opacity="0.9"/>
  <path d="M420 320 Q512 300 604 320 Q620 400 512 480 Q404 400 420 320" fill="#00d4aa" opacity="0.3"/>
  <circle cx="512" cy="512" r="180" fill="none" stroke="#00d4aa" stroke-width="3" opacity="0.5"/>
  <circle cx="512" cy="512" r="120" fill="none" stroke="#00d4aa" stroke-width="2" opacity="0.3" stroke-dasharray="10,10"/>
</svg>
`;

const svgBuffer = Buffer.from(svg);

async function generateAssets() {
  const assetsDir = './assets';
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // Generate icon.png (1024x1024)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(`${assetsDir}/icon.png`);
  console.log('Created icon.png');

  // Generate splash.png (2048x2048 for high-res)
  await sharp(svgBuffer)
    .resize(2048, 2048)
    .png()
    .toFile(`${assetsDir}/splash.png`);
  console.log('Created splash.png');

  // Generate adaptive-icon.png (1024x1024)
  await sharp(svgBuffer)
    .resize(1024, 1024)
    .png()
    .toFile(`${assetsDir}/adaptive-icon.png`);
  console.log('Created adaptive-icon.png');

  // Generate favicon.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(`${assetsDir}/favicon.png`);
  console.log('Created favicon.png');

  console.log('All assets generated!');
}

generateAssets().catch(console.error);
