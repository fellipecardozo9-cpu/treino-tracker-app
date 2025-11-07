import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRestTimer } from '@/hooks/useRestTimer';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface RestTimerProps {
  onClose?: () => void;
}

export function RestTimer({ onClose }: RestTimerProps) {
  const timer = useRestTimer(60);

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-primary/10">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-lg">Descanso</h3>
      </div>

      {/* Seleção de Tempo */}
      <div className="flex gap-2">
        <Button
          variant={timer.selectedTime === 60 ? 'default' : 'outline'}
          onClick={() => timer.setTime(60)}
          disabled={timer.isRunning}
          className="flex-1"
        >
          60s
        </Button>
        <Button
          variant={timer.selectedTime === 90 ? 'default' : 'outline'}
          onClick={() => timer.setTime(90)}
          disabled={timer.isRunning}
          className="flex-1"
        >
          90s
        </Button>
      </div>

      {/* Display do Timer */}
      <div className="bg-background rounded-lg p-8 text-center">
        <div className="text-5xl font-bold text-primary font-mono">
          {timer.formatTime(timer.timeLeft)}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Tempo de descanso</p>
      </div>

      {/* Controles */}
      <div className="flex gap-2">
        {!timer.isRunning ? (
          <Button
            onClick={timer.start}
            className="flex-1 gap-2"
            size="lg"
          >
            <Play className="w-4 h-4" />
            Iniciar
          </Button>
        ) : (
          <Button
            onClick={timer.pause}
            variant="outline"
            className="flex-1 gap-2"
            size="lg"
          >
            <Pause className="w-4 h-4" />
            Pausar
          </Button>
        )}

        <Button
          onClick={timer.reset}
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      {/* Status */}
      {timer.timeLeft === 0 && !timer.isRunning && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-green-700">✓ Descanso completo!</p>
        </div>
      )}

      {onClose && (
        <Button onClick={onClose} variant="ghost" className="w-full">
          Fechar
        </Button>
      )}
    </Card>
  );
}

