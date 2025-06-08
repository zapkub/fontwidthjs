const { calculateFontSize } = require('../dist/index.js');
const fs = require('fs');
const path = require('path');

// Example: Calculate optimal font size for Thai text
async function demonstrateLibrary() {
  try {
    // Load a Thai font
    const fontPath = path.join(
      __dirname,
      '../tests/fixtures/fonts/NotoSansThai-Regular.ttf'
    );
    const fontBuffer = fs.readFileSync(fontPath);

    console.log('🚀 FontWidth Library Demo\n');

    // Example 1: English text
    console.log('📝 Example 1: English Text');
    const englishResult = calculateFontSize('Hello World!', 200, fontBuffer);
    console.log(`Text: "Hello World!"`);
    console.log(`Max Width: 200px`);
    console.log(`Optimal Font Size: ${englishResult.fontSize}px`);
    console.log(`Actual Width: ${englishResult.actualWidth.toFixed(2)}px\n`);

    // Example 2: Thai text
    console.log('📝 Example 2: Thai Text');
    const thaiResult = calculateFontSize('สวัสดีครับ', 150, fontBuffer);
    console.log(`Text: "สวัสดีครับ" (Hello in Thai)`);
    console.log(`Max Width: 150px`);
    console.log(`Optimal Font Size: ${thaiResult.fontSize}px`);
    console.log(`Actual Width: ${thaiResult.actualWidth.toFixed(2)}px\n`);

    // Example 3: Thai text with combining marks
    console.log('📝 Example 3: Thai Text with Tone Marks');
    const marksResult = calculateFontSize('เก่าใหม่', 120, fontBuffer);
    console.log(`Text: "เก่าใหม่" (old-new with tone marks)`);
    console.log(`Max Width: 120px`);
    console.log(`Optimal Font Size: ${marksResult.fontSize}px`);
    console.log(`Actual Width: ${marksResult.actualWidth.toFixed(2)}px\n`);

    // Example 4: Mixed text
    console.log('📝 Example 4: Mixed Thai-English Text');
    const mixedResult = calculateFontSize(
      'Hello สวัสดี World!',
      250,
      fontBuffer
    );
    console.log(`Text: "Hello สวัสดี World!"`);
    console.log(`Max Width: 250px`);
    console.log(`Optimal Font Size: ${mixedResult.fontSize}px`);
    console.log(`Actual Width: ${mixedResult.actualWidth.toFixed(2)}px\n`);

    // Example 5: With custom options
    console.log('📝 Example 5: Custom Font Size Range');
    const customResult = calculateFontSize('การออกแบบ', 100, fontBuffer, {
      minFontSize: 12,
      maxFontSize: 24,
      precision: 0.5,
    });
    console.log(`Text: "การออกแบบ" (design)`);
    console.log(`Max Width: 100px`);
    console.log(`Font Size Range: 12-24px`);
    console.log(`Optimal Font Size: ${customResult.fontSize}px`);
    console.log(`Actual Width: ${customResult.actualWidth.toFixed(2)}px\n`);

    console.log('✅ Demo completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the demo
if (require.main === module) {
  demonstrateLibrary();
}

module.exports = { demonstrateLibrary };
