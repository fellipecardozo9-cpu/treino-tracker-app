export interface Exercise {
  nome: string;
  series: number;
  reps: string;
  observacao: string;
}

export interface DayWorkout {
  dia: string;
  titulo: string;
  exercicios: Exercise[];
}

export interface WorkoutData {
  nome_treino: string;
  estrutura_semanal: Array<{
    dia: string;
    grupo_muscular: string;
    observacoes: string;
  }>;
  dias_de_treino: DayWorkout[];
}

export interface SetRecord {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export interface ExerciseSession {
  exerciseName: string;
  dayOfWeek: string;
  date: string;
  sets: SetRecord[];
}

export interface WorkoutHistory {
  [key: string]: ExerciseSession[];
}

export interface WeekCompletion {
  dayOfWeek: string;
  week: number;
  completedDate: string;
  totalSessions: number;
}

export interface WeekCompletionHistory {
  [key: string]: WeekCompletion[];
}

export interface ProgressData {
  exerciseName: string;
  history: Array<{
    date: string;
    weight: number;
    reps: number;
    sets: number;
  }>;
}

export interface ExerciseDatabase {
  id: string;
  nome: string;
  grupoMuscular: string;
  descricao?: string;
  createdAt: string;
}

export interface WorkoutProgram {
  id: string;
  nome: string;
  descricao?: string;
  dias: Array<{
    dia: string;
    titulo: string;
    exercicios: Array<{
      exerciseId: string;
      nome: string;
      series: number;
      reps: string;
      observacao: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseDatabaseStore {
  exercises: ExerciseDatabase[];
  workoutPrograms: WorkoutProgram[];
  activeWorkoutId: string | null;
}



// Sistema Robusto de Histórico de Treinos
export interface CompletedWorkoutRecord {
  id: string;
  userId: string;
  week: number;
  day: string;
  completedDate: string;
  status: 'completed' | 'pending';
  exercises: Array<{
    nome: string;
    sets: SetRecord[];
    weight?: number;
  }>;
  totalVolume: number;
  duration?: number;
}

export interface UserWorkoutHistory {
  userId: string;
  completedWorkouts: CompletedWorkoutRecord[];
  currentWeek: number;
  lastUpdated: string;
}

