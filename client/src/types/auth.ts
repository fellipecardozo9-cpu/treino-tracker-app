export type UserRole = 'admin' | 'personal' | 'aluno';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (nome: string, email: string, password: string, role: UserRole) => Promise<void>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

