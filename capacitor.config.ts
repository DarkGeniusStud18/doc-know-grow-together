import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medcollabmedoc.app',
  appName: 'MedCollab - Plateforme Médicale Collaborative',
  webDir: 'dist',
  server: {
    // 🔄 Configuration pour les mises à jour OTA et support mobile
    url: process.env.NODE_ENV === 'production' 
      ? undefined 
      : 'https://0af55372-f4a7-4914-a7f4-25b16047afc1.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    allowNavigation: [
      //'https://0af55372-f4a7-4914-a7f4-25b16047afc1.lovableproject.com',
      'https://*.supabase.co',
      'https://supabase.com'
    ],
    // 📱 Correction du problème d'écran blanc sur les appareils mobiles
    hostname: 'localhost',
    androidScheme: 'https',
    iosScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#2563eb',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#2563eb',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    App: {
      launchAutoHide: false
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  }
};

export default config;
