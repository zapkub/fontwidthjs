const { calculateFontSize, helloWorld } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

// Backward compatibility tests
test('helloWorld returns correct greeting', () => {
  const result = helloWorld();
  expect(result).toBe('Hello World from fontwidth!');
});

test('helloWorld returns a string', () => {
  const result = helloWorld();
  expect(typeof result).toBe('string');
});

// Main functionality tests
describe('calculateFontSize function', () => {
  const fontsDir = path.join(__dirname, 'fixtures', 'fonts');
  let notoSansThaiBuffer;
  let notoSerifThaiBuffer;

  beforeAll(() => {
    // Load font files for testing
    notoSansThaiBuffer = fs.readFileSync(path.join(fontsDir, 'NotoSansThai-Regular.ttf'));
    notoSerifThaiBuffer = fs.readFileSync(path.join(fontsDir, 'NotoSerifThai-Regular.ttf'));
  });

  test('calculates font size for English text', () => {
    const result = calculateFontSize('Hello World', 200, notoSansThaiBuffer);
    
    expect(result).toHaveProperty('fontSize');
    expect(result).toHaveProperty('actualWidth');
    expect(result).toHaveProperty('maxWidth', 200);
    expect(result.fontSize).toBeGreaterThan(0);
    expect(result.actualWidth).toBeLessThanOrEqual(200);
  });

  test('calculates font size for Thai text', () => {
    const thaiText = 'สวัสดีครับ'; // "Hello" in Thai
    const result = calculateFontSize(thaiText, 150, notoSansThaiBuffer);
    
    expect(result).toHaveProperty('fontSize');
    expect(result).toHaveProperty('actualWidth');
    expect(result).toHaveProperty('maxWidth', 150);
    expect(result.fontSize).toBeGreaterThan(0);
    expect(result.actualWidth).toBeLessThanOrEqual(150);
  });

  test('handles Thai text with combining marks', () => {
    const thaiTextWithMarks = 'เก่า'; // Thai text with tone mark
    const result = calculateFontSize(thaiTextWithMarks, 100, notoSansThaiBuffer);
    
    expect(result.fontSize).toBeGreaterThan(0);
    expect(result.actualWidth).toBeLessThanOrEqual(100);
  });

  test('works with different font weights', () => {
    const boldFontBuffer = fs.readFileSync(path.join(fontsDir, 'NotoSansThai-Bold.ttf'));
    const result = calculateFontSize('Test', 100, boldFontBuffer);
    
    expect(result.fontSize).toBeGreaterThan(0);
    expect(result.actualWidth).toBeLessThanOrEqual(100);
  });

  test('respects minimum and maximum font size options', () => {
    const result = calculateFontSize('Very long text that should not fit', 50, notoSansThaiBuffer, {
      minFontSize: 10,
      maxFontSize: 12
    });
    
    expect(result.fontSize).toBeGreaterThanOrEqual(10);
    expect(result.fontSize).toBeLessThanOrEqual(12);
  });

  test('handles empty text', () => {
    const result = calculateFontSize('', 100, notoSansThaiBuffer);
    
    expect(result.actualWidth).toBe(0);
    expect(result.fontSize).toBeGreaterThan(0);
  });

  test('throws error for invalid font', () => {
    const invalidFont = Buffer.from('invalid font data');
    
    expect(() => {
      calculateFontSize('Test', 100, invalidFont);
    }).toThrow();
  });
});

describe('Thai font fixtures', () => {
  const fontsDir = path.join(__dirname, 'fixtures', 'fonts');
  
  test('font fixtures directory exists', () => {
    expect(fs.existsSync(fontsDir)).toBe(true);
  });

  test('Noto Sans Thai Regular font file exists', () => {
    const fontPath = path.join(fontsDir, 'NotoSansThai-Regular.ttf');
    expect(fs.existsSync(fontPath)).toBe(true);
    expect(fs.statSync(fontPath).size).toBeGreaterThan(0);
  });

  test('Noto Sans Thai Light font file exists', () => {
    const fontPath = path.join(fontsDir, 'NotoSansThai-Light.ttf');
    expect(fs.existsSync(fontPath)).toBe(true);
    expect(fs.statSync(fontPath).size).toBeGreaterThan(0);
  });

  test('Noto Sans Thai Bold font file exists', () => {
    const fontPath = path.join(fontsDir, 'NotoSansThai-Bold.ttf');
    expect(fs.existsSync(fontPath)).toBe(true);
    expect(fs.statSync(fontPath).size).toBeGreaterThan(0);
  });

  test('Noto Serif Thai Regular font file exists', () => {
    const fontPath = path.join(fontsDir, 'NotoSerifThai-Regular.ttf');
    expect(fs.existsSync(fontPath)).toBe(true);
    expect(fs.statSync(fontPath).size).toBeGreaterThan(0);
  });

  test('Noto Serif Thai Bold font file exists', () => {
    const fontPath = path.join(fontsDir, 'NotoSerifThai-Bold.ttf');
    expect(fs.existsSync(fontPath)).toBe(true);
    expect(fs.statSync(fontPath).size).toBeGreaterThan(0);
  });
});