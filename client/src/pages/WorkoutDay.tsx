import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SetTracker } from '@/components/SetTracker';
import { FinishWorkoutDialog } from '@/components/FinishWorkoutDialog';
import { ResetDayDialog } from '@/components/ResetDayDialog';
import { RestTimer } from '@/components/RestTimer';
import { WorkoutExpiredDialog } from '@/components/WorkoutExpiredDialog';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { useWorkoutStorage } from '@/hooks/useWorkoutStorage';
import { useSequentialWorkoutProgress } from '@/hooks/useSequentialWorkoutProgress';
import { SetRecord, ExerciseSession } from '@/types/workout';
import { ArrowLeft, CheckCircle2, Circle, Flag, RotateCcw, Clock } from 'lucide-react';

interface WorkoutDayProps {
  dayIndex?: number;
  day?: string;
  week?: number;
}

export default function WorkoutDay({ dayIndex, day, week }: WorkoutDayProps) {
  const [, navigate] = useLocation();
  const { data, loading } = useWorkoutData();
  const { getTodaySession, updateExerciseSession, addExerciseSession, history } =
    useWorkoutStorage();
  const { completeWorkoutForDay, getCurrentWeek, getCurrentDay, isWorkoutCompleted, resetWorkout } = useSequentialWorkoutProgress();

  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando treino...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Dia de treino não encontrado</p>
      </div>
    );
  }

  const dayWorkout = day 
    ? data.dias_de_treino.find((d: any) => d.dia === day)
    : dayIndex !== undefined ? data.dias_de_treino[dayIndex] : null;

  if (!dayWorkout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Dia de treino não encontrado</p>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const currentWeek = getCurrentWeek();
  const currentDay = getCurrentDay();
  const workoutCompleted = isWorkoutCompleted();

  const handleSaveExercise = (exerciseName: string, sets: SetRecord[]) => {
    const existingSession = getTodaySession(dayWorkout.dia, exerciseName);

    const session: ExerciseSession = {
      exerciseName,
      dayOfWeek: dayWorkout.dia,
      date: today,
      sets,
    };

    if (existingSession) {
      const key = `${dayWorkout.dia}_${exerciseName}`;
      updateExerciseSession(key, session);
    } else {
      addExerciseSession(session);
    }

    setExpandedExercise(null);
  };

  const getExerciseProgress = (exerciseName: string) => {
    const session = getTodaySession(dayWorkout.dia, exerciseName);
    if (!session) return { completed: 0, total: 0 };

    const completed = session.sets.filter((s) => s.completed).length;
    return { completed, total: session.sets.length };
  };

  const getTotalProgress = () => {
    let completedExercises = 0;
    let totalExercises = dayWorkout.exercicios.length;

    dayWorkout.exercicios.forEach((exercise: any) => {
      const progress = getExerciseProgress(exercise.nome);
      if (progress.completed > 0) {
        completedExercises += 1;
      }
    });

    return { completedExercises, totalExercises };
  };

  const handleFinishWorkout = () => {
    // Verificar se é o dia correto para finalizar
    // Permitir Sexta semana 8 mesmo que seja o dia final
    if (dayWorkout.dia !== currentDay) {
      // Se for Sexta semana 8, permitir mesmo assim
      if (!(dayWorkout.dia === 'Sexta' && currentWeek === 8)) {
        alert(`Você deve completar ${currentDay} primeiro!`);
        return;
      }
    }

    // Verificar se é a última semana e o último dia
    if (currentWeek === 8 && dayWorkout.dia === 'Sexta') {
      setShowExpiredDialog(true);
      return;
    }

    // Completar o treino e avançar para o próximo dia
    const success = completeWorkoutForDay(dayWorkout.dia);
    if (success) {
      navigate('/');
    }
  };

  const handleResetDay = () => {
    dayWorkout.exercicios.forEach((exercise: any) => {
      const key = `${dayWorkout.dia}_${exercise.nome}`;
      delete history[key];
    });

    localStorage.setItem('workout_history', JSON.stringify(history));
    window.location.reload();
  };

  const handleResetWorkout = () => {
    resetWorkout();
    navigate('/');
  };

  const progress = getTotalProgress();
  // Permitir acessar dias anteriores (semanas passadas) e o dia atual
  const DAYS_ORDER = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
  const currentDayIndex = DAYS_ORDER.indexOf(currentDay);
  const checkDayIndex = DAYS_ORDER.indexOf(dayWorkout.dia);
  const weekNumber = week || 1; // Valor padrão se week for undefined
  
  // Dia está liberado se:
  // 1. É o dia atual na semana atual
  // 2. É um dia anterior na semana atual
  // 3. É qualquer dia em uma semana anterior
  // 4. É Sexta na semana 8 (último dia)
  const isCurrentDay = (weekNumber === currentWeek && checkDayIndex <= currentDayIndex) || 
                       (weekNumber < currentWeek) || 
                       (dayWorkout.dia === 'Sexta' && currentWeek === 8);
  const isLocked = !(isCurrentDay);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="h-10 w-10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-xl">{dayWorkout.titulo}</h1>
              <p className="text-sm text-muted-foreground">{dayWorkout.dia}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRestTimer(!showRestTimer)}
              className="h-10 w-10"
              title="Cronômetro de descanso"
            >
              <Clock className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowResetDialog(true)}
              className="h-10 w-10"
              title="Resetar progresso do dia"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Status de Bloqueio */}
      {isLocked && (
        <div className="bg-yellow-50 border-b border-yellow-200 p-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-yellow-800 font-semibold">
              ⚠️ Este treino está bloqueado. Complete {currentDay} semana {currentWeek} primeiro!
            </p>
          </div>
        </div>
      )}

      {/* Status de Semana Anterior */}
      {!isLocked && weekNumber < currentWeek && (
        <div className="bg-blue-50 border-b border-blue-200 p-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-blue-800 font-semibold">
              ✓ Semana anterior - Você pode revisar este treino
            </p>
          </div>
        </div>
      )}

      {/* Cronômetro de Descanso */}
      {showRestTimer && (
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <RestTimer onClose={() => setShowRestTimer(false)} />
        </div>
      )}

      {/* Exercícios */}
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-40 space-y-3">
        {dayWorkout.exercicios.map((exercise: any, index: number) => {
          const exerciseProgress = getExerciseProgress(exercise.nome);
          const isExpanded = expandedExercise === exercise.nome;

          return (
            <div key={index}>
              <Card
                className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isLocked && setExpandedExercise(isExpanded ? null : exercise.nome)}
              >
                <div className="flex items-center gap-3">
                  {exerciseProgress.total > 0 ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{exercise.nome}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exercise.series} séries x {exercise.reps} reps
                    </p>
                    {exercise.observacao !== '—' && (
                      <p className="text-xs text-muted-foreground italic">
                        {exercise.observacao}
                      </p>
                    )}
                  </div>

                  {exerciseProgress.total > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {exerciseProgress.completed}/{exerciseProgress.total}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {isExpanded && !isLocked && (
                <div className="mt-2 animate-in fade-in">
                  <SetTracker
                    exerciseName={exercise.nome}
                    targetSets={exercise.series}
                    targetReps={exercise.reps}
                    initialSets={
                      getTodaySession(dayWorkout.dia, exercise.nome)
                        ?.sets
                    }
                    onSave={(sets) =>
                      handleSaveExercise(exercise.nome, sets)
                    }
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Botão Flutuante de Finalizar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-3 p-3 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Progresso do dia</p>
              <p className="font-bold text-lg">
                {progress.completedExercises}/{progress.totalExercises} exercícios
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Semana</p>
              <p className="font-bold text-lg">{currentWeek}/8</p>
            </div>
          </div>

          <Button
            onClick={() => setShowFinishDialog(true)}
            className="w-full h-12 gap-2"
            variant={progress.completedExercises === progress.totalExercises ? 'default' : 'outline'}
            disabled={isLocked}
          >
            <Flag className="w-5 h-5" />
            {isLocked ? 'Bloqueado' : 'Finalizar Treino'}
          </Button>
        </div>
      </div>

      {/* Dialog de Confirmação - Finalizar */}
      <FinishWorkoutDialog
        open={showFinishDialog}
        onOpenChange={setShowFinishDialog}
        dayOfWeek={dayWorkout.dia}
        currentWeek={currentWeek}
        completedExercises={progress.completedExercises}
        totalExercises={progress.totalExercises}
        onConfirm={handleFinishWorkout}
      />

      {/* Dialog de Confirmação - Reset */}
      <ResetDayDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        dayOfWeek={dayWorkout.dia}
        onConfirm={handleResetDay}
      />

      {/* Dialog - Treino Vencido */}
      <WorkoutExpiredDialog
        open={showExpiredDialog}
        onOpenChange={setShowExpiredDialog}
        onReset={handleResetWorkout}
        onContinue={() => {
          setShowExpiredDialog(false);
          navigate('/');
        }}
      />
    </div>
  );
}

