#!/bin/bash

# Environment setup script
# Usage: ./scripts/setup-env.sh <environment>

set -e

ENVIRONMENT=${1:-development}

echo "Setting up environment: $ENVIRONMENT"

# Source environment file if exists
ENV_FILE=".env.${ENVIRONMENT}"
if [ -f "$ENV_FILE" ]; then
    echo "Loading $ENV_FILE"
    export $(grep -v '^#' $ENV_FILE | xargs)
else
    echo "Warning: $ENV_FILE not found, using defaults"
fi

# Validate required environment variables
validate_env() {
    if [ -z "${!1}" ]; then
        echo "Error: $1 is not set"
        return 1
    fi
    echo "  $1: [SET]"
}

echo "Validating environment variables..."

# Optional validation - uncomment as needed
# validate_env "SENTRY_DSN" || true
# validate_env "API_BASE_URL" || true

echo "Environment setup complete"
