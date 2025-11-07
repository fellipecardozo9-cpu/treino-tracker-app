import { CheckCircle2, Circle } from 'lucide-react';

interface WeekIndicatorProps {
  currentWeek: number;
  maxWeeks?: number;
}

export function WeekIndicator({ currentWeek, maxWeeks = 8 }: WeekIndicatorProps) {
  const weeks = Array.from({ length: maxWeeks }, (_, i) => i + 1);
  const isComplete = currentWeek >= maxWeeks;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-muted-foreground">Progresso</p>
        <p className="text-sm font-bold text-primary">
          Semana {currentWeek}/{maxWeeks}
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isComplete ? 'bg-green-500' : 'bg-primary'
          }`}
          style={{ width: `${(currentWeek / maxWeeks) * 100}%` }}
        />
      </div>

      {/* Indicadores de semanas */}
      <div className="flex gap-1 flex-wrap">
        {weeks.map((week) => (
          <div
            key={week}
            className={`flex-1 min-w-0 aspect-square rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
              week <= currentWeek
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {week}
          </div>
        ))}
      </div>

      {/* Mensagem de conclusão */}
      {isComplete && (
        <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-950 rounded-lg">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
            Fase completa! 🎉
          </p>
        </div>
      )}
    </div>
  );
}

