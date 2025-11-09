import { useState, useEffect } from 'react';
import { WorkoutData } from '@/types/workout';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/app';

export function useWorkoutData() {
  const { user } = useAuth();
  const [data, setData] = useState<WorkoutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Lógica de carregamento de dados baseada na role
    const loadData = async () => {
      setLoading(true);
      setError(null);

      // Simulação de carregamento de dados do Personal Trainer
      if (user.role === 'personal' || user.role === 'master') {
        // Master/Personal carregam dados de gestão (alunos, treinos, etc.)
        // Por enquanto, apenas simula o carregamento
        try {
          const res = await fetch('/treino_data.json');
          if (!res.ok) throw new Error('Falha ao carregar dados de gestão');
          const data = await res.json();
          setData(data);
        } catch (err: any) {
          console.error('Erro ao carregar dados de gestão:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Lógica de carregamento de dados do Aluno
      if (user.role === 'aluno') {
        // Aluno carrega seu próprio treino
        try {
          const res = await fetch('/treino_data.json');
          if (!res.ok) throw new Error('Falha ao carregar dados do treino');
          const data = await res.json();
          setData(data);
        } catch (err: any) {
          console.error('Erro ao carregar treino:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
        return;
      }
    };

    loadData();

  }, [user]);

  return { data, loading, error };
}
