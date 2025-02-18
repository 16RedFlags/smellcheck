const sharp = require("sharp");
const path = require("path");

async function generateFavicons() {
  const publicDir = path.join(__dirname, "../public");

  // Create a simple colored square with rounded corners
  const size = 512;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="${size}" height="${size}" rx="100" fill="#262B36"/>
      <text x="50%" y="50%" font-family="Arial" font-size="300" fill="white" text-anchor="middle" dy=".35em">👃</text>
    </svg>
  `;

  // Generate different sizes
  const sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, filename));
    console.log(`Generated ${filename}`);
  }

  // Generate ICO file
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFormat("ico")
    .toFile(path.join(publicDir, "favicon.ico"));
  console.log("Generated favicon.ico");
}

generateFavicons().catch(console.error);
