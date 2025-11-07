import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfile, BodyMetrics, ProgressMetrics } from '@/types/profile';

const PROFILE_KEY = 'user_profile';
const METRICS_KEY = 'user_metrics';

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<ProgressMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar perfil do localStorage
  useEffect(() => {
    if (!user) return;

    const stored = localStorage.getItem(`${PROFILE_KEY}_${user.id}`);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
      }
    }

    const metricsStored = localStorage.getItem(`${METRICS_KEY}_${user.id}`);
    if (metricsStored) {
      try {
        setMetrics(JSON.parse(metricsStored));
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      }
    }

    setIsLoading(false);
  }, [user]);

  // Calcular IMC
  const calculateIMC = useCallback((weight: number, height: number): number => {
    if (height === 0) return 0;
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }, []);

  // Calcular peso ideal (Fórmula de Devine)
  const calculateIdealWeight = useCallback((height: number): { min: number; max: number } => {
    // Fórmula simplificada: altura(cm) - 100 ± 10%
    const baseWeight = height - 100;
    return {
      min: Math.round(baseWeight * 0.9),
      max: Math.round(baseWeight * 1.1),
    };
  }, []);

  // Atualizar perfil
  const updateProfile = useCallback(
    (weight: number, height: number) => {
      if (!user) return false;

      const newProfile: UserProfile = {
        userId: user.id,
        weight,
        height,
        dateUpdated: new Date().toISOString(),
      };

      localStorage.setItem(`${PROFILE_KEY}_${user.id}`, JSON.stringify(newProfile));
      setProfile(newProfile);

      // Atualizar métricas
      const imc = calculateIMC(weight, height);
      const idealWeight = calculateIdealWeight(height);

      const bodyMetrics: BodyMetrics = {
        weight,
        height,
        imc,
        idealWeightMin: idealWeight.min,
        idealWeightMax: idealWeight.max,
        date: new Date().toISOString(),
      };

      // Adicionar ao histórico de métricas
      const currentMetrics = metrics || {
        userId: user.id,
        totalWorkouts: 0,
        totalSessions: 0,
        averageSessionDuration: 0,
        currentStreak: 0,
        longestStreak: 0,
        weightHistory: [],
        workoutHistory: [],
        lastUpdated: new Date().toISOString(),
      };

      currentMetrics.weightHistory.push(bodyMetrics);
      currentMetrics.lastUpdated = new Date().toISOString();

      localStorage.setItem(`${METRICS_KEY}_${user.id}`, JSON.stringify(currentMetrics));
      setMetrics(currentMetrics);

      return true;
    },
    [user, metrics, calculateIMC, calculateIdealWeight]
  );

  // Obter última métrica
  const getLatestMetrics = useCallback((): BodyMetrics | null => {
    if (!metrics || metrics.weightHistory.length === 0) return null;
    return metrics.weightHistory[metrics.weightHistory.length - 1];
  }, [metrics]);

  // Obter evolução de peso
  const getWeightEvolution = useCallback((): BodyMetrics[] => {
    if (!metrics) return [];
    return metrics.weightHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [metrics]);

  // Calcular mudança de peso
  const getWeightChange = useCallback((): { change: number; percentage: number } => {
    if (!metrics || metrics.weightHistory.length < 2) return { change: 0, percentage: 0 };

    const history = metrics.weightHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = history[0].weight;
    const last = history[history.length - 1].weight;
    const change = last - first;
    const percentage = (change / first) * 100;

    return { change: Math.round(change * 10) / 10, percentage: Math.round(percentage * 10) / 10 };
  }, [metrics]);

  // Obter estatísticas gerais
  const getStats = useCallback(() => {
    return {
      profile,
      metrics,
      latestMetrics: getLatestMetrics(),
      weightEvolution: getWeightEvolution(),
      weightChange: getWeightChange(),
    };
  }, [profile, metrics, getLatestMetrics, getWeightEvolution, getWeightChange]);

  return {
    profile,
    metrics,
    isLoading,
    updateProfile,
    calculateIMC,
    calculateIdealWeight,
    getLatestMetrics,
    getWeightEvolution,
    getWeightChange,
    getStats,
  };
}

