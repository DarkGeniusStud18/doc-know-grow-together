
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let storage: any = typeof window !== 'undefined' ? localStorage : undefined;
let storageKey = 'medcollab-auth-token';

if (typeof window !== 'undefined') {
  // Special handling for Capacitor & PWA storage
  // Only load @capacitor/storage and helpers if in browser
  if ((window as any).Capacitor && navigator.userAgent.includes('Capacitor')) {
    try {
      // Use Capacitor Storage via Supabase's helper
      const { CapacitorAuthHelper } = require('@supabase/auth-helpers-capacitor');
      storage = CapacitorAuthHelper;
      storageKey = 'supabase-session';
    } catch (err) {
      console.warn('Capacitor Storage not available:', err);
    }
  }
}

const SUPABASE_URL = "https://yblwafdsidkuzgzfazpf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlibHdhZmRzaWRrdXpnemZhenBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDU2MzIsImV4cCI6MjA2MjM4MTYzMn0.5GiBnyp-NAAZbOcenQYWkqPt-x0jvOcW4InS1U-u-Ns";

// Use proper storage based on environment
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: storageKey,
      storage: storage,
      detectSessionInUrl: true,
      flowType: 'pkce',
      debug: import.meta.env.DEV
    },
    global: {
      headers: {
        'Cache-Control': 'no-cache'
      }
    }
  }
);

if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Supabase Auth Event:', event);
    console.log('Session:', session ? {
      user: session.user?.id,
      expires_at: session.expires_at,
      access_token: session.access_token ? 'present' : 'missing'
    } : 'No session');
  });
}

