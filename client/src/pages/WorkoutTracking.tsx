import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Check, Clock, Flag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Exercise, PerformanceLog } from '@/types/app';
// Importa as interfaces de treino do AssignWorkout.tsx
// Nota: Em um projeto real, essas interfaces estariam em um arquivo de tipos compartilhado.
interface WorkoutExercise {
  exercicio_id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga: string;
  observacoes: string;
}

interface WorkoutBlock {
  id: string;
  titulo: string; // Ex: "Peito e Costas"
  exercicios: (WorkoutExercise & { log: PerformanceLog[], exercise: Exercise })[];
}

interface AssignedWorkout {
  aluno_id: string;
  personal_id: string;
  data_atribuicao: string;
  blocos: WorkoutBlock[];
  ciclo_count: number; // Novo campo para o contador de 8 treinos
}

// Simulação de funções de dados
const getAssignedWorkout = (studentId: string): AssignedWorkout | undefined => {
  const assignedWorkouts = JSON.parse(localStorage.getItem('assigned_workouts') || '[]');
  return assignedWorkouts.find((w: AssignedWorkout) => w.aluno_id === studentId);
};

const saveAssignedWorkout = (workout: AssignedWorkout) => {
  let assignedWorkouts = JSON.parse(localStorage.getItem('assigned_workouts') || '[]');
  const existingIndex = assignedWorkouts.findIndex((w: AssignedWorkout) => w.aluno_id === workout.aluno_id);

  if (existingIndex > -1) {
    assignedWorkouts[existingIndex] = workout;
  } else {
    assignedWorkouts.push(workout);
  }

  localStorage.setItem('assigned_workouts', JSON.stringify(assignedWorkouts));
};

const getExerciseDetails = (exerciseId: string): Exercise => {
  // Simulação: busca detalhes do exercício no banco central
  const exercises = JSON.parse(localStorage.getItem('master_exercises') || '[]');
  // A estrutura do exercício no master_exercises é ligeiramente diferente (nome, grupoMuscular)
  const masterEx = exercises.find((ex: any) => ex.id === exerciseId);
  
  return {
    id: exerciseId,
    nome_exercicio: masterEx?.nome || 'Exercício Desconhecido',
    descricao: '', // Não temos descrição no master_exercises
    link_video: '', // Não temos link de vídeo no master_exercises
    grupo_muscular: masterEx?.grupoMuscular || '',
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
  workoutId: string; // Na verdade, é o blockId
}

export default function WorkoutTracking({ workoutId: blockId }: WorkoutTrackingProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [workoutBlock, setWorkoutBlock] = useState<WorkoutBlock | null>(null);
  const [assignedWorkout, setAssignedWorkout] = useState<AssignedWorkout | null>(null);
  const [loading, setLoading] = useState(true);
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false); // Novo estado para controlar a finalização

  useEffect(() => {
    if (!user || user.role !== 'aluno') {
      navigate('/');
      return;
    }
    
    const currentAssignedWorkout = getAssignedWorkout(user.id);
    if (!currentAssignedWorkout) {
      alert('Nenhum treino atribuído.');
      navigate('/');
      return;
    }
    
    const block = currentAssignedWorkout.blocos.find(b => b.id === blockId);
    if (!block) {
      alert('Bloco de treino não encontrado.');
      navigate('/');
      return;
    }

    setAssignedWorkout(currentAssignedWorkout);
    
    // Adapta a estrutura do bloco para a estrutura esperada pelo componente
    const detailsWithExercises = block.exercicios.map((ex: any) => ({
      ...ex,
      id: ex.exercicio_id, // Usando o ID do exercício como ID do detalhe para simplificar
      exercise_id: ex.exercicio_id,
      carga_sugerida: ex.carga,
      exercise: getExerciseDetails(ex.exercicio_id),
      log: getPerformanceLog(user.id, ex.exercicio_id), // Loga pelo ID do exercício
    }));
    
    setWorkoutBlock({ ...block, exercicios: detailsWithExercises });
    setLoading(false);
  }, [user, blockId, navigate]);

  const handleFinishWorkout = () => {
    if (!assignedWorkout || !user) return;

    // 1. Atualiza o contador de ciclo
    let newCycleCount = (assignedWorkout.ciclo_count || 0) + 1;
    if (newCycleCount > 8) {
      newCycleCount = 1; // Reinicia o ciclo após 8 treinos
    }

    // 2. Salva o treino atualizado (com o novo ciclo_count)
    const updatedWorkout: AssignedWorkout = {
      ...assignedWorkout,
      ciclo_count: newCycleCount,
    };
    saveAssignedWorkout(updatedWorkout);

    // 3. Simulação de registro de treino concluído para o progresso semanal
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    const completedWorkouts = JSON.parse(localStorage.getItem('completed_workouts') || '[]');
    
    // Verifica se já existe um treino concluído para este usuário hoje
    const alreadyCompletedToday = completedWorkouts.some((cw: any) => 
      cw.user_id === user.id && cw.date === todayString
    );

    if (!alreadyCompletedToday) {
      completedWorkouts.push({
        user_id: user.id,
        date: todayString,
        block_id: blockId,
        title: workoutBlock?.titulo,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('completed_workouts', JSON.stringify(completedWorkouts));
    }

    alert(`Treino "${workoutBlock?.titulo}" finalizado! Ciclo atual: ${newCycleCount}/8.`);
    setIsFinished(true);
    navigate('/');
  };

  const handleLogSet = (detailId: string, setNumber: number, carga: string, reps: string) => {
    if (!user) return;

    const newLog: PerformanceLog = {
      id: `${detailId}-set-${setNumber}-${Date.now()}`, // ID único para o log
      student_id: user.id,
      workout_detail_id: detailId,
      carga_realizada: carga,
      repeticoes_realizadas: reps,
      data_execucao: new Date().toISOString(),
    };

    savePerformanceLog(newLog);
    
    // Atualiza o estado local
    setWorkoutBlock(prevBlock => {
      if (!prevBlock) return null;

      const updatedExercicios = prevBlock.exercicios.map(detail => {
        if (detail.id === detailId) {
          return {
            ...detail,
            log: [...detail.log, newLog]
          };
        }
        return detail;
      });

      return { ...prevBlock, exercicios: updatedExercicios };
    });
    
    // Inicia o timer de descanso
    setRestTimerActive(true);
  };

  const renderSetTracker = (detail: any) => {
    const sets = Array.from({ length: detail.series }, (_, i) => i + 1);
    
    return (
      <div className="space-y-3">
        {sets.map((setNumber) => {
          // Verifica se já existe um log para este set (simplificado, assume que o log é feito na ordem)
          const log = detail.log[setNumber - 1];
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

  if (!workoutBlock) {
    return <div className="min-h-screen flex items-center justify-center text-white">Erro ao carregar o bloco de treino.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="sticky top-0 bg-slate-800 border-b border-slate-700 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-10 w-10 text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-xl">{workoutBlock.titulo}</h1>
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
        {workoutBlock.exercicios.map((detail: any) => (
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
          <Button onClick={handleFinishWorkout} className="w-full h-12 gap-2 bg-green-600 hover:bg-green-700">
            <Flag className="w-5 h-5" />
            Finalizar Treino e Salvar Performance
          </Button>
        </div>
      </div>
    </div>
  );
}
