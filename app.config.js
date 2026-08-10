import 'dotenv/config';

export default {
  expo: {
    name: 'REM Sleep Cycle',
    slug: 'rem-sleep-cycle',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'dark',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1a1a2e'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.remsleep.cycle'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1a1a2e'
      },
      package: 'com.remsleep.cycle',
      versionCode: 1,
      jsEngine: 'jsc'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-font',
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#00d4aa',
          defaultChannel: 'default'
        }
      ],
      'expo-system-ui',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#1a1a2e',
          image: './assets/splash.png',
          imageWidth: 200
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: 'rem-sleep-cycle'
      }
    },
    runtimeVersion: {
      policy: 'appVersion'
    }
  }
};
