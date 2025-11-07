import { useMemo } from 'react';
import { useWorkoutStorage } from './useWorkoutStorage';
import { useWorkoutData } from './useWorkoutData';

export function useWeekProgress() {
  const { history } = useWorkoutStorage();
  const { data } = useWorkoutData();

  const weekProgress = useMemo(() => {
    if (!data) return {};

    const progress: Record<string, { week: number; totalSessions: number }> = {};

    data.dias_de_treino.forEach((dayWorkout) => {
      let totalSessions = 0;

      // Contar todas as sessões únicas deste dia
      dayWorkout.exercicios.forEach((exercise) => {
        const key = `${dayWorkout.dia}_${exercise.nome}`;
        const sessions = history[key] || [];
        
        // Pegar o máximo de sessões entre todos os exercícios do dia
        if (sessions.length > totalSessions) {
          totalSessions = sessions.length;
        }
      });

      // Calcular a semana (máximo 8)
      const week = Math.min(Math.ceil(totalSessions / 1), 8);

      progress[dayWorkout.dia] = {
        week,
        totalSessions,
      };
    });

    return progress;
  }, [history, data]);

  return weekProgress;
}

