const { calculateFontSize } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

describe('Thai Language Examples', () => {
  const fontsDir = path.join(__dirname, 'fixtures', 'fonts');
  let notoSansThaiBuffer;
  let notoSerifThaiBuffer;

  beforeAll(() => {
    notoSansThaiBuffer = fs.readFileSync(
      path.join(fontsDir, 'NotoSansThai-Regular.ttf')
    );
    notoSerifThaiBuffer = fs.readFileSync(
      path.join(fontsDir, 'NotoSerifThai-Regular.ttf')
    );
  });

  test('handles common Thai greetings', () => {
    const greetings = [
      'สวัสดี', // Hello
      'สวัสดีครับ', // Hello (male)
      'สวัสดีค่ะ', // Hello (female)
      'ยินดีที่ได้รู้จัก', // Nice to meet you
    ];

    greetings.forEach(greeting => {
      const result = calculateFontSize(greeting, 200, notoSansThaiBuffer);
      expect(result.fontSize).toBeGreaterThan(0);
      expect(result.actualWidth).toBeLessThanOrEqual(200);
      expect(result.actualWidth).toBeGreaterThan(0);
    });
  });

  test('handles Thai text with various combining marks', () => {
    const textsWithMarks = [
      'เก่า', // old (with tone mark)
      'ใหม่', // new (with tone mark)
      'คิด', // think
      'ดู', // see/watch
      'เรียน', // study/learn
      'ทำงาน', // work
    ];

    textsWithMarks.forEach(text => {
      const result = calculateFontSize(text, 150, notoSansThaiBuffer);
      expect(result.fontSize).toBeGreaterThan(0);
      expect(result.actualWidth).toBeLessThanOrEqual(150);
    });
  });

  test('compares Sans vs Serif fonts', () => {
    const text = 'การออกแบบ'; // design

    const sansResult = calculateFontSize(text, 200, notoSansThaiBuffer);
    const serifResult = calculateFontSize(text, 200, notoSerifThaiBuffer);

    // Both should fit in the space
    expect(sansResult.actualWidth).toBeLessThanOrEqual(200);
    expect(serifResult.actualWidth).toBeLessThanOrEqual(200);

    // Font sizes might be different due to different metrics
    expect(sansResult.fontSize).toBeGreaterThan(0);
    expect(serifResult.fontSize).toBeGreaterThan(0);
  });

  test('handles mixed Thai and English text', () => {
    const mixedTexts = [
      'Hello สวัสดี',
      'TypeScript และ JavaScript',
      'Google Font ฟอนต์ไทย',
      'React.js กับ Vue.js',
    ];

    mixedTexts.forEach(text => {
      const result = calculateFontSize(text, 300, notoSansThaiBuffer);
      expect(result.fontSize).toBeGreaterThan(0);
      expect(result.actualWidth).toBeLessThanOrEqual(300);
    });
  });

  test('handles long Thai sentences', () => {
    const longText = 'ภาษาไทยเป็นภาษาที่มีความสวยงามและมีเอกลักษณ์เฉพาะตัว';

    const result = calculateFontSize(longText, 400, notoSansThaiBuffer);
    expect(result.fontSize).toBeGreaterThan(0);
    expect(result.actualWidth).toBeLessThanOrEqual(400);
    expect(result.actualWidth).toBeGreaterThan(300); // Should be fairly wide
  });

  test('calculates optimal font size for different constraints', () => {
    const text = 'การคำนวณ'; // calculation

    // Test different max widths
    const constraints = [100, 200, 300];
    const results = constraints.map(maxWidth =>
      calculateFontSize(text, maxWidth, notoSansThaiBuffer)
    );

    // Font size should increase with available width
    expect(results[1].fontSize).toBeGreaterThan(results[0].fontSize);
    expect(results[2].fontSize).toBeGreaterThan(results[1].fontSize);

    // All should fit within their constraints
    results.forEach((result, i) => {
      expect(result.actualWidth).toBeLessThanOrEqual(constraints[i]);
    });
  });
});
