export type UserRole = 'master' | 'personal' | 'aluno';
export type UserStatus = 'ativo' | 'pendente' | 'suspenso' | 'rejeitado';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface PersonalProfile {
  user_id: string;
  nome: string;
  cref: string;
  telefone: string;
  data_aprovacao: string;
}

export interface StudentProfile {
  user_id: string;
  personal_id: string; // FK para PersonalProfiles
  nome: string;
  data_nascimento: string;
  peso: number;
  altura: number;
}

export interface Exercise {
  id: string;
  nome_exercicio: string;
  descricao: string;
  link_video: string;
  grupo_muscular: string;
}

export interface Workout {
  id: string;
  personal_id: string;
  nome_treino: string;
  duracao_estimada: number;
  data_criacao: string;
}

export interface WorkoutDetail {
  id: string;
  workout_id: string;
  exercise_id: string;
  series: number;
  repeticoes: string;
  carga_sugerida: string;
  observacoes: string;
}

export interface PerformanceLog {
  id: string;
  student_id: string;
  workout_detail_id: string;
  carga_realizada: string;
  repeticoes_realizadas: string;
  data_execucao: string;
}

export interface Invitation {
  id: string;
  personal_id: string;
  token_convite: string;
  email_aluno: string;
  status: 'pendente' | 'aceito' | 'expirado';
}
