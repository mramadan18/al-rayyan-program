/**
 * Generate NSIS Installer BMP Branding Assets
 * ─────────────────────────────────────────────
 * NSIS requires uncompressed BMP format for sidebar and header images.
 * This is because the Windows API (and NSIS internally) uses raw BMP bitmaps
 * via LoadImage/LoadBitmap — no PNG/JPEG decoders are available natively.
 *
 * Specs:
 *   - installerSidebar.bmp: 164 x 314 px (vertical, shown on welcome/finish pages)
 *   - installerHeader.bmp:  150 x 57 px  (horizontal, shown on all other pages)
 *
 * Theme: Dark Islamic (#1a1a2e) with orange accents (#ff9800)
 *
 * Run: node scripts/generate-installer-bitmaps.js
 */

const fs = require("fs");
const path = require("path");

// ─── BMP Writer ────────────────────────────────
// BMP format: file header (14 bytes) + DIB header (40 bytes) + pixel data
// Pixels stored bottom-to-top, BGR order, rows padded to 4-byte boundary

function createBMP(width, height, pixelCallback) {
  const rowSize = Math.ceil((width * 3) / 4) * 4; // each row padded to 4 bytes
  const pixelDataSize = rowSize * height;
  const fileSize = 14 + 40 + pixelDataSize;

  const buf = Buffer.alloc(fileSize);

  // ── File Header (14 bytes) ──
  buf.write("BM", 0); // Signature
  buf.writeUInt32LE(fileSize, 2); // File size
  buf.writeUInt32LE(0, 6); // Reserved
  buf.writeUInt32LE(14 + 40, 10); // Pixel data offset

  // ── DIB Header (BITMAPINFOHEADER, 40 bytes) ──
  buf.writeUInt32LE(40, 14); // DIB header size
  buf.writeInt32LE(width, 18); // Width
  buf.writeInt32LE(height, 22); // Height (positive = bottom-up)
  buf.writeUInt16LE(1, 26); // Color planes
  buf.writeUInt16LE(24, 28); // Bits per pixel (24-bit RGB)
  buf.writeUInt32LE(0, 30); // Compression (none)
  buf.writeUInt32LE(pixelDataSize, 34); // Image size
  buf.writeInt32LE(2835, 38); // Horizontal resolution (72 DPI)
  buf.writeInt32LE(2835, 42); // Vertical resolution (72 DPI)
  buf.writeUInt32LE(0, 46); // Colors in palette
  buf.writeUInt32LE(0, 50); // Important colors

  // ── Pixel Data (bottom-up, BGR) ──
  const dataOffset = 54;
  for (let y = 0; y < height; y++) {
    // BMP stores rows bottom-to-top
    const bmpRow = height - 1 - y;
    for (let x = 0; x < width; x++) {
      const [r, g, b] = pixelCallback(x, y, width, height);
      const offset = dataOffset + bmpRow * rowSize + x * 3;
      buf[offset] = b; // Blue
      buf[offset + 1] = g; // Green
      buf[offset + 2] = r; // Red
    }
  }

  return buf;
}

// ─── Color Utilities ───────────────────────────

function hexToRGB(hex) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function lerpColor(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ─── Theme Colors ──────────────────────────────

const DARK_BG = hexToRGB("#1a1a2e");
const DARK_DEEP = hexToRGB("#0f0f1a");
const BLACK = [0, 0, 0];
const ORANGE = hexToRGB("#ff9800");
const ORANGE_DIM = hexToRGB("#cc7a00");
const WHITE = [255, 255, 255];
const GOLD_SUBTLE = hexToRGB("#332200");

// ─── Islamic Geometric Pattern (Simplified) ────

function islamicPatternIntensity(x, y, scale = 20) {
  // Create a repeating diamond/star pattern
  const px = (x % scale) / scale;
  const py = (y % scale) / scale;
  const cx = Math.abs(px - 0.5) * 2;
  const cy = Math.abs(py - 0.5) * 2;

  // Diamond shape
  const diamond = cx + cy;
  const star = Math.max(cx, cy);

  // Combine for a cross-star pattern
  const pattern = diamond < 0.6 ? 0.15 : star < 0.3 ? 0.1 : 0.0;
  return pattern;
}

// ─── Circle shape for icons ────────────────────

function circleIntensity(x, y, cx, cy, radius) {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > radius) return 0;
  if (dist > radius - 1.5) return 0.3; // anti-aliased edge
  return 1;
}

