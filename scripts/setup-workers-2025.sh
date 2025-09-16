#!/bin/bash
set -e

# Cloudflare Workers 2025 Setup Script
# This script initializes KV namespaces and D1 databases for the modernized deployment

echo "🚀 Setting up Cloudflare Workers 2025 infrastructure..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}❌ Wrangler CLI is not installed. Install it with: npm install -g wrangler${NC}"
    exit 1
fi

# Check if logged in
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare. Please run: wrangler login${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Wrangler CLI is ready${NC}"

# Function to create KV namespace
create_kv() {
    local name=$1
    local env_prefix=$2

    echo -e "${BLUE}📦 Creating KV namespace: $name${NC}"

    # Create production namespace
    PROD_ID=$(wrangler kv:namespace create "$name" --preview false 2>/dev/null | grep -o 'id = "[^"]*"' | sed 's/id = "//' | sed 's/"//')

    # Create preview namespace
    PREVIEW_ID=$(wrangler kv:namespace create "$name" --preview true 2>/dev/null | grep -o 'id = "[^"]*"' | sed 's/id = "//' | sed 's/"//')

    # Create staging namespace
    STAGING_ID=$(wrangler kv:namespace create "$name-staging" --preview false 2>/dev/null | grep -o 'id = "[^"]*"' | sed 's/id = "//' | sed 's/"//')

    echo "  Production ID: $PROD_ID"
    echo "  Staging ID: $STAGING_ID"
    echo "  Preview ID: $PREVIEW_ID"

    # Store in variables for replacement
    eval "${env_prefix}_PROD_ID=$PROD_ID"
    eval "${env_prefix}_STAGING_ID=$STAGING_ID"
    eval "${env_prefix}_PREVIEW_ID=$PREVIEW_ID"
}

# Function to create D1 database
create_d1() {
    local name=$1
    local env_prefix=$2

    echo -e "${BLUE}🗄️  Creating D1 database: $name${NC}"

    # Create production database
    PROD_ID=$(wrangler d1 create "$name" 2>/dev/null | grep -o 'database_id = "[^"]*"' | sed 's/database_id = "//' | sed 's/"//')

    # Create staging database
    STAGING_ID=$(wrangler d1 create "$name-staging" 2>/dev/null | grep -o 'database_id = "[^"]*"' | sed 's/database_id = "//' | sed 's/"//')

    # Create preview database
    PREVIEW_ID=$(wrangler d1 create "$name-preview" 2>/dev/null | grep -o 'database_id = "[^"]*"' | sed 's/database_id = "//' | sed 's/"//')

    echo "  Production ID: $PROD_ID"
    echo "  Staging ID: $STAGING_ID"
    echo "  Preview ID: $PREVIEW_ID"

    # Store in variables for replacement
    eval "${env_prefix}_PROD_ID=$PROD_ID"
    eval "${env_prefix}_STAGING_ID=$STAGING_ID"
    eval "${env_prefix}_PREVIEW_ID=$PREVIEW_ID"
}

echo -e "${YELLOW}📋 Creating KV namespaces...${NC}"

# Create KV namespaces
create_kv "rafters-intel" "INTEL_KV"
create_kv "rafters-cache" "CACHE_KV"
create_kv "design-tokens" "TOKENS_KV"
create_kv "component-registry" "REGISTRY_KV"

echo -e "${YELLOW}📋 Creating D1 databases...${NC}"

# Create D1 databases
create_d1 "rafters-design" "DESIGN_D1"
create_d1 "rafters-colors" "COLORS_D1"

echo -e "${YELLOW}🔧 Updating wrangler.jsonc files...${NC}"

# Update website wrangler.jsonc
sed -i.bak \
    -e "s/YOUR_PRODUCTION_KV_ID/$INTEL_KV_PROD_ID/g" \
    -e "s/YOUR_STAGING_KV_ID/$INTEL_KV_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_KV_ID/$INTEL_KV_PREVIEW_ID/g" \
    -e "s/YOUR_PRODUCTION_TOKENS_KV_ID/$TOKENS_KV_PROD_ID/g" \
    -e "s/YOUR_STAGING_TOKENS_KV_ID/$TOKENS_KV_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_TOKENS_KV_ID/$TOKENS_KV_PREVIEW_ID/g" \
    -e "s/YOUR_PRODUCTION_REGISTRY_KV_ID/$REGISTRY_KV_PROD_ID/g" \
    -e "s/YOUR_STAGING_REGISTRY_KV_ID/$REGISTRY_KV_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_REGISTRY_KV_ID/$REGISTRY_KV_PREVIEW_ID/g" \
    -e "s/YOUR_PRODUCTION_D1_ID/$DESIGN_D1_PROD_ID/g" \
    -e "s/YOUR_STAGING_D1_ID/$DESIGN_D1_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_D1_ID/$DESIGN_D1_PREVIEW_ID/g" \
    apps/website/wrangler.jsonc

# Update API wrangler.jsonc
sed -i.bak \
    -e "s/YOUR_PRODUCTION_KV_ID/$INTEL_KV_PROD_ID/g" \
    -e "s/YOUR_STAGING_KV_ID/$INTEL_KV_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_KV_ID/$INTEL_KV_PREVIEW_ID/g" \
    -e "s/YOUR_PRODUCTION_CACHE_KV_ID/$CACHE_KV_PROD_ID/g" \
    -e "s/YOUR_STAGING_CACHE_KV_ID/$CACHE_KV_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_CACHE_KV_ID/$CACHE_KV_PREVIEW_ID/g" \
    -e "s/YOUR_PRODUCTION_D1_ID/$DESIGN_D1_PROD_ID/g" \
    -e "s/YOUR_STAGING_D1_ID/$DESIGN_D1_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_D1_ID/$DESIGN_D1_PREVIEW_ID/g" \
    -e "s/YOUR_PRODUCTION_COLORS_D1_ID/$COLORS_D1_PROD_ID/g" \
    -e "s/YOUR_STAGING_COLORS_D1_ID/$COLORS_D1_STAGING_ID/g" \
    -e "s/YOUR_PREVIEW_COLORS_D1_ID/$COLORS_D1_PREVIEW_ID/g" \
    apps/api/wrangler.jsonc

# Clean up backup files
rm -f apps/website/wrangler.jsonc.bak apps/api/wrangler.jsonc.bak

echo -e "${GREEN}✅ Cloudflare Workers 2025 setup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Summary:${NC}"
echo "• KV Namespaces: 4 created (intel, cache, tokens, registry)"
echo "• D1 Databases: 2 created (design, colors)"
echo "• Environments: production, staging, preview"
echo "• Configuration files updated with real IDs"
echo ""
echo -e "${YELLOW}🚀 Next steps:${NC}"
echo "1. Set up your Cloudflare API token in GitHub secrets: CLOUDFLARE_API_TOKEN"
echo "2. Set up your account ID in GitHub secrets: CLOUDFLARE_ACCOUNT_ID"
echo "3. Set up API keys in GitHub secrets: CLAUDE_API_KEY, OPENAI_API_KEY"
echo "4. Test local deployment: cd apps/website && pnpm dev"
echo "5. Deploy to staging: pnpm deploy:staging"
echo ""
echo -e "${GREEN}🎉 Ready for Workers 2025 deployment!${NC}"