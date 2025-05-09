
export type UserRole = 'student' | 'professional' | 'admin';

export type KycStatus = 'pending' | 'verified' | 'rejected' | 'not_submitted';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  kycStatus: KycStatus;
  profileImage?: string;
  university?: string;
  specialty?: string;
  createdAt: Date;
}
