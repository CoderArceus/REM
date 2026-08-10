import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'REM Sleep Cycle',
  slug: 'rem-sleep-cycle',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  newArchEnabled: true,
  jsEngine: 'jsc',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1a1a2e'
  },
  assetBundlePatterns: ['**/*'],
  ios: { supportsTablet: true, bundleIdentifier: 'com.remsleep.app' },
  android: {
    package: 'com.remsleep.app',
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#1a1a2e' }
  },
  web: { favicon: './assets/favicon.png', bundler: 'metro' },
  extra: { eas: { projectId: 'remsleepcycle' }, version: '1.0.0' }
});