// Crescent moon shape
function crescentIntensity(x, y, cx, cy, outerR, innerR, offsetX) {
  const outerDist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const innerDist = Math.sqrt((x - (cx + offsetX)) ** 2 + (y - cy) ** 2);
  if (outerDist <= outerR && innerDist > innerR) {
    const edgeFade = Math.min(1, (outerR - outerDist) / 1.5);
    return edgeFade;
  }
  return 0;
}

// Small star (decorative)
function starIntensity(x, y, cx, cy, size) {
  const dx = Math.abs(x - cx);
  const dy = Math.abs(y - cy);
  if (dx < size * 0.15 && dy < size) return Math.max(0, 1 - dy / size);
  if (dy < size * 0.15 && dx < size) return Math.max(0, 1 - dx / size);
  return 0;
}

// ─── Generate Sidebar (164 x 314) ──────────────

function generateSidebar() {
  const W = 164;
  const H = 314;

  return createBMP(W, H, (x, y, w, h) => {
    // Base: dark gradient from DARK_BG to BLACK (top to bottom)
    const gradientT = y / h;
    let bg = lerpColor(DARK_BG, DARK_DEEP, gradientT * 0.7);

    // Islamic pattern overlay (subtle, fading toward bottom)
    const patternFade = 1 - Math.pow(gradientT, 0.8);
    const patternVal = islamicPatternIntensity(x, y, 24) * patternFade;
    bg = lerpColor(bg, lerpColor(DARK_BG, GOLD_SUBTLE, 0.5), patternVal);

    // Vertical accent line on the right edge
    if (x >= w - 2) {
      const lineIntensity = 0.3 * (1 - gradientT * 0.5);
      bg = lerpColor(bg, ORANGE_DIM, lineIntensity);
    }

    // ── Crescent Moon Icon (centered, near top) ──
    const iconCX = w / 2;
    const iconCY = 65;
    const moonOuter = 22;
    const moonInner = 17;

    const moon = crescentIntensity(
      x,
      y,
      iconCX,
      iconCY,
      moonOuter,
      moonInner,
      7,
    );
    if (moon > 0) {
      // Glow effect
      const dist = Math.sqrt((x - iconCX) ** 2 + (y - iconCY) ** 2);
      const glowT = clamp(1 - dist / (moonOuter * 2), 0, 1);
      bg = lerpColor(bg, ORANGE, moon * 0.95);
    }

    // Small star near the crescent
    const star1 = starIntensity(x, y, iconCX + 18, iconCY - 15, 5);
    if (star1 > 0) {
      bg = lerpColor(bg, ORANGE, star1 * 0.8);
    }

    const star2 = starIntensity(x, y, iconCX + 22, iconCY - 5, 3);
    if (star2 > 0) {
      bg = lerpColor(bg, ORANGE, star2 * 0.6);
    }

    // ── Glow halo behind icon ──
    const iconDist = Math.sqrt((x - iconCX) ** 2 + (y - iconCY) ** 2);
    if (iconDist < 45) {
      const haloT = Math.pow(1 - iconDist / 45, 2) * 0.12;
      bg = lerpColor(bg, ORANGE, haloT);
    }

    // ── Text region indicators (visual bars for "الريّان" and "Al Rayyan") ──
    // Arabic title area (~y: 110-135)
    if (y >= 115 && y <= 130) {
      const textCenterX = w / 2;
      const textWidth = 80;
      const dx = Math.abs(x - textCenterX);
      if (dx < textWidth / 2) {
        // Simulate Arabic text "الريّان" with block shapes
        const charIndex = Math.floor((x - (textCenterX - textWidth / 2)) / 10);
        const charY = (y - 115) / 15;
        // Simplified text-like blocks
        const textPatterns = [1, 0, 1, 1, 0, 1, 1, 1];
        if (
          charIndex >= 0 &&
          charIndex < textPatterns.length &&
          textPatterns[charIndex]
        ) {
          if (charY > 0.15 && charY < 0.85) {
            bg = lerpColor(bg, WHITE, 0.85);
          }
        }
      }
    }

    // English subtitle area (~y: 140-152)
    if (y >= 143 && y <= 153) {
      const textCenterX = w / 2;
      const textWidth = 70;
      const dx = Math.abs(x - textCenterX);
      if (dx < textWidth / 2) {
        const charIndex = Math.floor((x - (textCenterX - textWidth / 2)) / 8);
        const charY = (y - 143) / 10;
        const textPatterns = [1, 0, 1, 1, 0, 1, 1, 0, 1];
        if (
          charIndex >= 0 &&
          charIndex < textPatterns.length &&
          textPatterns[charIndex]
        ) {
          if (charY > 0.15 && charY < 0.85) {
            bg = lerpColor(bg, ORANGE, 0.7);
          }
        }
      }
    }

    // ── Decorative bottom separator line ──
    if (y >= h - 30 && y <= h - 28) {
      const lineX = Math.abs(x - w / 2) / (w / 2);
      if (lineX < 0.6) {
        const lineFade = 1 - lineX / 0.6;
        bg = lerpColor(bg, ORANGE_DIM, lineFade * 0.4);
      }
    }

    // ── Bottom Islamic ornament ──
    if (y >= h - 25) {
      const ornamentT = (y - (h - 25)) / 25;
      const patternVal2 =
        islamicPatternIntensity(x, y, 16) * (1 - ornamentT) * 0.3;
      bg = lerpColor(bg, ORANGE_DIM, patternVal2);
    }

    return bg;
  });
}

