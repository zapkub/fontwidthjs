import * as opentype from 'opentype.js';

/**
 * Font input type - can be Buffer, ArrayBuffer, or base64 string
 */
export type FontInput = Buffer | ArrayBuffer | string;

/**
 * Options for calculating font size
 */
export interface CalculateFontSizeOptions {
  minFontSize?: number;
  maxFontSize?: number;
  precision?: number;
}

/**
 * Result of font size calculation
 */
export interface FontSizeResult {
  fontSize: number;
  actualWidth: number;
  maxWidth: number;
}

/**
 * Calculate the optimal font size to fit text within maximum width
 *
 * @param text - The text string to measure
 * @param maxWidth - Maximum width in pixels
 * @param fontInput - Font file as Buffer, ArrayBuffer, or base64 string
 * @param options - Optional configuration
 * @returns Font size result object
 */
export function calculateFontSize(
  text: string,
  maxWidth: number,
  fontInput: FontInput,
  options: CalculateFontSizeOptions = {}
): FontSizeResult {
  const { minFontSize = 8, maxFontSize = 200, precision = 0.1 } = options;

  // Parse font from input
  const font = parseFontInput(fontInput);

  // Binary search for optimal font size
  let low = minFontSize;
  let high = maxFontSize;
  let bestFontSize = minFontSize;
  let bestWidth = 0;

  while (high - low > precision) {
    const mid = (low + high) / 2;
    const width = calculateTextWidth(text, font, mid);

    if (width <= maxWidth) {
      bestFontSize = mid;
      bestWidth = width;
      low = mid;
    } else {
      high = mid;
    }
  }

  return {
    fontSize: Math.round(bestFontSize * 10) / 10, // Round to 1 decimal place
    actualWidth: bestWidth,
    maxWidth,
  };
}

/**
 * Parse font input into opentype.js Font object
 */
function parseFontInput(fontInput: FontInput): opentype.Font {
  let buffer: ArrayBuffer;

  if (typeof fontInput === 'string') {
    // Handle base64 string
    const base64Data = fontInput.replace(/^data:.*,/, '');
    const binaryString = atob(base64Data);
    buffer = new ArrayBuffer(binaryString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < binaryString.length; i++) {
      view[i] = binaryString.charCodeAt(i);
    }
  } else if (fontInput && 'buffer' in fontInput) {
    // Handle Node.js Buffer
    const bufferInput = fontInput as Buffer;
    buffer = bufferInput.buffer.slice(
      bufferInput.byteOffset,
      bufferInput.byteOffset + bufferInput.byteLength
    );
  } else {
    // Handle ArrayBuffer
    buffer = fontInput;
  }

  const font = opentype.parse(buffer);
  if (!font.supported) {
    throw new Error('Unsupported font format');
  }

  return font;
}

/**
 * Calculate the width of text at a given font size
 */
function calculateTextWidth(
  text: string,
  font: opentype.Font,
  fontSize: number
): number {
  let totalWidth = 0;
  const scale = (1 / font.unitsPerEm) * fontSize;

  // Handle Thai text with proper Unicode normalization
  const normalizedText = normalizeThaiText(text);

  for (let i = 0; i < normalizedText.length; i++) {
    const char = normalizedText[i];
    const glyph = font.charToGlyph(char);

    if (glyph) {
      // Get advance width for the glyph
      const advanceWidth = glyph.advanceWidth || 0;
      totalWidth += advanceWidth * scale;

      // Apply kerning if available and not the last character
      if (i < normalizedText.length - 1) {
        const nextChar = normalizedText[i + 1];
        const nextGlyph = font.charToGlyph(nextChar);
        if (nextGlyph) {
          const kerning = font.getKerningValue(glyph, nextGlyph);
          totalWidth += kerning * scale;
        }
      }
    }
  }

  return totalWidth;
}

/**
 * Normalize Thai text for proper rendering
 * Handles combining marks and ligatures
 */
function normalizeThaiText(text: string): string {
  // Normalize Unicode to NFD (Normalization Form Decomposed)
  // This separates base characters from combining marks
  return text.normalize('NFD');
}

// Export for backward compatibility and testing
export function helloWorld(): string {
  return 'Hello World from fontwidth!';
}

export default calculateFontSize;
