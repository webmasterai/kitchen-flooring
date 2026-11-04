import sharp from "sharp";
import path from "path";
import fs from "fs";

const root = process.cwd();
const outDir = path.join(root, "public/media/flooring/finishes");
fs.mkdirSync(outDir, { recursive: true });

async function cropAbs(srcRel, outName, region) {
  const src = path.join(root, "public", ...srcRel.split("/"));
  const out = path.join(outDir, outName);
  await sharp(src).extract(region).jpeg({ quality: 90 }).toFile(out);
  const meta = await sharp(out).metadata();
  console.log("wrote", outName, meta.width, "x", meta.height);
}

await cropAbs(
  "media/services/leo-kitchor-home4-banner4-img2.jpg",
  "look-light-oak.jpg",
  { left: 140, top: 360, width: 320, height: 88 },
);
await cropAbs(
  "media/gallery/flora2-1-qrha893c5ip8nsb3ayo0gx4vs8ugckl8pryo669n5s.jpg",
  "look-warm-oak.jpg",
  { left: 80, top: 390, width: 560, height: 150 },
);
await cropAbs(
  "media/services/leo-kitchor-home4-banner4-img1.jpg",
  "look-walnut.jpg",
  { left: 40, top: 330, width: 540, height: 110 },
);
await cropAbs(
  "media/services/ceramic-porcelain-tile_silk-light-grey-matte-6de900f0f8347293d4adac1743d3f12f_fb3761a9-5d27-4c0a-8926-38996d4c772e.webp",
  "look-stone.jpg",
  { left: 180, top: 720, width: 900, height: 320 },
);
await cropAbs(
  "media/services/laminate-vs-vinyl-feature-pic-1_2048x.webp",
  "look-soft-grey.jpg",
  { left: 700, top: 980, width: 900, height: 320 },
);
