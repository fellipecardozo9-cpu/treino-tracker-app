// Tipos para perfil do usuário e estatísticas

export interface UserProfile {
  userId: string;
  weight: number; // em kg
  height: number; // em cm
  dateUpdated: string; // ISO date string
  birthDate?: string; // ISO date string (opcional)
}

export interface BodyMetrics {
  weight: number;
  height: number;
  imc: number; // Índice de Massa Corporal
  idealWeightMin: number; // Peso ideal mínimo
  idealWeightMax: number; // Peso ideal máximo
  date: string; // ISO date string
}

export interface WorkoutSession {
  id: string;
  userId: string;
  day: string; // Segunda, Terça, etc
  week: number; // 1-8
  date: string; // ISO date string
  exercises: ExerciseRecord[];
  duration: number; // em minutos
  completed: boolean;
}

export interface ExerciseRecord {
  name: string;
  sets: SetRecord[];
  weight?: number; // peso usado (opcional)
  notes?: string; // observações
}

export interface SetRecord {
  setNumber: number;
  reps: number;
  completed: boolean;
  weight?: number; // peso usado nesta série
}

export interface ProgressMetrics {
  userId: string;
  totalWorkouts: number;
  totalSessions: number; // total de dias treino
  averageSessionDuration: number; // em minutos
  currentStreak: number; // dias consecutivos
  longestStreak: number; // maior sequência
  weightHistory: BodyMetrics[]; // histórico de peso
  workoutHistory: WorkoutSession[];
  lastUpdated: string; // ISO date string
}

export interface EvolutionData {
  date: string;
  weight: number;
  imc: number;
  workoutsCompleted: number;
  totalExercises: number;
}

