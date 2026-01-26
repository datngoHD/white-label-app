#!/bin/bash

# Build script for brand-specific builds
# Usage: ./scripts/build-brand.sh <brand-id> <platform> [environment]

set -e

BRAND=${1:-default}
PLATFORM=${2:-ios}
ENVIRONMENT=${3:-development}

echo "Building $BRAND for $PLATFORM ($ENVIRONMENT)"

# Validate brand exists
BRAND_CONFIG="core/config/brands/${BRAND}.json"
if [ ! -f "$BRAND_CONFIG" ]; then
    echo "Error: Brand configuration not found: $BRAND_CONFIG"
    echo "Available brands:"
    ls -1 core/config/brands/*.json 2>/dev/null | xargs -I {} basename {} .json
    exit 1
fi

# Export environment variables
export BRAND=$BRAND
export APP_ENV=$ENVIRONMENT

# Run expo prebuild
echo "Running expo prebuild..."
npx expo prebuild --clean

# Build based on platform
case $PLATFORM in
    ios)
        echo "Building iOS..."
        npx expo run:ios --configuration Release
        ;;
    android)
        echo "Building Android..."
        npx expo run:android --variant release
        ;;
    both)
        echo "Building iOS..."
        npx expo run:ios --configuration Release
        echo "Building Android..."
        npx expo run:android --variant release
        ;;
    *)
        echo "Unknown platform: $PLATFORM"
        echo "Supported platforms: ios, android, both"
        exit 1
        ;;
esac

echo "Build complete for $BRAND ($PLATFORM)"
