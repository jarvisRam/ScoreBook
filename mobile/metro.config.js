const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// EXPO_PUBLIC_* values are inlined into the bundle at transform time, but Metro's transform
// cache key ignores them (and `expo export --clear` does not bypass it), so a build could ship
// the API URL of an earlier build. Keying the cache on the URL gives each target its own entries.
config.cacheVersion = `api-base-url:${process.env.EXPO_PUBLIC_API_BASE_URL || ''}`;

module.exports = config;
