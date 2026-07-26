import QRCode from 'qrcode';
import { QRStyleConfig } from '../types';

interface FinderPattern {
  row: number;
  col: number;
}

/**
 * Checks if a given row/col module is part of one of the 3 main Finder Patterns (7x7 eyes)
 */
function isFinderPatternModule(row: number, col: number, matrixSize: number): boolean {
  // Top-Left (0..6, 0..6)
  if (row <= 6 && col <= 6) return true;
  // Top-Right (0..6, size-7..size-1)
  if (row <= 6 && col >= matrixSize - 7) return true;
  // Bottom-Left (size-7..size-1, 0..6)
  if (row >= matrixSize - 7 && col <= 6) return true;

  return false;
}

/**
 * Returns finder patterns top-left coords
 */
function getFinderPatterns(matrixSize: number): FinderPattern[] {
  return [
    { row: 0, col: 0 },
    { row: 0, col: matrixSize - 7 },
    { row: matrixSize - 7, col: 0 },
  ];
}

/**
 * Main function to draw QR code onto a canvas element
 */
export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  config: QRStyleConfig,
  targetSizeMultiplier: number = 1
): Promise<void> {
  const text = payload && payload.trim() ? payload : 'https://example.com';
  
  // Auto elevate error correction to 'H' if logo exists
  const ecl = config.logoUrl ? 'H' : (config.errorCorrectionLevel || 'M');

  let qrData: QRCode.QRCode;
  try {
    qrData = QRCode.create(text, { errorCorrectionLevel: ecl });
  } catch (err) {
    // Fallback if payload too long for current ecl
    try {
      qrData = QRCode.create(text, { errorCorrectionLevel: 'L' });
    } catch (e) {
      console.error('Failed to create QR code matrix:', e);
      return;
    }
  }

  const matrixSize = qrData.modules.size;
  const matrixData = qrData.modules.data; // Uint8Array length = matrixSize * matrixSize
  const margin = Math.max(0, config.margin ?? 2);
  const totalGridSize = matrixSize + margin * 2;

  // Frame calculation offsets
  let frameTopPadding = 0;
  let frameBottomPadding = 0;
  let frameLeftPadding = 0;
  let frameRightPadding = 0;

  const hasFrame = config.frameStyle && config.frameStyle !== 'none';
  if (hasFrame) {
    if (config.frameStyle === 'top-label') {
      frameTopPadding = 50;
      frameBottomPadding = 20;
      frameLeftPadding = 20;
      frameRightPadding = 20;
    } else if (config.frameStyle === 'bottom-label') {
      frameTopPadding = 20;
      frameBottomPadding = 60;
      frameLeftPadding = 20;
      frameRightPadding = 20;
    } else if (config.frameStyle === 'card-border') {
      frameTopPadding = 30;
      frameBottomPadding = 60;
      frameLeftPadding = 30;
      frameRightPadding = 30;
    } else if (config.frameStyle === 'badge-top') {
      frameTopPadding = 55;
      frameBottomPadding = 25;
      frameLeftPadding = 25;
      frameRightPadding = 25;
    } else if (config.frameStyle === 'phone-frame') {
      frameTopPadding = 60;
      frameBottomPadding = 70;
      frameLeftPadding = 25;
      frameRightPadding = 25;
    }
  }

  const baseQRDimension = Math.max(180, (config.size || 320)) * targetSizeMultiplier;
  const qrWidth = baseQRDimension;
  const qrHeight = baseQRDimension;

  const totalWidth = qrWidth + (frameLeftPadding + frameRightPadding) * targetSizeMultiplier;
  const totalHeight = qrHeight + (frameTopPadding + frameBottomPadding) * targetSizeMultiplier;

  canvas.width = totalWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, totalWidth, totalHeight);

  // 1. Draw Outer Frame Container / Background if frame exists
  if (hasFrame) {
    ctx.save();
    ctx.fillStyle = config.frameColor || '#1e293b';
    
    const rx = 16 * targetSizeMultiplier;
    // Draw rounded outer frame box
    ctx.beginPath();
    ctx.roundRect(0, 0, totalWidth, totalHeight, rx);
    ctx.fill();

    // Inner QR Container Box (white/transparent backing for QR)
    const qrBoxX = frameLeftPadding * targetSizeMultiplier;
    const qrBoxY = frameTopPadding * targetSizeMultiplier;
    
    ctx.fillStyle = config.transparentBg ? 'transparent' : (config.backgroundColor || '#ffffff');
    if (!config.transparentBg) {
      ctx.beginPath();
      ctx.roundRect(qrBoxX, qrBoxY, qrWidth, qrHeight, 12 * targetSizeMultiplier);
      ctx.fill();
    }
    ctx.restore();
  } else {
    // No frame background fill
    if (!config.transparentBg) {
      ctx.fillStyle = config.backgroundColor || '#ffffff';
      ctx.fillRect(0, 0, totalWidth, totalHeight);
    }
  }

  // Calculate actual QR matrix positioning
  const qrX = (frameLeftPadding) * targetSizeMultiplier;
  const qrY = (frameTopPadding) * targetSizeMultiplier;

  const moduleSize = qrWidth / totalGridSize;

  // Prepare Foreground Fill Style (Solid or Gradient)
  let fgStyle: string | CanvasGradient = config.foregroundColor || '#000000';

  if (config.gradientType && config.gradientType !== 'none' && config.gradientColor2) {
    if (config.gradientType === 'linear') {
      const angleRad = ((config.gradientAngle || 45) * Math.PI) / 180;
      const x1 = qrX;
      const y1 = qrY;
      const x2 = qrX + Math.cos(angleRad) * qrWidth;
      const y2 = qrY + Math.sin(angleRad) * qrHeight;
      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      grad.addColorStop(0, config.foregroundColor || '#000000');
      grad.addColorStop(1, config.gradientColor2);
      fgStyle = grad;
    } else if (config.gradientType === 'radial') {
      const cx = qrX + qrWidth / 2;
      const cy = qrY + qrHeight / 2;
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, qrWidth / 1.4);
      grad.addColorStop(0, config.foregroundColor || '#000000');
      grad.addColorStop(1, config.gradientColor2);
      fgStyle = grad;
    }
  }

  // 2. Draw Data Modules (excluding finder patterns)
  ctx.save();
  ctx.fillStyle = fgStyle;

  const pattern = config.patternStyle || 'square';

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isFinderPatternModule(r, c, matrixSize)) continue;

      const isDark = matrixData[r * matrixSize + c] === 1;
      if (!isDark) continue;

      const modX = qrX + (c + margin) * moduleSize;
      const modY = qrY + (r + margin) * moduleSize;

      if (pattern === 'dots') {
        ctx.beginPath();
        ctx.arc(modX + moduleSize / 2, modY + moduleSize / 2, moduleSize / 2 * 0.88, 0, Math.PI * 2);
        ctx.fill();
      } else if (pattern === 'rounded') {
        ctx.beginPath();
        ctx.roundRect(modX, modY, moduleSize * 0.95, moduleSize * 0.95, moduleSize * 0.4);
        ctx.fill();
      } else if (pattern === 'diamond') {
        ctx.beginPath();
        ctx.moveTo(modX + moduleSize / 2, modY);
        ctx.lineTo(modX + moduleSize, modY + moduleSize / 2);
        ctx.lineTo(modX + moduleSize / 2, modY + moduleSize);
        ctx.lineTo(modX, modY + moduleSize / 2);
        ctx.closePath();
        ctx.fill();
      } else if (pattern === 'classy') {
        ctx.beginPath();
        ctx.roundRect(modX + moduleSize * 0.05, modY + moduleSize * 0.05, moduleSize * 0.9, moduleSize * 0.9, [
          moduleSize * 0.4,
          0,
          moduleSize * 0.4,
          0,
        ]);
        ctx.fill();
      } else {
        // Square
        ctx.fillRect(modX, modY, moduleSize + 0.3, moduleSize + 0.3);
      }
    }
  }
  ctx.restore();

  // 3. Draw Finder Patterns (Eyes)
  const finderPatterns = getFinderPatterns(matrixSize);
  const eyeColor = (config.eyeColor && config.eyeColor.trim()) ? config.eyeColor : fgStyle;

  for (const fp of finderPatterns) {
    const eyeX = qrX + (fp.col + margin) * moduleSize;
    const eyeY = qrY + (fp.row + margin) * moduleSize;
    const eyeOuterSize = 7 * moduleSize;

    ctx.save();
    ctx.fillStyle = eyeColor;

    const eyeStyle = config.eyeStyle || 'square';

    // Outer Eye Frame (7x7 modules size, 1 module stroke width)
    if (eyeStyle === 'circle') {
      // Circle outer
      ctx.beginPath();
      ctx.arc(eyeX + eyeOuterSize / 2, eyeY + eyeOuterSize / 2, eyeOuterSize / 2, 0, Math.PI * 2);
      ctx.arc(eyeX + eyeOuterSize / 2, eyeY + eyeOuterSize / 2, eyeOuterSize / 2 - moduleSize, 0, Math.PI * 2, true);
      ctx.fill();
    } else if (eyeStyle === 'rounded') {
      ctx.beginPath();
      ctx.roundRect(eyeX, eyeY, eyeOuterSize, eyeOuterSize, moduleSize * 2);
      ctx.roundRect(
        eyeX + moduleSize,
        eyeY + moduleSize,
        eyeOuterSize - 2 * moduleSize,
        eyeOuterSize - 2 * moduleSize,
        moduleSize * 1.2
      );
      ctx.fill('evenodd');
    } else if (eyeStyle === 'leaf') {
      ctx.beginPath();
      ctx.roundRect(eyeX, eyeY, eyeOuterSize, eyeOuterSize, [moduleSize * 2.8, 0, moduleSize * 2.8, 0]);
      ctx.roundRect(
        eyeX + moduleSize,
        eyeY + moduleSize,
        eyeOuterSize - 2 * moduleSize,
        eyeOuterSize - 2 * moduleSize,
        [moduleSize * 1.8, 0, moduleSize * 1.8, 0]
      );
      ctx.fill('evenodd');
    } else if (eyeStyle === 'shield') {
      ctx.beginPath();
      ctx.roundRect(eyeX, eyeY, eyeOuterSize, eyeOuterSize, [moduleSize * 1.5, moduleSize * 1.5, moduleSize * 3, moduleSize * 3]);
      ctx.roundRect(
        eyeX + moduleSize,
        eyeY + moduleSize,
        eyeOuterSize - 2 * moduleSize,
        eyeOuterSize - 2 * moduleSize,
        [moduleSize, moduleSize, moduleSize * 2, moduleSize * 2]
      );
      ctx.fill('evenodd');
    } else {
      // Standard Square Frame
      ctx.fillRect(eyeX, eyeY, eyeOuterSize, eyeOuterSize);
      // Clear inner 5x5
      ctx.fillStyle = config.transparentBg ? 'rgba(0,0,0,0)' : (config.backgroundColor || '#ffffff');
      if (config.transparentBg) {
        ctx.clearRect(eyeX + moduleSize, eyeY + moduleSize, eyeOuterSize - 2 * moduleSize, eyeOuterSize - 2 * moduleSize);
      } else {
        ctx.fillRect(eyeX + moduleSize, eyeY + moduleSize, eyeOuterSize - 2 * moduleSize, eyeOuterSize - 2 * moduleSize);
      }
    }

    // Inner Eye Ball (3x3 modules)
    ctx.fillStyle = eyeColor;
    const ballX = eyeX + 2 * moduleSize;
    const ballY = eyeY + 2 * moduleSize;
    const ballSize = 3 * moduleSize;

    const ballStyle = config.eyeBallStyle || 'square';
    if (ballStyle === 'circle') {
      ctx.beginPath();
      ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (ballStyle === 'diamond') {
      ctx.beginPath();
      ctx.moveTo(ballX + ballSize / 2, ballY);
      ctx.lineTo(ballX + ballSize, ballY + ballSize / 2);
      ctx.lineTo(ballX + ballSize / 2, ballY + ballSize);
      ctx.lineTo(ballX, ballY + ballSize / 2);
      ctx.closePath();
      ctx.fill();
    } else if (ballStyle === 'heart') {
      ctx.beginPath();
      ctx.arc(ballX + ballSize * 0.3, ballY + ballSize * 0.3, ballSize * 0.3, Math.PI, 0);
      ctx.arc(ballX + ballSize * 0.7, ballY + ballSize * 0.3, ballSize * 0.3, Math.PI, 0);
      ctx.lineTo(ballX + ballSize / 2, ballY + ballSize * 0.95);
      ctx.closePath();
      ctx.fill();
    } else {
      // Square Ball
      ctx.fillRect(ballX, ballY, ballSize, ballSize);
    }

    ctx.restore();
  }

  // 4. Draw Center Logo if provided
  if (config.logoUrl) {
    try {
      const img = await loadImage(config.logoUrl);
      const scale = config.logoScale || 0.22;
      const logoSize = qrWidth * scale;
      const logoX = qrX + (qrWidth - logoSize) / 2;
      const logoY = qrY + (qrHeight - logoSize) / 2;

      ctx.save();

      // Clear area behind logo
      const bgShape = config.logoBgShape || 'circle';
      const bgPad = (config.logoMargin ?? 6) * targetSizeMultiplier;

      if (bgShape !== 'none') {
        ctx.fillStyle = config.logoBgColor || '#ffffff';
        if (bgShape === 'circle') {
          ctx.beginPath();
          ctx.arc(logoX + logoSize / 2, logoY + logoSize / 2, logoSize / 2 + bgPad, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.roundRect(logoX - bgPad, logoY - bgPad, logoSize + bgPad * 2, logoSize + bgPad * 2, 8 * targetSizeMultiplier);
          ctx.fill();
        }
      }

      // Draw the image logo
      ctx.drawImage(img, logoX, logoY, logoSize, logoSize);
      ctx.restore();
    } catch (e) {
      console.warn('Could not load logo image for QR code:', e);
    }
  }

  // 5. Draw Frame Text / Banners
  if (hasFrame) {
    ctx.save();
    ctx.fillStyle = config.frameTextColor || '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const fontSize = Math.max(14, Math.round(18 * targetSizeMultiplier));
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

    const labelText = config.frameText && config.frameText.trim() ? config.frameText.toUpperCase() : 'SCAN ME';

    if (config.frameStyle === 'top-label' || config.frameStyle === 'badge-top') {
      ctx.fillText(labelText, totalWidth / 2, (frameTopPadding / 2) * targetSizeMultiplier);
    } else if (config.frameStyle === 'bottom-label' || config.frameStyle === 'card-border' || config.frameStyle === 'phone-frame') {
      const posY = totalHeight - (frameBottomPadding / 2) * targetSizeMultiplier;
      ctx.fillText(labelText, totalWidth / 2, posY);
    }
    ctx.restore();
  }
}

/**
 * Image loader promise
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Generates high-res PNG or JPG Data URL
 */
export async function generateQRDataURL(
  payload: string,
  config: QRStyleConfig,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  resolutionMultiplier: number = 2
): Promise<string> {
  const canvas = document.createElement('canvas');
  await renderQRToCanvas(canvas, payload, config, resolutionMultiplier);
  return canvas.toDataURL(format, 0.95);
}

/**
 * Generates scalable SVG String representation
 */
export async function generateQRSVG(payload: string, config: QRStyleConfig): Promise<string> {
  const text = payload && payload.trim() ? payload : 'https://example.com';
  const ecl = config.logoUrl ? 'H' : (config.errorCorrectionLevel || 'M');

  let qrData: QRCode.QRCode;
  try {
    qrData = QRCode.create(text, { errorCorrectionLevel: ecl });
  } catch (e) {
    qrData = QRCode.create(text, { errorCorrectionLevel: 'L' });
  }

  const matrixSize = qrData.modules.size;
  const matrixData = qrData.modules.data;
  const margin = Math.max(0, config.margin ?? 2);
  const totalGridSize = matrixSize + margin * 2;
  const viewSize = 500;
  const moduleSize = viewSize / totalGridSize;

  let paths = '';
  const fg = config.foregroundColor || '#000000';
  const bg = config.transparentBg ? 'none' : (config.backgroundColor || '#ffffff');

  // Background
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewSize} ${viewSize}" width="${viewSize}" height="${viewSize}">`;
  if (!config.transparentBg) {
    svgContent += `<rect width="100%" height="100%" fill="${bg}" />`;
  }

  // Modules
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isFinderPatternModule(r, c, matrixSize)) continue;
      if (matrixData[r * matrixSize + c] === 1) {
        const mx = (c + margin) * moduleSize;
        const my = (r + margin) * moduleSize;
        if (config.patternStyle === 'dots') {
          paths += `<circle cx="${mx + moduleSize / 2}" cy="${my + moduleSize / 2}" r="${moduleSize / 2 * 0.88}" fill="${fg}" />`;
        } else if (config.patternStyle === 'rounded') {
          paths += `<rect x="${mx}" y="${my}" width="${moduleSize * 0.95}" height="${moduleSize * 0.95}" rx="${moduleSize * 0.4}" fill="${fg}" />`;
        } else {
          paths += `<rect x="${mx}" y="${my}" width="${moduleSize + 0.2}" height="${moduleSize + 0.2}" fill="${fg}" />`;
        }
      }
    }
  }

  // Finder Patterns in SVG
  const finderPatterns = getFinderPatterns(matrixSize);
  const eyeCol = (config.eyeColor && config.eyeColor.trim()) ? config.eyeColor : fg;

  for (const fp of finderPatterns) {
    const eyeX = (fp.col + margin) * moduleSize;
    const eyeY = (fp.row + margin) * moduleSize;
    const outer = 7 * moduleSize;
    const inner = 5 * moduleSize;
    const ball = 3 * moduleSize;

    // Outer frame
    if (config.eyeStyle === 'circle') {
      paths += `<circle cx="${eyeX + outer / 2}" cy="${eyeY + outer / 2}" r="${outer / 2}" fill="${eyeCol}" />`;
      paths += `<circle cx="${eyeX + outer / 2}" cy="${eyeY + outer / 2}" r="${inner / 2}" fill="${bg === 'none' ? '#ffffff' : bg}" />`;
    } else if (config.eyeStyle === 'rounded') {
      paths += `<rect x="${eyeX}" y="${eyeY}" width="${outer}" height="${outer}" rx="${moduleSize * 2}" fill="${eyeCol}" />`;
      paths += `<rect x="${eyeX + moduleSize}" y="${eyeY + moduleSize}" width="${inner}" height="${inner}" rx="${moduleSize * 1.2}" fill="${bg === 'none' ? '#ffffff' : bg}" />`;
    } else {
      paths += `<rect x="${eyeX}" y="${eyeY}" width="${outer}" height="${outer}" fill="${eyeCol}" />`;
      paths += `<rect x="${eyeX + moduleSize}" y="${eyeY + moduleSize}" width="${inner}" height="${inner}" fill="${bg === 'none' ? '#ffffff' : bg}" />`;
    }

    // Ball
    const bx = eyeX + 2 * moduleSize;
    const by = eyeY + 2 * moduleSize;
    if (config.eyeBallStyle === 'circle') {
      paths += `<circle cx="${bx + ball / 2}" cy="${by + ball / 2}" r="${ball / 2}" fill="${eyeCol}" />`;
    } else {
      paths += `<rect x="${bx}" y="${by}" width="${ball}" height="${ball}" fill="${eyeCol}" />`;
    }
  }

  svgContent += paths + `</svg>`;
  return svgContent;
}
