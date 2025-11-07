import { useState, useEffect } from 'react';
import { WorkoutData } from '@/types/workout';

export function useWorkoutData() {
  const [data, setData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/treino_data.json')
      .then((res) => {
        if (!res.ok) throw new Error('Falha ao carregar dados do treino');
        return res.json();
      })
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        console.error('Erro ao carregar treino:', err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

