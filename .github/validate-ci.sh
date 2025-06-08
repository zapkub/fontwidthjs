#!/bin/bash

# Local CI validation script
# Run this to simulate CI checks locally

set -e

echo "🚀 Running local CI validation..."

echo "📋 Step 1: Installing dependencies..."
yarn install --frozen-lockfile

echo "🔍 Step 2: Type checking..."
yarn typecheck

echo "🧹 Step 3: Linting code..."
yarn lint

echo "💅 Step 4: Checking formatting..."
yarn format:check

echo "🧪 Step 5: Running unit tests..."
yarn test

echo "🏗️ Step 6: Building library..."
yarn build

echo "✅ Step 7: Verifying build outputs..."
test -f dist/index.cjs.js || (echo "❌ Missing CommonJS build" && exit 1)
test -f dist/index.esm.js || (echo "❌ Missing ESM build" && exit 1)
test -f dist/index.d.ts || (echo "❌ Missing TypeScript declarations" && exit 1)

echo "🌐 Step 8: Installing Playwright (if needed)..."
if ! npx playwright --version > /dev/null 2>&1; then
    npx playwright install --with-deps chromium
fi

echo "🎭 Step 9: Running browser tests..."
yarn test:browser

echo ""
echo "🎉 All CI checks passed! Your code is ready to push."
echo ""
echo "To push to GitHub and trigger CI:"
echo "  git add ."
echo "  git commit -m 'your commit message'"
echo "  git push"