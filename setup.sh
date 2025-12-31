#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get app name from argument or prompt
if [ -n "$1" ]; then
  APP_NAME="$1"
else
  echo -e "${BLUE}Enter your app name (lowercase, use hyphens):${NC}"
  read -r APP_NAME
fi

# Validate app name (lowercase, hyphens, no spaces)
if [[ ! "$APP_NAME" =~ ^[a-z0-9-]+$ ]]; then
  echo -e "${RED}Error: App name must be lowercase letters, numbers, and hyphens only${NC}"
  exit 1
fi

echo -e "${GREEN}Setting up project: ${APP_NAME}${NC}"
echo ""

# Replace in wrangler.jsonc
echo -e "${YELLOW}Updating wrangler.jsonc...${NC}"
sed -i.tmp "s/\"name\": \"nvoi\"/\"name\": \"${APP_NAME}\"/g" wrangler.jsonc
sed -i.tmp "s/nvoi_production/${APP_NAME}_production/g" wrangler.jsonc
sed -i.tmp "s/nvoi-jobs/${APP_NAME}-jobs/g" wrangler.jsonc
sed -i.tmp "s/nvoi\.to/${APP_NAME}.com/g" wrangler.jsonc
sed -i.tmp "s/\*\.nvoi\.to/\*.${APP_NAME}.com/g" wrangler.jsonc
rm wrangler.jsonc.tmp

# Replace in package.json
echo -e "${YELLOW}Updating package.json...${NC}"
sed -i.tmp "s/\"name\": \"nvoi\"/\"name\": \"${APP_NAME}\"/g" package.json
sed -i.tmp "s/nvoi_development/${APP_NAME}_development/g" package.json
sed -i.tmp "s/nvoi_production/${APP_NAME}_production/g" package.json
rm package.json.tmp

echo ""
echo -e "${GREEN}✓ Configuration updated!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo ""
echo "1. Create D1 databases:"
echo -e "   ${YELLOW}wrangler d1 create ${APP_NAME}_production${NC}"
echo -e "   ${YELLOW}wrangler d1 create ${APP_NAME}_development${NC}"
echo ""
echo "2. Copy the database IDs and update wrangler.jsonc"
echo ""
echo "3. Setup environment variables:"
echo -e "   ${YELLOW}cp .dev.vars.example .dev.vars${NC}"
echo "   Then edit .dev.vars with your credentials"
echo ""
echo "4. Run migrations:"
echo -e "   ${YELLOW}npm run db:migrate:local${NC}"
echo ""
echo "5. Start development:"
echo -e "   ${YELLOW}npm run dev${NC}"
