#!/usr/bin/env node
/**
 * Simple development server for FontWidth demo
 * Serves files with proper CORS headers for font loading
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;
const ROOT_DIR = path.join(__dirname, '..');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.mjs': 'application/javascript',
    '.json': 'application/json',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html for root
    if (pathname === '/') {
        pathname = '/demo/index.html';
    }
    
    // Construct file path
    const filePath = path.join(ROOT_DIR, pathname);
    const ext = path.extname(filePath).toLowerCase();
    
    // Security check - ensure we're not serving files outside our directory
    if (!filePath.startsWith(ROOT_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Try to serve index.html from demo directory for SPA-like behavior
            if (pathname.startsWith('/demo/') && !ext) {
                const indexPath = path.join(ROOT_DIR, 'demo', 'index.html');
                serveFile(indexPath, '.html', res);
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
            }
            return;
        }
        
        // Check if it's a directory
        fs.stat(filePath, (err, stats) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server error');
                return;
            }
            
            if (stats.isDirectory()) {
                // Try to serve index.html from the directory
                const indexPath = path.join(filePath, 'index.html');
                fs.access(indexPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        // Serve directory listing
                        serveDirectoryListing(filePath, pathname, res);
                    } else {
                        serveFile(indexPath, '.html', res);
                    }
                });
            } else {
                // Serve the file
                serveFile(filePath, ext, res);
            }
        });
    });
});

function serveFile(filePath, ext, res) {
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
    
    // Set CORS headers for all requests
    const headers = {
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'no-cache'
    };
    
    // Special handling for font files
    if (ext.match(/\.(ttf|otf|woff|woff2)$/)) {
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Cache-Control'] = 'public, max-age=31536000'; // Cache fonts for 1 year
    }
    
    // Special handling for JavaScript modules
    if (ext === '.mjs' || filePath.includes('index.esm.js')) {
        headers['Content-Type'] = 'application/javascript';
    }
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
            return;
        }
        
        res.writeHead(200, headers);
        res.end(data);
    });
}

function serveDirectoryListing(dirPath, urlPath, res) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading directory');
            return;
        }
        
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Directory Listing: ${urlPath}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #333; }
        a { display: block; padding: 8px; text-decoration: none; color: #0066cc; }
        a:hover { background: #f0f0f0; }
        .parent { color: #666; }
    </style>
</head>
<body>
    <h1>Directory Listing: ${urlPath}</h1>
    ${urlPath !== '/' ? `<a href="../" class="parent">← Parent Directory</a>` : ''}
    ${files.map(file => `<a href="${path.join(urlPath, file)}">${file}</a>`).join('')}
</body>
</html>`;
        
        res.writeHead(200, { 
            'Content-Type': 'text/html',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(html);
    });
}

server.listen(PORT, () => {
    console.log(`🚀 FontWidth Demo Server running at:`);
    console.log(`   Local:   http://localhost:${PORT}/`);
    console.log(`   Demo:    http://localhost:${PORT}/demo/`);
    console.log(`   Library: http://localhost:${PORT}/demo/demo-with-library.html`);
    console.log(`\n📁 Serving files from: ${ROOT_DIR}`);
    console.log(`\n🔤 Available demos:`);
    console.log(`   • Mock Demo:  http://localhost:${PORT}/demo/index.html`);
    console.log(`   • Real Demo:  http://localhost:${PORT}/demo/demo-with-library.html`);
    console.log(`\nPress Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n👋 Received SIGTERM, shutting down...');
    server.close(() => {
        process.exit(0);
    });
});