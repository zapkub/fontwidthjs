# Test info

- Name: FontWidth Demo >> should test diverse Thai text examples with width verification
- Location: /Users/rungsikorn/Repositories/fontwidth/tests/browser/demo.spec.js:101:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8000/demo/demo-with-library.html
Call log:
  - navigating to "http://localhost:8000/demo/demo-with-library.html", waiting until "load"

    at /Users/rungsikorn/Repositories/fontwidth/tests/browser/demo.spec.js:6:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('FontWidth Demo', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Navigate to the demo page
>  6 |     await page.goto('/demo/demo-with-library.html');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:8000/demo/demo-with-library.html
   7 |     
   8 |     // Wait for page to load
   9 |     await page.waitForLoadState('networkidle');
   10 |   });
   11 |
   12 |   test('should load demo page successfully', async ({ page }) => {
   13 |     // Check if page title is correct
   14 |     await expect(page).toHaveTitle(/FontWidth Library Demo/);
   15 |     
   16 |     // Check if main heading is visible
   17 |     await expect(page.locator('h1')).toContainText('FontWidth Library Demo');
   18 |     
   19 |     // Take screenshot of initial state
   20 |     await page.screenshot({ 
   21 |       path: 'tests/browser/screenshots/demo-initial.png',
   22 |       fullPage: true 
   23 |     });
   24 |   });
   25 |
   26 |   test('should load font and enable calculator', async ({ page }) => {
   27 |     // Wait for font loading to complete
   28 |     await page.waitForTimeout(3000);
   29 |     
   30 |     // Check if font status shows success
   31 |     const fontStatus = page.locator('#font-status');
   32 |     await expect(fontStatus).toBeVisible();
   33 |     
   34 |     // Take screenshot of font loading state
   35 |     await page.screenshot({ 
   36 |       path: 'tests/browser/screenshots/font-loading-state.png',
   37 |       fullPage: true 
   38 |     });
   39 |     
   40 |     // Check if calculate button is enabled
   41 |     const calcButton = page.locator('#calc-button');
   42 |     await expect(calcButton).toBeEnabled();
   43 |   });
   44 |
   45 |   test('should calculate font size for Thai text', async ({ page }) => {
   46 |     // Wait for font loading
   47 |     await page.waitForTimeout(3000);
   48 |     
   49 |     // Enter Thai text
   50 |     const textInput = page.locator('#text-input');
   51 |     await textInput.clear();
   52 |     await textInput.fill('สวัสดีครับ');
   53 |     
   54 |     // Set max width
   55 |     const maxWidthInput = page.locator('#max-width');
   56 |     await maxWidthInput.fill('300');
   57 |     
   58 |     // Take screenshot before calculation
   59 |     await page.screenshot({ 
   60 |       path: 'tests/browser/screenshots/before-calculation.png',
   61 |       fullPage: true 
   62 |     });
   63 |     
   64 |     // Click calculate button
   65 |     const calcButton = page.locator('#calc-button');
   66 |     await calcButton.click();
   67 |     
   68 |     // Wait for results to appear
   69 |     await page.waitForSelector('#results', { state: 'visible' });
   70 |     
   71 |     // Take screenshot of results
   72 |     await page.screenshot({ 
   73 |       path: 'tests/browser/screenshots/calculation-results.png',
   74 |       fullPage: true 
   75 |     });
   76 |     
   77 |     // Check if results are displayed
   78 |     const results = page.locator('#results');
   79 |     await expect(results).toBeVisible();
   80 |     
   81 |     // Check if font size result is shown
   82 |     const fontSizeResult = page.locator('#result-font-size');
   83 |     await expect(fontSizeResult).toContainText('px');
   84 |     
   85 |     // Check if preview text is visible
   86 |     const previewText = page.locator('#preview-text');
   87 |     await expect(previewText).toBeVisible();
   88 |     await expect(previewText).toContainText('สวัสดีครับ');
   89 |     
   90 |     // Take close-up screenshot of results section
   91 |     await results.screenshot({ 
   92 |       path: 'tests/browser/screenshots/results-closeup.png' 
   93 |     });
   94 |     
   95 |     // Take close-up screenshot of preview section
   96 |     await previewText.screenshot({ 
   97 |       path: 'tests/browser/screenshots/preview-closeup.png' 
   98 |     });
   99 |   });
  100 |
  101 |   test('should test diverse Thai text examples with width verification', async ({ page }) => {
  102 |     // Wait for font loading
  103 |     await page.waitForTimeout(3000);
  104 |     
  105 |     // Test diverse Thai examples with different widths
  106 |     const examples = [
```