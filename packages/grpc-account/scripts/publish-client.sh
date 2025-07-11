#!/bin/bash

set -e

# Colors for output
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
NC="\033[0m" # No Color

# Check if client directory exists
if [ ! -d "./client" ]; then
  echo -e "${RED}Error: client directory not found. Run 'npm run client:generate' first.${NC}"
  exit 1
fi

# Get the service name from the directory name
SERVICE_NAME=$(basename "$(pwd)" | sed 's/grpc-//')
echo -e "${GREEN}Publishing client for ${SERVICE_NAME} service...${NC}"

cd client

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo -e "${YELLOW}Warning: GITHUB_TOKEN environment variable is not set.${NC}"
  echo -e "${YELLOW}If you're not already authenticated with GitHub, the publish may fail.${NC}"
  echo -e "${YELLOW}You can set it with: export GITHUB_TOKEN=your_github_token${NC}"
fi

# Configure npm for GitHub Packages
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN:-}" > .npmrc
echo "@events-project:registry=https://npm.pkg.github.com" >> .npmrc

# Build the package
echo -e "${GREEN}Building the package...${NC}"
npm install
npm run build

# Publish the package
echo -e "${GREEN}Publishing the package...${NC}"
npm publish

echo -e "${GREEN}Successfully published @events-project/grpc-${SERVICE_NAME}!${NC}"
