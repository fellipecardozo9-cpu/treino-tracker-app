import { useState, useEffect, useCallback } from 'react';
import { ExerciseDatabase, ExerciseDatabaseStore, WorkoutProgram } from '@/types/workout';

const EXERCISE_DB_STORAGE_KEY = 'exercise_database';

const DEFAULT_EXERCISES: ExerciseDatabase[] = [
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

export function useExerciseDatabase() {
  const [store, setStore] = useState<ExerciseDatabaseStore>({
    exercises: DEFAULT_EXERCISES,
    workoutPrograms: [],
    activeWorkoutId: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(EXERCISE_DB_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setStore(data);
      } catch (error) {
        console.error('Erro ao carregar banco de dados:', error);
        setStore({
          exercises: DEFAULT_EXERCISES,
          workoutPrograms: [],
          activeWorkoutId: null,
        });
      }
    } else {
      setStore({
        exercises: DEFAULT_EXERCISES,
        workoutPrograms: [],
        activeWorkoutId: null,
      });
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(EXERCISE_DB_STORAGE_KEY, JSON.stringify(store));
    }
  }, [store, isLoaded]);

  // Exercícios
  const addExercise = useCallback((exercise: Omit<ExerciseDatabase, 'id' | 'createdAt'>) => {
    setStore((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          ...exercise,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const deleteExercise = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((ex) => ex.id !== id),
    }));
  }, []);

  const updateExercise = useCallback((id: string, updates: Partial<Omit<ExerciseDatabase, 'id' | 'createdAt'>>) => {
    setStore((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.id === id ? { ...ex, ...updates } : ex
      ),
    }));
  }, []);

  const getAllGroups = useCallback(() => {
    const groups = new Set(store.exercises.map((ex) => ex.grupoMuscular));
    return Array.from(groups).sort();
  }, [store.exercises]);

  const getExercisesByGroup = useCallback((group: string) => {
    return store.exercises.filter((ex) => ex.grupoMuscular === group);
  }, [store.exercises]);

  // Treinos
  const addWorkoutProgram = useCallback((program: Omit<WorkoutProgram, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newProgram: WorkoutProgram = {
      ...program,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };

    setStore((prev) => ({
      ...prev,
      workoutPrograms: [...prev.workoutPrograms, newProgram],
      activeWorkoutId: newProgram.id,
    }));

    return newProgram;
  }, []);

  const updateWorkoutProgram = useCallback((id: string, updates: Partial<Omit<WorkoutProgram, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setStore((prev) => ({
      ...prev,
      workoutPrograms: prev.workoutPrograms.map((program) =>
        program.id === id ? { ...program, ...updates, updatedAt: new Date().toISOString() } : program
      ),
    }));
  }, []);

  const deleteWorkoutProgram = useCallback((id: string) => {
    setStore((prev) => ({
      ...prev,
      workoutPrograms: prev.workoutPrograms.filter((program) => program.id !== id),
      activeWorkoutId: prev.activeWorkoutId === id ? null : prev.activeWorkoutId,
    }));
  }, []);

  const setActiveWorkout = useCallback((id: string | null) => {
    setStore((prev) => ({
      ...prev,
      activeWorkoutId: id,
    }));
  }, []);

  const getActiveWorkout = useCallback(() => {
    return store.workoutPrograms.find((program) => program.id === store.activeWorkoutId) || null;
  }, [store.workoutPrograms, store.activeWorkoutId]);

  return {
    store,
    addExercise,
    deleteExercise,
    updateExercise,
    getAllGroups,
    getExercisesByGroup,
    addWorkoutProgram,
    updateWorkoutProgram,
    deleteWorkoutProgram,
    setActiveWorkout,
    getActiveWorkout,
  };
}

