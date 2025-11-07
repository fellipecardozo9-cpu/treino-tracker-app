import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SEQUENTIAL_PROGRESS_KEY = 'sequential_workout_progress';

// Ordem dos dias da semana
const DAYS_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

interface SequentialProgress {
  [userId: string]: {
    currentDay: string; // Dia atual (Segunda, Terça, etc)
    currentWeek: number; // Semana atual (1-8)
    completedWorkouts: {
      day: string;
      week: number;
      date: string;
    }[];
  };
}

export function useSequentialWorkoutProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<SequentialProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar progresso do localStorage
  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem(SEQUENTIAL_PROGRESS_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setProgress(data);
      } catch (error) {
        console.error('Erro ao carregar progresso sequencial:', error);
        setProgress({});
      }
    } else {
      setProgress({});
    }
    setIsLoaded(true);
  }, [user]);

  // Salvar progresso no localStorage
  const saveProgress = useCallback(
    (updatedProgress: SequentialProgress) => {
      if (!user) return;
      localStorage.setItem(SEQUENTIAL_PROGRESS_KEY, JSON.stringify(updatedProgress));
      setProgress(updatedProgress);
    },
    [user]
  );

  // Obter progresso atual do usuário
  const getUserProgress = useCallback(() => {
    if (!user || !progress) return null;
    return progress[user.id] || {
      currentDay: 'Segunda',
      currentWeek: 1,
      completedWorkouts: [],
    };
  }, [user, progress]);

  // Verificar se um dia está liberado
  const isDayUnlocked = useCallback(
    (day: string, week: number) => {
      if (!user || !progress) return false;

      const userProgress = progress[user.id];
      if (!userProgress) return day === 'Segunda' && week === 1; // Primeira semana de Segunda está sempre liberada

      // Se for a semana atual, o dia está liberado se for igual ou anterior ao dia atual
      if (week === userProgress.currentWeek) {
        const currentDayIndex = DAYS_ORDER.indexOf(userProgress.currentDay);
        const checkDayIndex = DAYS_ORDER.indexOf(day);
        return checkDayIndex <= currentDayIndex;
      }

      // Se for semana anterior, está completa
      if (week < userProgress.currentWeek) {
        return true;
      }

      // Se for semana posterior, não está liberada
      return false;
    },
    [user, progress]
  );

  // Finalizar treino de um dia e avançar para o próximo
  const completeWorkoutForDay = useCallback(
    (day: string) => {
      if (!user || !progress) return false;

      const userProgress = progress[user.id] || {
        currentDay: 'Segunda',
        currentWeek: 1,
        completedWorkouts: [],
      };

      const currentDayIndex = DAYS_ORDER.indexOf(userProgress.currentDay);
      const completedDayIndex = DAYS_ORDER.indexOf(day);

      // Validar se é o dia correto
      if (completedDayIndex !== currentDayIndex) {
        console.warn(`Tentativa de completar ${day}, mas o dia atual é ${userProgress.currentDay}`);
        return false;
      }

      const updatedProgress = { ...progress };
      const today = new Date().toISOString().split('T')[0];

      // Registrar treino concluído
      userProgress.completedWorkouts.push({
        day,
        week: userProgress.currentWeek,
        date: today,
      });

      // Determinar próximo dia e semana
      let nextDayIndex = currentDayIndex + 1;
      let nextWeek = userProgress.currentWeek;

      if (nextDayIndex >= DAYS_ORDER.length) {
        // Passou de Sexta, volta para Segunda da próxima semana
        nextDayIndex = 0;
        nextWeek += 1;
      }

      // Se chegou na semana 9, significa que completou sexta da semana 8
      if (nextWeek > 8) {
        // Treino vencido! Manter na sexta 8 para mostrar mensagem
        userProgress.currentDay = 'Sexta';
        userProgress.currentWeek = 8;
      } else {
        userProgress.currentDay = DAYS_ORDER[nextDayIndex];
        userProgress.currentWeek = nextWeek;
      }

      updatedProgress[user.id] = userProgress;
      saveProgress(updatedProgress);
      return true;
    },
    [user, progress, saveProgress]
  );

  // Verificar se o treino foi concluído (Sexta semana 8)
  const isWorkoutCompleted = useCallback(() => {
    if (!user || !progress) return false;
    const userProgress = progress[user.id];
    if (!userProgress) return false;
    return userProgress.currentDay === 'Sexta' && userProgress.currentWeek === 8;
  }, [user, progress]);

  // Resetar treino para começar do zero
  const resetWorkout = useCallback(() => {
    if (!user || !progress) return false;

    const updatedProgress = { ...progress };
    updatedProgress[user.id] = {
      currentDay: 'Segunda',
      currentWeek: 1,
      completedWorkouts: [],
    };

    saveProgress(updatedProgress);
    return true;
  }, [user, progress, saveProgress]);

  // Avançar para a próxima semana (começa em branco)
  const advanceToNextWeek = useCallback(() => {
    if (!user || !progress) return false;

    const userProgress = progress[user.id] || {
      currentDay: 'Segunda',
      currentWeek: 1,
      completedWorkouts: [],
    };

    // Se estiver na semana 8, não avança (treino vencido)
    if (userProgress.currentWeek >= 8) {
      return false;
    }

    const updatedProgress = { ...progress };
    updatedProgress[user.id] = {
      ...userProgress,
      currentDay: 'Segunda',
      currentWeek: userProgress.currentWeek + 1,
      completedWorkouts: userProgress.completedWorkouts,
    };

    saveProgress(updatedProgress);
    return true;
  }, [user, progress, saveProgress]);

  // Obter semana atual
  const getCurrentWeek = useCallback(() => {
    const userProgress = getUserProgress();
    return userProgress?.currentWeek || 1;
  }, [getUserProgress]);

  // Obter dia atual
  const getCurrentDay = useCallback(() => {
    const userProgress = getUserProgress();
    return userProgress?.currentDay || 'Segunda';
  }, [getUserProgress]);

  return {
    progress,
    isLoaded,
    isDayUnlocked,
    completeWorkoutForDay,
    isWorkoutCompleted,
    resetWorkout,
    advanceToNextWeek,
    getCurrentWeek,
    getCurrentDay,
    getUserProgress,
  };
}

