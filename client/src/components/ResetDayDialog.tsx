import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ResetDayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayOfWeek: string;
  onConfirm: () => void;
}

export function ResetDayDialog({
  open,
  onOpenChange,
  dayOfWeek,
  onConfirm,
}: ResetDayDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
            <AlertDialogTitle>Resetar Progresso?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 mt-4">
            <div>
              <p className="font-semibold text-foreground mb-2">{dayOfWeek}</p>
              <p className="text-sm">
                Tem certeza que deseja limpar todo o progresso deste dia?
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                ⚠ Esta ação não pode ser desfeita. Todos os exercícios e séries completadas serão deletados.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                ℹ O histórico de semanas completadas será mantido.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex gap-3 mt-6">
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Resetar Progresso
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

