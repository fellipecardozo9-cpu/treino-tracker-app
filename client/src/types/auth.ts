import { UserRole, UserStatus } from './app';

export interface User {
  id: string;
  // nome: string; // Removido, nome agora está em PersonalProfile/StudentProfile
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, role: UserRole, profileData: any) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
