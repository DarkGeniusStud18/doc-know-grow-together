
import { User } from '@/lib/auth/types';
import { Session } from '@supabase/supabase-js';

export interface AuthResult {
  error?: string;
  user?: User | null;
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, metadata?: any) => Promise<AuthResult>;
  signInAsDemo: (type: 'student' | 'professional') => Promise<AuthResult>;
  signOut: () => Promise<void>;
  updateCurrentUser: (user: User) => void;
  
  // Legacy method aliases for backward compatibility
  signUp: (email: string, password: string, metadata?: any) => Promise<AuthResult>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  register: (email: string, password: string, role: any, displayName: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: (redirectPath?: string) => Promise<void>;
}
