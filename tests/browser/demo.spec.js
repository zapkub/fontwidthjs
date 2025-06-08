import { test, expect } from '@playwright/test';

test.describe('FontWidth Demo', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo page
    await page.goto('/demo/demo-with-library.html');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should load demo page successfully', async ({ page }) => {
    // Check if page title is correct
    await expect(page).toHaveTitle(/FontWidth Library Demo/);
    
    // Check if main heading is visible
    await expect(page.locator('h1')).toContainText('FontWidth Library Demo');
    
    // Take screenshot of initial state
    await page.screenshot({ 
      path: 'tests/browser/screenshots/demo-initial.png',
      fullPage: true 
    });
  });

  test('should load font and enable calculator', async ({ page }) => {
    // Wait for font loading to complete
    await page.waitForTimeout(3000);
    
    // Check if font status shows success
    const fontStatus = page.locator('#font-status');
    await expect(fontStatus).toBeVisible();
    
    // Take screenshot of font loading state
    await page.screenshot({ 
      path: 'tests/browser/screenshots/font-loading-state.png',
      fullPage: true 
    });
    
    // Check if calculate button is enabled
    const calcButton = page.locator('#calc-button');
    await expect(calcButton).toBeEnabled();
  });

  test('should calculate font size for Thai text', async ({ page }) => {
    // Wait for font loading
    await page.waitForTimeout(3000);
    
    // Enter Thai text
    const textInput = page.locator('#text-input');
    await textInput.clear();
    await textInput.fill('สวัสดีครับ');
    
    // Set max width
    const maxWidthInput = page.locator('#max-width');
    await maxWidthInput.fill('300');
    
    // Take screenshot before calculation
    await page.screenshot({ 
      path: 'tests/browser/screenshots/before-calculation.png',
      fullPage: true 
    });
    
    // Click calculate button
    const calcButton = page.locator('#calc-button');
    await calcButton.click();
    
    // Wait for results to appear
    await page.waitForSelector('#results', { state: 'visible' });
    
    // Take screenshot of results
    await page.screenshot({ 
      path: 'tests/browser/screenshots/calculation-results.png',
      fullPage: true 
    });
    
    // Check if results are displayed
    const results = page.locator('#results');
    await expect(results).toBeVisible();
    
    // Check if font size result is shown
    const fontSizeResult = page.locator('#result-font-size');
    await expect(fontSizeResult).toContainText('px');
    
    // Check if preview text is visible
    const previewText = page.locator('#preview-text');
    await expect(previewText).toBeVisible();
    await expect(previewText).toContainText('สวัสดีครับ');
    
    // Take close-up screenshot of results section
    await results.screenshot({ 
      path: 'tests/browser/screenshots/results-closeup.png' 
    });
    
    // Take close-up screenshot of preview section
    await previewText.screenshot({ 
      path: 'tests/browser/screenshots/preview-closeup.png' 
    });
  });

  test('should test diverse Thai text examples with width verification', async ({ page }) => {
    // Wait for font loading
    await page.waitForTimeout(3000);
    
    // Test diverse Thai examples with different widths
    const examples = [
      { text: 'กรุงเทพมหานคร', maxWidth: 300, description: 'long-thai-place-name' },
      { text: 'เมื่อพรุ่งนี้', maxWidth: 250, description: 'temporal-expression' },
      { text: 'ฐานทัพบก', maxWidth: 200, description: 'military-base' },
      { text: 'ปฎิบัติการพิเศษ', maxWidth: 350, description: 'special-operation' },
      { text: 'Only ทางเดิน', maxWidth: 220, description: 'mixed-english-thai' },
      { text: 'ญี่ปุ่นและ pop', maxWidth: 280, description: 'japanese-and-pop' }
    ];
    
    for (let i = 0; i < examples.length; i++) {
      const example = examples[i];
      
      // Enter example text and width
      const textInput = page.locator('#text-input');
      await textInput.clear();
      await textInput.fill(example.text);
      
      const maxWidthInput = page.locator('#max-width');
      await maxWidthInput.fill(example.maxWidth.toString());
      
      // Calculate
      const calcButton = page.locator('#calc-button');
      await calcButton.click();
      
      // Wait for results
      await page.waitForSelector('#results', { state: 'visible' });
      
      // Get dimensions and verify fit
      const previewText = page.locator('#preview-text');
      const [textWidth, maxWidth, fontSize] = await Promise.all([
        previewText.evaluate(el => el.scrollWidth),
        previewText.evaluate(el => parseInt(getComputedStyle(el).maxWidth)),
        previewText.evaluate(el => getComputedStyle(el).fontSize)
      ]);
      
      console.log(`Example ${i + 1}: "${example.text}"`, {
        maxWidth: example.maxWidth,
        actualTextWidth: textWidth,
        fontSize,
        fitsWithin: textWidth <= maxWidth
      });
      
      // Take screenshot for this example
      await page.screenshot({ 
        path: `tests/browser/screenshots/thai-example-${i + 1}-${example.description}.png`,
        fullPage: true 
      });
      
      // Take close-up of preview
      await page.locator('.preview-container').screenshot({ 
        path: `tests/browser/screenshots/thai-preview-${i + 1}-${example.description}.png` 
      });
      
      // Verify preview text shows the example and fits properly
      await expect(previewText).toContainText(example.text);
      expect(textWidth).toBeLessThanOrEqual(maxWidth + 5); // Allow 5px tolerance for rendering
    }
  });

  test('should debug font rendering and width calculation in preview', async ({ page }) => {
    // Wait for font loading
    await page.waitForTimeout(3000);
    
    // Enter Thai text
    await page.locator('#text-input').fill('การคำนวณฟอนต์');
    await page.locator('#max-width').fill('250');
    
    // Calculate
    await page.locator('#calc-button').click();
    await page.waitForSelector('#results', { state: 'visible' });
    
    // Get computed styles and dimensions of preview elements
    const previewContainer = page.locator('.preview-container');
    const previewText = page.locator('#preview-text');
    
    const [fontSize, fontFamily, maxWidth, containerWidth, textWidth] = await Promise.all([
      previewText.evaluate(el => getComputedStyle(el).fontSize),
      previewText.evaluate(el => getComputedStyle(el).fontFamily),
      previewText.evaluate(el => getComputedStyle(el).maxWidth),
      previewContainer.evaluate(el => el.offsetWidth),
      previewText.evaluate(el => el.scrollWidth)
    ]);
    
    console.log('Preview dimensions:', { 
      fontSize, 
      fontFamily, 
      maxWidth,
      containerWidth,
      textWidth,
      fitsInContainer: textWidth <= parseInt(maxWidth)
    });
    
    // Take detailed screenshot of preview area
    await page.locator('.preview-container').screenshot({ 
      path: 'tests/browser/screenshots/preview-debug.png' 
    });
    
    // Check if font is properly loaded
    const hasProperFont = fontFamily.includes('NotoSansThaiLoaded') || fontFamily.includes('NotoSerifThaiLoaded');
    console.log('Has proper loaded font:', hasProperFont);
    
    // Get text content and check if it matches input
    const textContent = await previewText.textContent();
    console.log('Preview text content:', textContent);
    
    // Verify text fits within calculated constraints
    expect(textContent).toBe('การคำนวณฟอนต์');
    expect(hasProperFont).toBe(true);
  });
});