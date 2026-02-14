#!/bin/bash
# AllSquared Deployment Script
# Run from: ~/repos/allsquared
# Prerequisites: Auth system swapped to Clerk, ENV vars configured in Vercel

set -e

REPO_DIR="$HOME/repos/allsquared"
PROJECT_NAME="allsquared"
TEAM="nakamoto-labs"

echo "🚀 AllSquared Deployment Script"
echo "================================"
echo ""

# Check we're in the right directory
if [ ! -f "$REPO_DIR/package.json" ]; then
    echo "❌ Error: Not in allsquared repo directory"
    echo "   Expected: $REPO_DIR"
    exit 1
fi

cd "$REPO_DIR"

# Check Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Error: Vercel CLI not installed"
    echo "   Install: npm i -g vercel"
    exit 1
fi

# Check logged in
VERCEL_USER=$(vercel whoami 2>/dev/null || echo "")
if [ -z "$VERCEL_USER" ]; then
    echo "❌ Error: Not logged in to Vercel"
    echo "   Run: vercel login"
    exit 1
fi
echo "✅ Logged in as: $VERCEL_USER"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Type check
echo ""
echo "🔍 Running type check..."
pnpm check || {
    echo "⚠️  TypeScript errors found. Continue anyway? (y/n)"
    read -r response
    if [ "$response" != "y" ]; then
        exit 1
    fi
}

# Build locally first to catch errors
echo ""
echo "🔨 Building locally..."
pnpm build

echo ""
echo "✅ Local build successful!"
echo ""

# Deploy options
echo "Deploy options:"
echo "  1) Production deploy (--prod)"
echo "  2) Preview deploy"
echo "  3) Just push to git (auto-deploy)"
echo "  4) Exit"
echo ""
read -p "Choose option [1-4]: " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to production..."
        vercel --prod --team "$TEAM"
        ;;
    2)
        echo ""
        echo "🔄 Creating preview deployment..."
        vercel --team "$TEAM"
        ;;
    3)
        echo ""
        echo "📤 Pushing to git..."
        git add -A
        git commit -m "deploy: $(date +%Y-%m-%d)" --allow-empty
        git push origin main
        echo "✅ Pushed. Vercel will auto-deploy."
        ;;
    4)
        echo "👋 Exiting"
        exit 0
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "================================"
echo "🎉 Deployment initiated!"
echo ""
echo "Next steps:"
echo "  1. Check Vercel dashboard for build status"
echo "  2. Run database migrations: pnpm db:push"
echo "  3. Test: https://allsquared.io (after DNS propagates)"
echo ""
