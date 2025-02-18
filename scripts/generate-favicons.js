const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const { createCanvas } = require("canvas");

async function generateFavicons() {
  const publicDir = path.join(__dirname, "../public");

  // Create a canvas and draw the emoji
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext("2d");
  ctx.font = "512px 'Segoe UI Emoji'";
  ctx.fillText("👃", 0, 440);

  // Save the canvas as PNG
  const buffer = canvas.toBuffer("image/png");
  await fs.writeFile(path.join(__dirname, "../favicon-source.png"), buffer);

  // Generate different sizes
  const sizes = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,
  };

  for (const [filename, size] of Object.entries(sizes)) {
    await sharp(path.join(__dirname, "../favicon-source.png"))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, filename));
    console.log(`Generated ${filename}`);
  }

  // Generate ICO file
  await sharp(path.join(__dirname, "../favicon-source.png"))
    .resize(32, 32)
    .toFormat("ico")
    .toFile(path.join(publicDir, "favicon.ico"));
  console.log("Generated favicon.ico");
}

generateFavicons().catch(console.error);
