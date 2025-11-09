import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check, Clock, Flag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise, PerformanceLog } from '@/types/app';

// Simulação de funções de dados
const getWorkoutDetails = (workoutId: string) => {
  // Simulação: retorna um array de exercícios para o treino
  return [
    { id: 'wd1', exercise_id: 'ex1', series: 4, repeticoes: '8-12', carga_sugerida: '40kg', observacoes: 'Foco na amplitude' },
    { id: 'wd2', exercise_id: 'ex2', series: 3, repeticoes: '10', carga_sugerida: '50kg', observacoes: 'Subida explosiva' },
  ];
};

const getExerciseDetails = (exerciseId: string): Exercise => {
  // Simulação: busca detalhes do exercício no banco central
  const exercises = JSON.parse(localStorage.getItem('exercises') || '[]');
  return exercises.find((ex: Exercise) => ex.id === exerciseId) || {
    id: exerciseId,
    nome_exercicio: 'Exercício Desconhecido',
    descricao: '',
    link_video: '',
    grupo_muscular: '',
  };
};

const getPerformanceLog = (studentId: string, workoutDetailId: string): PerformanceLog[] => {
  // Simulação: busca logs de performance
  return JSON.parse(localStorage.getItem('performance_log') || '[]').filter((log: PerformanceLog) => 
    log.student_id === studentId && log.workout_detail_id === workoutDetailId
  );
};

const savePerformanceLog = (log: PerformanceLog) => {
  const logs = JSON.parse(localStorage.getItem('performance_log') || '[]');
  const updatedLogs = [...logs, log];
  localStorage.setItem('performance_log', JSON.stringify(updatedLogs));
};

interface WorkoutTrackingProps {
  workoutId: string;
}

export default function WorkoutTracking({ workoutId }: WorkoutTrackingProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [workoutDetails, setWorkoutDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restTimerActive, setRestTimerActive] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'aluno') {
      navigate('/');
      return;
    }
    
    // Simulação de carregamento de dados
    const details = getWorkoutDetails(workoutId);
    const detailsWithExercises = details.map((detail: any) => ({
      ...detail,
      exercise: getExerciseDetails(detail.exercise_id),
      log: getPerformanceLog(user.id, detail.id),
    }));
    
    setWorkoutDetails(detailsWithExercises);
    setLoading(false);
  }, [user, workoutId, navigate]);

  const handleLogSet = (detailId: string, seriesIndex: number, carga: string, reps: string) => {
    if (!user) return;

    const newLog: PerformanceLog = {
      id: Date.now().toString(),
      student_id: user.id,
      workout_detail_id: detailId,
      carga_realizada: carga,
      repeticoes_realizadas: reps,
      data_execucao: new Date().toISOString(),
    };

    savePerformanceLog(newLog);
    
    // Atualiza o estado local
    setWorkoutDetails(prevDetails => prevDetails.map(detail => {
      if (detail.id === detailId) {
        return {
          ...detail,
          log: [...detail.log, newLog]
        };
      }
      return detail;
    }));
    
    // Inicia o timer de descanso
    setRestTimerActive(true);
  };

  const renderSetTracker = (detail: any) => {
    const sets = Array.from({ length: detail.series }, (_, i) => i + 1);
    
    return (
      <div className="space-y-3">
        {sets.map((setNumber) => {
          const log = detail.log.find((l: PerformanceLog) => l.id.endsWith(`set-${setNumber}`)) || detail.log[setNumber - 1]; // Simplesmente usa o índice
          const isLogged = !!log;
          
          return (
            <Card key={setNumber} className={`p-3 flex items-center gap-3 ${isLogged ? 'bg-green-900/50' : 'bg-slate-700'}`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0" style={{ backgroundColor: isLogged ? '#10B981' : '#475569' }}>
                {setNumber}
              </div>
              
              <div className="flex-1 grid grid-cols-3 gap-2">
                <Input 
                  type="text" 
                  placeholder="Carga (kg)" 
                  defaultValue={log?.carga_realizada || detail.carga_sugerida}
                  className="bg-slate-800 border-slate-600 text-white"
                  disabled={isLogged}
                  id={`carga-${detail.id}-${setNumber}`}
                />
                <Input 
                  type="text" 
                  placeholder="Reps" 
                  defaultValue={log?.repeticoes_realizadas || detail.repeticoes}
                  className="bg-slate-800 border-slate-600 text-white"
                  disabled={isLogged}
                  id={`reps-${detail.id}-${setNumber}`}
                />
                <Button 
                  onClick={() => {
                    const carga = (document.getElementById(`carga-${detail.id}-${setNumber}`) as HTMLInputElement).value;
                    const reps = (document.getElementById(`reps-${detail.id}-${setNumber}`) as HTMLInputElement).value;
                    handleLogSet(detail.id, setNumber, carga, reps);
                  }}
                  disabled={isLogged}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLogged ? <Check className="w-4 h-4" /> : 'Registrar'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Carregando Treino...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-10 w-10 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-xl">Rastreamento de Treino</h1>
          <Button variant="ghost" size="icon" onClick={() => setRestTimerActive(true)} className="h-10 w-10 text-white">
            <Clock className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Timer de Descanso (Simulação) */}
      {restTimerActive && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <Card className="p-4 bg-red-900/50 border-red-700 text-white flex justify-between items-center">
            <p className="font-bold">Descanso Ativo: 60s</p>
            <Button onClick={() => setRestTimerActive(false)} className="bg-red-600 hover:bg-red-700">Pular</Button>
          </Card>
        </div>
      )}

      {/* Exercícios */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-40 space-y-6">
        {workoutDetails.map((detail: any) => (
          <Card key={detail.id} className="p-6 bg-slate-800 space-y-4">
            <h2 className="text-xl font-bold text-blue-400">{detail.exercise.nome_exercicio}</h2>
            <p className="text-sm text-slate-400">Sugerido: {detail.series} x {detail.repeticoes} @ {detail.carga_sugerida}</p>
            <p className="text-sm text-slate-400 italic">Obs: {detail.observacoes}</p>
            
            {renderSetTracker(detail)}
          </Card>
        ))}
      </div>

      {/* Botão Flutuante de Finalizar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4">
        <div className="max-w-2xl mx-auto">
          <Button className="w-full h-12 gap-2 bg-green-600 hover:bg-green-700">
            <Flag className="w-5 h-5" />
            Finalizar Treino e Salvar Performance
          </Button>
        </div>
      </div>
    </div>
  );
}
