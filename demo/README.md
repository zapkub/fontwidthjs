# FontWidth Library Demo

This directory contains interactive HTML demos showcasing the FontWidth library's capabilities for calculating optimal font sizes with Thai text support.

## Demo Files

### 1. `index.html` - Interactive Demo with Mock Implementation

- **Features**: Complete UI with mock font calculations
- **Usage**: Open directly in any modern browser
- **Benefits**: Works without server setup, great for UI/UX preview

### 2. `demo-with-library.html` - Real Implementation Demo

- **Features**: Uses actual FontWidth library with real Thai fonts
- **Usage**: Requires local server due to CORS restrictions
- **Benefits**: Demonstrates real library functionality

## Quick Start

### Option 1: Simple Demo (No Server Required)

```bash
# Open the mock demo directly in browser
open index.html
# or
firefox index.html
# or
chrome index.html
```

### Option 2: Full Demo with Real Library

```bash
# From the project root directory
cd fontwidth

# Option A: Using Python's built-in server
python3 -m http.server 8000

# Option B: Using Node.js serve package
npx serve .

# Option C: Using PHP built-in server
php -S localhost:8000

# Then open: http://localhost:8000/demo/demo-with-library.html
```

## Demo Features

### 🎯 Interactive Font Size Calculator

- Input any Thai or English text
- Set maximum width constraints
- Configure font size ranges and precision
- Real-time preview of calculated results

### 🇹🇭 Thai Language Examples

- Common greetings and phrases
- Text with tone marks and combining characters
- Mixed Thai-English content
- Technical terminology

### 📊 Real-time Results

- Optimal font size calculation
- Actual text width measurement
- Width efficiency percentage
- Live preview with proper font rendering

### 📁 Font Loading

- Upload custom TTF/OTF font files
- Quick-load demo Thai fonts (Noto Sans/Serif)
- Real-time font parsing and metrics extraction

## Thai Text Examples Included

| Text               | Description            | Features                            |
| ------------------ | ---------------------- | ----------------------------------- |
| สวัสดี             | Basic greeting         | Simple Thai characters              |
| สวัสดีครับ         | Polite greeting (male) | Particles and politeness markers    |
| เก่าใหม่           | Old-new                | Tone marks and combining characters |
| ยินดีที่ได้รู้จัก  | Nice to meet you       | Complex phrase structure            |
| Hello สวัสดี World | Mixed languages        | Thai-English combination            |
| การคำนวณฟอนต์      | Font calculation       | Technical terminology               |

## Technical Details

### Font Loading

- Supports TTF and OTF font formats
- Uses FileReader API for local file upload
- Fetches demo fonts from `/tests/fixtures/fonts/`
- Handles ArrayBuffer conversion for opentype.js

### Calculation Engine

- Binary search algorithm for optimal font size
- Real glyph metrics from font files
- Kerning support for accurate spacing
- Thai Unicode normalization (NFD)

### Browser Compatibility

- Modern browsers with ES6+ support
- File API for font uploads
- CSS custom properties for theming
- Responsive design for mobile/desktop

## Troubleshooting

### Common Issues

**1. "Font file not found" error**

- Ensure you're running a local server
- Check that font files exist in `/tests/fixtures/fonts/`
- Verify CORS settings if using custom server

**2. "FontWidth library not loaded" error**

- Make sure the library is built (`yarn build`)
- Check browser console for import errors
- Falls back to mock implementation automatically

**3. Calculation seems inaccurate**

- Verify font file is valid TTF/OTF format
- Check if text contains unsupported characters
- Try with different precision settings

### Development Setup

```bash
# Install dependencies and build library
yarn install
yarn build

# Run tests to verify functionality
yarn test

# Start demo server
npx serve . --port 8000

# Open demo
open http://localhost:8000/demo/demo-with-library.html
```

## Deployment

### Static Hosting

1. Build the library: `yarn build`
2. Copy entire project to static host
3. Configure server to serve font files with proper MIME types
4. Update font paths in demo if needed

### CDN Integration

```html
<!-- Include from CDN (when published) -->
<script type="module">
  import { calculateFontSize } from 'https://cdn.jsdelivr.net/npm/fontwidth@latest';
  // Use library...
</script>
```

## Contributing

To improve the demo:

1. Test with various Thai fonts
2. Add more example texts
3. Enhance UI/UX
4. Add performance metrics
5. Include error handling improvements

## License

Same as FontWidth library - MIT License
