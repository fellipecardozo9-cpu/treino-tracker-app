import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User, AuthContextType, UserRole, UserStatus } from '@/types/auth';
import { PersonalProfile, StudentProfile } from '@/types/app';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'auth_user';
const USERS_STORAGE_KEY = 'auth_users';
const MASTER_EXERCISES_KEY = 'master_exercises';

// Usuários padrão
const DEFAULT_MASTER: User = {
  id: 'admin-master',
  email: 'admin@everstrong.com',
  role: 'master',
  status: 'ativo',
  createdAt: new Date().toISOString(),
  password_hash: btoa('senha123'), // Adicionado hash simulado
};

const DEFAULT_PERSONAL_USER: User = {
  id: 'personal-1',
  email: 'personal@everstrong.com',
  role: 'personal',
  status: 'ativo',
  createdAt: new Date().toISOString(),
  password_hash: btoa('senha123'), // Adicionado hash simulado
};

const DEFAULT_ALUNO_USER: User = {
  id: 'aluno-1',
  email: 'aluno@everstrong.com',
  role: 'aluno',
  status: 'ativo',
  createdAt: new Date().toISOString(),
  password_hash: btoa('senha123'), // Adicionado hash simulado
};

// Exercícios Padrão (Baseado no useExerciseDatabase.ts)
const DEFAULT_EXERCISES = [
  { id: '1', nome: 'Supino reto', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '2', nome: 'Supino inclinado', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '3', nome: 'Supino declinado', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '4', nome: 'Crossover', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '5', nome: 'Peck deck', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '6', nome: 'Crucifixo reto', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '7', nome: 'Crucifixo inclinado', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '8', nome: 'Flexao de braco', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '9', nome: 'Supino com halteres', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '10', nome: 'Supino na maquina', grupoMuscular: 'Peito', createdAt: new Date().toISOString() },
  { id: '11', nome: 'Puxada frente', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '12', nome: 'Puxada atras', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '13', nome: 'Remada curvada', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '14', nome: 'Remada baixa', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '15', nome: 'Remada unilateral com halter', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '16', nome: 'Puxada neutra', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '17', nome: 'Barra fixa', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '18', nome: 'Remada cavalinho', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '19', nome: 'Remada sentada', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '20', nome: 'Levantamento terra', grupoMuscular: 'Costas', createdAt: new Date().toISOString() },
  { id: '21', nome: 'Desenvolvimento com halteres', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '22', nome: 'Desenvolvimento na maquina', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '23', nome: 'Elevacao lateral', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '24', nome: 'Elevacao frontal', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '25', nome: 'Remada alta', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '26', nome: 'Crucifixo inverso', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '27', nome: 'Desenvolvimento militar', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '28', nome: 'Elevacao lateral na maquina', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '29', nome: 'Arnold press', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '30', nome: 'Face pull', grupoMuscular: 'Ombros', createdAt: new Date().toISOString() },
  { id: '31', nome: 'Rosca direta', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '32', nome: 'Rosca alternada', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '33', nome: 'Rosca concentrada', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '34', nome: 'Rosca scott', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '35', nome: 'Rosca martelo', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '36', nome: 'Rosca inversa', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '37', nome: 'Rosca no cabo', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '38', nome: 'Rosca 21', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '39', nome: 'Rosca com corda', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '40', nome: 'Rosca spider', grupoMuscular: 'Biceps', createdAt: new Date().toISOString() },
  { id: '41', nome: 'Triceps testa', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '42', nome: 'Triceps corda', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '43', nome: 'Triceps banco', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '44', nome: 'Triceps frances', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '45', nome: 'Triceps pulley', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '46', nome: 'Triceps coice', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '47', nome: 'Triceps na maquina', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '48', nome: 'Mergulho nas paralelas', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '49', nome: 'Triceps invertido', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '50', nome: 'Triceps unilateral', grupoMuscular: 'Triceps', createdAt: new Date().toISOString() },
  { id: '51', nome: 'Agachamento livre', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '52', nome: 'Agachamento smith', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '53', nome: 'Leg press', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '54', nome: 'Cadeira extensora', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '55', nome: 'Cadeira flexora', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '56', nome: 'Cadeira adutora', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '57', nome: 'Cadeira abdutora', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '58', nome: 'Avanco com halteres', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '59', nome: 'Agachamento sumo', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '60', nome: 'Agachamento bulgaro', grupoMuscular: 'Pernas', createdAt: new Date().toISOString() },
  { id: '61', nome: 'Elevacao de quadril', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '62', nome: 'Gluteo 4 apoios', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '63', nome: 'Cadeira abdutora gluteos', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '64', nome: 'Agachamento profundo', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '65', nome: 'Passada lateral', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '66', nome: 'Step-up', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '67', nome: 'Gluteo na polia', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '68', nome: 'Ponte com barra', grupoMuscular: 'Gluteos', createdAt: new Date().toISOString() },
  { id: '69', nome: 'Abdominal reto', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
  { id: '70', nome: 'Abdominal infra', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
  { id: '71', nome: 'Prancha', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
  { id: '72', nome: 'Abdominal lateral', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
  { id: '73', nome: 'Abdominal na bola', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
  { id: '74', nome: 'Abdominal na maquina', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
  { id: '75', nome: 'Gluteo kickback', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
  { id: '76', nome: 'Agachamento sumo com halter', grupoMuscular: 'Abdomen', createdAt: new Date().toISOString() },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const populateMasterExercises = useCallback(() => {
    const existingExercises = JSON.parse(localStorage.getItem(MASTER_EXERCISES_KEY) || '[]');

    if (existingExercises.length === 0) {
      localStorage.setItem(MASTER_EXERCISES_KEY, JSON.stringify(DEFAULT_EXERCISES));
    }
  }, []);

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    // 1. Popular o banco de exercícios mestre se estiver vazio
    populateMasterExercises();

    // 2. Carregar usuário
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    }
    setIsLoading(false);
  }, [populateMasterExercises]);

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

      // Verificação de senha (comparando com o hash simulado)
      if (foundUser.password_hash !== btoa(password)) {
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
        email,
        role,
        createdAt: new Date().toISOString(),
        password_hash: btoa(password), // Salva o hash simulado da senha
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

  const value: AuthContextType = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  }), [user, isLoading, login, logout, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
