import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_user';
const USERS_STORAGE_KEY = 'auth_users';

// Usuários padrão
const DEFAULT_ADMIN: User = {
  id: 'admin-master',
  nome: 'Admin Master',
  email: 'admin@everstrong.com',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

const DEFAULT_PERSONAL: User = {
  id: 'personal-1',
  nome: 'Personal Trainer',
  email: 'personal@everstrong.com',
  role: 'personal',
  createdAt: new Date().toISOString(),
};

const DEFAULT_ALUNO: User = {
  id: 'aluno-1',
  nome: 'Aluno',
  email: 'aluno@everstrong.com',
  role: 'aluno',
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
      const defaultUsers = [DEFAULT_ADMIN, DEFAULT_PERSONAL, DEFAULT_ALUNO];
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

  const register = async (nome: string, email: string, password: string, role: UserRole) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]');

      if (users.some((u: User) => u.email === email)) {
        throw new Error('Email já cadastrado');
      }

      const newUser: User = {
        id: Date.now().toString(),
        nome,
        email,
        role,
        createdAt: new Date().toISOString(),
      };

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

