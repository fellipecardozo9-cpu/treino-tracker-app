import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserRole, UserStatus } from '@/types/auth';
import { PersonalProfile, StudentProfile } from '@/types/app';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_user';
const USERS_STORAGE_KEY = 'auth_users';

// Usuários padrão
const DEFAULT_MASTER: User = {
  id: 'admin-master',
  // nome: 'Admin Master', // Removido do User
  email: 'admin@everstrong.com',
  role: 'master',
  status: 'ativo',
  createdAt: new Date().toISOString(),
};

const DEFAULT_PERSONAL_USER: User = {
  id: 'personal-1',
  // nome: 'Personal Trainer', // Removido do User
  email: 'personal@everstrong.com',
  role: 'personal',
  status: 'ativo',
  createdAt: new Date().toISOString(),
};

const DEFAULT_ALUNO_USER: User = {
  id: 'aluno-1',
  // nome: 'Aluno', // Removido do User
  email: 'aluno@everstrong.com',
  role: 'aluno',
  status: 'ativo',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    }
    setIsLoading(false);
  }, []);

  // Inicializar banco de dados de usuários
  useEffect(() => {
    const users = localStorage.getItem(USERS_STORAGE_KEY);
    if (!users) {
      const defaultUsers = [DEFAULT_MASTER, DEFAULT_PERSONAL_USER, DEFAULT_ALUNO_USER];
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simular delay de autenticação
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');
      const foundUser = users.find((u: User) => u.email === email);

      if (!foundUser) {
        throw new Error('Usuário não encontrado');
      }

      // Verificação simples de senha (em produção, usar hash)
      if (password !== 'senha123') {
        throw new Error('Senha incorreta');
      }

      setUser(foundUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const register = async (email: string, password: string, role: UserRole, profileData: PersonalProfile | StudentProfile) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

      if (users.some((u: User) => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const newUser: User = {
        status: role === 'personal' ? 'pendente' : 'ativo', // Personal começa pendente
        id: Date.now().toString(),
        // nome, // Removido do User
        email,
        role,
        createdAt: new Date().toISOString(),
      };

      // Simulação de armazenamento de perfis
      const PROFILES_STORAGE_KEY = role === 'personal' ? 'personal_profiles' : 'student_profiles';
      const profiles = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY) || '[]');
      profiles.push({ ...profileData, user_id: newUser.id });
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));

      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      setUser(newUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
