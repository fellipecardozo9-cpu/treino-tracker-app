import { useState, useEffect, useCallback } from 'react';
import { CompletedWorkoutRecord, UserWorkoutHistory } from '@/types/workout';
import { useAuth } from '@/contexts/AuthContext';

const WORKOUT_HISTORY_STORAGE_KEY = 'workout_history_robust_by_day';

interface DayProgress {
  [day: string]: {
    currentWeek: number;
    completedWorkouts: CompletedWorkoutRecord[];
  };
}

export function useWorkoutHistoryRobust() {
  const { user } = useAuth();
  const [dayProgress, setDayProgress] = useState<DayProgress | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar histórico do localStorage
  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        const userProgress = data[user.id];
        if (userProgress) {
          setDayProgress(userProgress);
        } else {
          setDayProgress({});
        }
      } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        setDayProgress({});
      }
    } else {
      setDayProgress({});
    }
    setIsLoaded(true);
  }, [user]);

  // Salvar histórico no localStorage
  const saveProgress = useCallback((updatedProgress: DayProgress) => {
    if (!user) return;

    const stored = localStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY);
    const allProgress = stored ? JSON.parse(stored) : {};
    allProgress[user.id] = updatedProgress;
    localStorage.setItem(WORKOUT_HISTORY_STORAGE_KEY, JSON.stringify(allProgress));
    setDayProgress(updatedProgress);
  }, [user]);

  // Obter semana atual de um dia específico
  const getCurrentWeekForDay = useCallback(
    (day: string) => {
      if (!dayProgress || !dayProgress[day]) return 0;
      return dayProgress[day].currentWeek;
    },
    [dayProgress]
  );

  // Registrar treino concluído para um dia específico
  const completeWorkoutForDay = useCallback(
    (day: string, exercises: any[]) => {
      if (!dayProgress || !user) return;

      const currentWeek = dayProgress[day]?.currentWeek || 0;

      const newRecord: CompletedWorkoutRecord = {
        id: `${user.id}_${currentWeek}_${day}_${Date.now()}`,
        userId: user.id,
        week: currentWeek,
        day,
        completedDate: new Date().toISOString().split('T')[0],
        status: 'completed',
        exercises: exercises.map((ex) => ({
          nome: ex.nome,
          sets: ex.sets || [],
          weight: ex.weight,
        })),
        totalVolume: exercises.reduce((sum, ex) => {
          const volume = (ex.sets || []).reduce((total: number, set: any) => {
            return total + (set.weight * set.reps || 0);
          }, 0);
          return sum + volume;
        }, 0),
      };

      const updatedProgress = { ...dayProgress };
      if (!updatedProgress[day]) {
        updatedProgress[day] = { currentWeek: 1, completedWorkouts: [] };
      }
      updatedProgress[day].completedWorkouts.push(newRecord);

      saveProgress(updatedProgress);
      return newRecord;
    },
    [dayProgress, user, saveProgress]
  );

  // Avançar para próxima semana de um dia específico
  const advanceWeekForDay = useCallback(
    (day: string) => {
      if (!dayProgress || !user) return false;

      const currentWeek = dayProgress[day]?.currentWeek || 0;

      if (currentWeek < 8) {
        const updatedProgress = { ...dayProgress };
        if (!updatedProgress[day]) {
          updatedProgress[day] = { currentWeek: 0, completedWorkouts: [] };
        }
        // Avançar a semana mas MANTER o histórico de treinos concluídos
        updatedProgress[day].currentWeek = currentWeek + 1;
        // NAO limpar completedWorkouts - manter o historico!

        saveProgress(updatedProgress);
        return true;
      }
      return false;
    },
    [dayProgress, user, saveProgress]
  );

  // Obter treino concluído de um dia em uma semana específica
  const getCompletedWorkoutByDayAndWeek = useCallback(
    (day: string, week: number) => {
      if (!dayProgress || !dayProgress[day]) return null;
      return dayProgress[day].completedWorkouts.find(
        (w) => w.week === week && w.day === day && w.status === 'completed'
      );
    },
    [dayProgress]
  );

  // Verificar se um dia foi concluído em uma semana específica
  const isDayCompletedInWeek = useCallback(
    (day: string, week: number) => {
      if (!dayProgress || !dayProgress[day]) return false;
      return dayProgress[day].completedWorkouts.some(
        (w) => w.week === week && w.day === day && w.status === 'completed'
      );
    },
    [dayProgress]
  );

  // Obter todas as semanas concluídas de um dia
  const getCompletedWeeksForDay = useCallback(
    (day: string) => {
      if (!dayProgress || !dayProgress[day]) return [];
      const weeks = new Set(dayProgress[day].completedWorkouts.map((w) => w.week));
      return Array.from(weeks).sort((a, b) => a - b);
    },
    [dayProgress]
  );

  return {
    dayProgress,
    isLoaded,
    getCurrentWeekForDay,
    completeWorkoutForDay,
    advanceWeekForDay,
    getCompletedWorkoutByDayAndWeek,
    isDayCompletedInWeek,
    getCompletedWeeksForDay,
    currentWeek: dayProgress ? Object.keys(dayProgress).length > 0 ? 1 : 1 : 1,
  };
}

