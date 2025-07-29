import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medcollabmedoc.app',
  appName: 'MedCollab - Plateforme Médicale Collaborative',
  webDir: 'dist',
  server: {
    // 🔄 Configuration corrigée pour éviter "Not found" en Android Studio
    url: process.env.NODE_ENV === 'production' 
      ? undefined 
      : 'https://c0e9bf31-c1a9-41bf-b4b8-64a460d16a75.lovableproject.com?forceHideBadge=true',
    cleartext: true,
    allowNavigation: [
      'https://c0e9bf31-c1a9-41bf-b4b8-64a460d16a75.lovableproject.com',
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
