import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface FinishWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayOfWeek: string;
  currentWeek: number;
  completedExercises: number;
  totalExercises: number;
  onConfirm: () => void;
}

export function FinishWorkoutDialog({
  open,
  onOpenChange,
  dayOfWeek,
  currentWeek,
  completedExercises,
  totalExercises,
  onConfirm,
}: FinishWorkoutDialogProps) {
  const isAllCompleted = completedExercises === totalExercises;
  const isWeekComplete = currentWeek >= 8;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {isAllCompleted ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-yellow-500" />
            )}
            <AlertDialogTitle>
              {isAllCompleted ? 'Finalizar Treino?' : 'Treino Incompleto'}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 mt-4">
            <div>
              <p className="font-semibold text-foreground mb-2">{dayOfWeek}</p>
              <p className="text-sm">
                Exercícios completados: <span className="font-bold">{completedExercises}/{totalExercises}</span>
              </p>
            </div>

            {isAllCompleted && (
              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ Todos os exercícios foram completados!
                </p>
              </div>
            )}

            {!isAllCompleted && (
              <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  ⚠ Você tem exercícios incompletos. Tem certeza que deseja finalizar?
                </p>
              </div>
            )}

            {isWeekComplete && (
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                  🎉 Semana {currentWeek} será finalizada!
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Os dados serão registrados e o treino será resetado para a próxima semana.
                </p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 mt-6">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-green-600 hover:bg-green-700">
            {isWeekComplete ? 'Finalizar Semana' : 'Finalizar Treino'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

