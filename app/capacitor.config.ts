import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.hackabull.attendee',
  appName: 'HackaBull',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '259322343269-h60k7kv3pefru78ekrjpriiq4vsb7355.apps.googleusercontent.com',
    },
  },
};

export default config;
