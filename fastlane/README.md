# Fastlane Configuration

This directory contains Fastlane configurations for building and deploying the white-label mobile app.

## Setup

1. Install Ruby dependencies:
   ```bash
   bundle install
   ```

2. Configure environment variables (see below)

## Environment Variables

### iOS

| Variable | Description |
|----------|-------------|
| `FASTLANE_USER` | Apple ID email |
| `FASTLANE_PASSWORD` | Apple ID password |
| `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD` | App-specific password for 2FA |
| `MATCH_GIT_URL` | Git URL for Match certificates repository |
| `MATCH_PASSWORD` | Password for Match encryption |
| `TEAM_ID` | Apple Developer Team ID |
| `ITC_TEAM_ID` | App Store Connect Team ID |

### Android

| Variable | Description |
|----------|-------------|
| `GOOGLE_PLAY_JSON_KEY_PATH` | Path to Google Play service account JSON |
| `ANDROID_KEYSTORE_PATH` | Path to release keystore |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |

## Available Lanes

### iOS

```bash
# Setup certificates
bundle exec fastlane ios setup_certs

# Build for specific brand
bundle exec fastlane ios build brand:default environment:staging
bundle exec fastlane ios build brand:brand-a environment:production

# Deploy to TestFlight
bundle exec fastlane ios beta brand:default

# Deploy to App Store
bundle exec fastlane ios release brand:default
```

### Android

```bash
# Build for specific brand
bundle exec fastlane android build brand:default environment:staging
bundle exec fastlane android build brand:brand-a environment:production

# Deploy to Play Store Internal Testing
bundle exec fastlane android beta brand:default

# Deploy to Play Store Production
bundle exec fastlane android release brand:default
```

## Brand Configuration

Brands are configured in the `Fastfile`. Each brand specifies:
- `ios_bundle_id`: iOS bundle identifier
- `android_package`: Android package name
- `app_name`: Display name of the app

To add a new brand, add an entry to the `BRANDS` hash in `Fastfile`.
