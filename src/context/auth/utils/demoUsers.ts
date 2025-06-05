
import { User, UserRole } from '@/lib/auth/types';

export const getDemoUser = (type: 'student' | 'professional'): User => {
  if (type === 'student') {
    return {
      id: "student-1",
      email: "student@example.com",
      displayName: "Alex Dupont",
      role: "student" as UserRole,
      kycStatus: "verified" as any,
      university: "Université Paris Descartes",
      subscriptionStatus: "free" as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } else {
    return {
      id: "professional-1",
      email: "doctor@example.com",
      displayName: "Dr. Marie Lambert",
      role: "professional" as UserRole,
      kycStatus: "verified" as any,
      specialty: "Cardiologie",
      subscriptionStatus: "free" as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
};

export const isDemoAccount = (email: string, password: string): boolean => {
  return (email === 'student@example.com' || email === 'doctor@example.com') && password === 'password';
};

export const getDemoUserType = (email: string): 'student' | 'professional' | null => {
  if (email === 'student@example.com') return 'student';
  if (email === 'doctor@example.com') return 'professional';
  return null;
};
