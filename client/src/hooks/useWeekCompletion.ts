import { useState, useEffect, useCallback } from 'react';
import { WeekCompletionHistory, WeekCompletion } from '@/types/workout';

const WEEK_COMPLETION_STORAGE_KEY = 'week_completion_history';

export function useWeekCompletion() {
  const [weekCompletions, setWeekCompletions] = useState<WeekCompletionHistory>({});
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar dados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(WEEK_COMPLETION_STORAGE_KEY);
    if (stored) {
      try {
        setWeekCompletions(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar histórico de semanas:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar dados no localStorage sempre que weekCompletions mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(WEEK_COMPLETION_STORAGE_KEY, JSON.stringify(weekCompletions));
    }
  }, [weekCompletions, isLoaded]);

  const completeWeek = useCallback(
    (dayOfWeek: string, week: number, totalSessions: number) => {
      const completion: WeekCompletion = {
        dayOfWeek,
        week,
        completedDate: new Date().toISOString().split('T')[0],
        totalSessions,
      };

      setWeekCompletions((prev) => {
        const key = dayOfWeek;
        return {
          ...prev,
          [key]: [...(prev[key] || []), completion],
        };
      });
    },
    []
  );

  const getWeekCompletions = useCallback(
    (dayOfWeek: string) => {
      return weekCompletions[dayOfWeek] || [];
    },
    [weekCompletions]
  );

  const getTotalCompletedWeeks = useCallback(
    (dayOfWeek: string) => {
      return getWeekCompletions(dayOfWeek).length;
    },
    [getWeekCompletions]
  );

  const getLastCompletionDate = useCallback(
    (dayOfWeek: string) => {
      const completions = getWeekCompletions(dayOfWeek);
      return completions.length > 0 ? completions[completions.length - 1].completedDate : null;
    },
    [getWeekCompletions]
  );

  return {
    weekCompletions,
    isLoaded,
    completeWeek,
    getWeekCompletions,
    getTotalCompletedWeeks,
    getLastCompletionDate,
  };
}

