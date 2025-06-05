
import { Session } from '@supabase/supabase-js';
import { User, UserRole } from '@/lib/auth/types';

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  register: (email: string, password: string, role: UserRole, displayName: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: (redirectPath?: string) => Promise<void>;
  updateCurrentUser: (updatedUser: User) => void;
}
