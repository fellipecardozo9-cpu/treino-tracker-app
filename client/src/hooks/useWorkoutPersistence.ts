import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SESSION_PROGRESS_KEY = 'current_workout_session';
const AUTO_SAVE_INTERVAL = 5000; // Salvar a cada 5 segundos

export function useWorkoutPersistence() {
  const { user } = useAuth();

  // Salvar progresso atual
  const saveSessionProgress = useCallback(
    (day: string, week: number, exerciseData: any) => {
      if (!user) return false;

      const sessionData = {
        userId: user.id,
        day,
        week,
        exerciseData,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem(`${SESSION_PROGRESS_KEY}_${user.id}`, JSON.stringify(sessionData));
      return true;
    },
    [user]
  );

  // Recuperar progresso salvo
  const getSessionProgress = useCallback(() => {
    if (!user) return null;

    const stored = localStorage.getItem(`${SESSION_PROGRESS_KEY}_${user.id}`);
    if (!stored) return null;

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Erro ao recuperar progresso da sessão:', error);
      return null;
    }
  }, [user]);

  // Limpar progresso salvo
  const clearSessionProgress = useCallback(() => {
    if (!user) return false;

    localStorage.removeItem(`${SESSION_PROGRESS_KEY}_${user.id}`);
    return true;
  }, [user]);

  // Verificar se há sessão em progresso
  const hasActiveSession = useCallback(() => {
    const session = getSessionProgress();
    if (!session) return false;

    // Considerar sessão ativa se foi salva há menos de 24 horas
    const savedTime = new Date(session.timestamp).getTime();
    const now = new Date().getTime();
    const hoursDiff = (now - savedTime) / (1000 * 60 * 60);

    return hoursDiff < 24;
  }, [getSessionProgress]);

  // Auto-save com intervalo
  const setupAutoSave = useCallback(
    (day: string, week: number, exerciseData: any) => {
      const interval = setInterval(() => {
        saveSessionProgress(day, week, exerciseData);
      }, AUTO_SAVE_INTERVAL);

      return () => clearInterval(interval);
    },
    [saveSessionProgress]
  );

  return {
    saveSessionProgress,
    getSessionProgress,
    clearSessionProgress,
    hasActiveSession,
    setupAutoSave,
  };
}