// ─── Generate Header (150 x 57) ────────────────

function generateHeader() {
  const W = 150;
  const H = 57;

  return createBMP(W, H, (x, y, w, h) => {
    // Base: subtle dark gradient left-to-right
    const gradientT = x / w;
    let bg = lerpColor(DARK_BG, DARK_DEEP, gradientT * 0.3);

    // Very subtle Islamic pattern
    const patternVal = islamicPatternIntensity(x, y, 16) * 0.08;
    bg = lerpColor(bg, GOLD_SUBTLE, patternVal);

    // ── Small crescent icon on the left ──
    const iconCX = 22;
    const iconCY = h / 2;
    const moonOuter = 10;
    const moonInner = 7;

    const moon = crescentIntensity(
      x,
      y,
      iconCX,
      iconCY,
      moonOuter,
      moonInner,
      4,
    );
    if (moon > 0) {
      bg = lerpColor(bg, ORANGE, moon * 0.9);
    }

    // Small star
    const star = starIntensity(x, y, iconCX + 9, iconCY - 7, 3);
    if (star > 0) {
      bg = lerpColor(bg, ORANGE, star * 0.7);
    }

    // Icon glow
    const iconDist = Math.sqrt((x - iconCX) ** 2 + (y - iconCY) ** 2);
    if (iconDist < 20) {
      const haloT = Math.pow(1 - iconDist / 20, 2) * 0.1;
      bg = lerpColor(bg, ORANGE, haloT);
    }

    // ── Text area: "Al Rayyan" ──
    if (x >= 40 && x <= 110 && y >= 14 && y <= 26) {
      const charIndex = Math.floor((x - 40) / 8);
      const charY = (y - 14) / 12;
      const textPatterns = [1, 0, 1, 1, 0, 1, 1, 0, 1];
      if (
        charIndex >= 0 &&
        charIndex < textPatterns.length &&
        textPatterns[charIndex]
      ) {
        if (charY > 0.1 && charY < 0.9) {
          bg = lerpColor(bg, WHITE, 0.85);
        }
      }
    }

    // ── Arabic subtitle: "الريّان" ──
    if (x >= 45 && x <= 105 && y >= 32 && y <= 42) {
      const charIndex = Math.floor((x - 45) / 8);
      const charY = (y - 32) / 10;
      const textPatterns = [1, 0, 1, 1, 0, 1, 1, 1];
      if (
        charIndex >= 0 &&
        charIndex < textPatterns.length &&
        textPatterns[charIndex]
      ) {
        if (charY > 0.1 && charY < 0.9) {
          bg = lerpColor(bg, ORANGE, 0.65);
        }
      }
    }

    // ── Subtle bottom border ──
    if (y >= h - 2) {
      const borderFade = (y - (h - 2)) / 2;
      bg = lerpColor(bg, ORANGE_DIM, borderFade * 0.3);
    }

    return bg;
  });
}

// ─── Write Files ───────────────────────────────

const resourcesDir = path.join(__dirname, "..", "resources");

const sidebarPath = path.join(resourcesDir, "installerSidebar.bmp");
const headerPath = path.join(resourcesDir, "installerHeader.bmp");

console.log("Generating NSIS Installer Branding Assets...");
console.log("─────────────────────────────────────────────");

const sidebarBuf = generateSidebar();
fs.writeFileSync(sidebarPath, sidebarBuf);
console.log(`✅ installerSidebar.bmp (164×314) → ${sidebarPath}`);
console.log(`   Size: ${sidebarBuf.length} bytes`);

const headerBuf = generateHeader();
fs.writeFileSync(headerPath, headerBuf);
console.log(`✅ installerHeader.bmp (150×57)   → ${headerPath}`);
console.log(`   Size: ${headerBuf.length} bytes`);

console.log("─────────────────────────────────────────────");
console.log("Done! Both BMP files are ready for NSIS.");
