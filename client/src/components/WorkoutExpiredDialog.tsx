import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

interface WorkoutExpiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  onContinue: () => void;
}

export function WorkoutExpiredDialog({
  open,
  onOpenChange,
  onReset,
  onContinue,
}: WorkoutExpiredDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Treino Vencido! 🎉</DialogTitle>
          <DialogDescription className="text-center mt-4">
            Parabéns! Você completou todas as 8 semanas de treino em Sexta!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-sm text-muted-foreground">
            Você pode começar um novo ciclo de treino ou continuar acompanhando seu progresso.
          </p>
        </div>

        <DialogFooter className="flex gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => {
              onContinue();
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Voltar para Home
          </Button>
          <Button
            onClick={() => {
              onReset();
              onOpenChange(false);
            }}
            className="flex-1"
          >
            Resetar Treino
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

