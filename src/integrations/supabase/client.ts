
import { createClient } from '@supabase/supabase-js';
import { Storage } from '@capacitor/storage';
import type { Database } from './types';

let storage: any = typeof window !== 'undefined' ? localStorage : undefined;
let storageKey = 'medcollab-auth-token';

// Capacitor detection (web/native)
if (typeof window !== 'undefined') {
  if ((window as any).Capacitor && navigator.userAgent.includes('Capacitor')) {
    storage = {
      getItem: async (key: string) => {
        const { value } = await Storage.get({ key });
        return value;
      },
      setItem: async (key: string, value: string) => {
        await Storage.set({ key, value });
      },
      removeItem: async (key: string) => {
        await Storage.remove({ key });
      }
    };
    storageKey = 'supabase-session';
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
    console.log('Session:', session
      ? {
          user: session.user?.id,
          expires_at: session.expires_at,
          access_token: session.access_token ? 'present' : 'missing',
        }
      : 'No session'
    );
  });
}
