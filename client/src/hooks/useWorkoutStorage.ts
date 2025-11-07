import { useState, useEffect, useCallback } from 'react';
import { WorkoutHistory, ExerciseSession } from '@/types/workout';

const STORAGE_KEY = 'workout_history';

export function useWorkoutStorage() {
  const [history, setHistory] = useState<WorkoutHistory>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que history mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addExerciseSession = useCallback((session: ExerciseSession) => {
    setHistory((prev) => {
      const key = `${session.dayOfWeek}_${session.exerciseName}`;
      return {
        ...prev,
        [key]: [...(prev[key] || []), session],
      };
    });
  }, []);

  const updateExerciseSession = useCallback((key: string, session: ExerciseSession) => {
    setHistory((prev) => {
      const sessions = prev[key] || [];
      const lastIndex = sessions.length - 1;
      const updated = [...sessions];
      updated[lastIndex] = session;
      return {
        ...prev,
        [key]: updated,
      };
    });
  }, []);

  const getExerciseHistory = useCallback((dayOfWeek: string, exerciseName: string) => {
    const key = `${dayOfWeek}_${exerciseName}`;
    return history[key] || [];
  }, [history]);

  const getTodaySession = useCallback((dayOfWeek: string, exerciseName: string) => {
    const today = new Date().toISOString().split('T')[0];
    const sessions = getExerciseHistory(dayOfWeek, exerciseName);
    return sessions.find((s) => s.date === today);
  }, [getExerciseHistory]);

  const clearHistory = useCallback(() => {
    setHistory({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    history,
    isLoaded,
    addExerciseSession,
    updateExerciseSession,
    getExerciseHistory,
    getTodaySession,
    clearHistory,
  };
}

