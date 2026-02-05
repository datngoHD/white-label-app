const fs = require('fs');
const path = require('path');

const brandId = process.env.BRAND || 'default';

// Load brand configuration
const loadBrandConfig = (id) => {
  const brandPath = path.join(__dirname, 'core', 'config', 'brands', `${id}.json`);

  if (!fs.existsSync(brandPath)) {
    console.error(`Brand configuration not found: ${brandPath}`);
    console.error(`Available brands: ${getAvailableBrands().join(', ')}`);
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(brandPath, 'utf8'));
};

// Get available brand IDs
const getAvailableBrands = () => {
  const brandsDir = path.join(__dirname, 'core', 'config', 'brands');
  if (!fs.existsSync(brandsDir)) {
    return ['default'];
  }
  return fs
    .readdirSync(brandsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace('.json', ''));
};

// Validate brand configuration
const validateBrand = (brand) => {
  const required = ['id', 'appName', 'slug', 'ios', 'android', 'defaultTenantId', 'assetsPath'];
  const missing = required.filter((field) => !brand[field]);

  if (missing.length > 0) {
    console.error(`Brand configuration missing required fields: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (!brand.ios.bundleId) {
    console.error('Brand configuration missing ios.bundleId');
    process.exit(1);
  }

  if (!brand.android.packageName) {
    console.error('Brand configuration missing android.packageName');
    process.exit(1);
  }

  return true;
};

const brand = loadBrandConfig(brandId);
validateBrand(brand);

module.exports = ({ config }) => {
  return {
    ...config,
    name: brand.appName,
    slug: brand.slug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: `./${brand.assetsPath}/icon.png`,
    userInterfaceStyle: 'automatic',
    splash: {
      image: `./${brand.assetsPath}/splash.png`,
      resizeMode: 'contain',
      backgroundColor: brand.theme?.colors?.primary || '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: brand.ios.bundleId,
      newArchEnabled: false,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: `./${brand.assetsPath}/adaptive-icon.png`,
        backgroundColor: brand.theme?.colors?.primary || '#ffffff',
      },
      package: brand.android.packageName,
      newArchEnabled: false,
    },
    web: {
      favicon: `./${brand.assetsPath}/favicon.png`,
    },
    extra: {
      brandId: brand.id,
      tenantId: brand.defaultTenantId,
      APP_ENV: process.env.APP_ENV || 'development',
    },
    plugins: ['expo-secure-store'],
  };
};
