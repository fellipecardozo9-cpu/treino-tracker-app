import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressChart } from '@/components/ProgressChart';
import { useWorkoutStorage } from '@/hooks/useWorkoutStorage';
import { ArrowLeft, TrendingUp } from 'lucide-react';

interface ExerciseDetailProps {
  exerciseName: string;
}

export default function ExerciseDetail({ exerciseName }: ExerciseDetailProps) {
  const [, navigate] = useLocation();
  const { history } = useWorkoutStorage();

  const sessions = useMemo(() => {
    return Object.values(history)
      .flat()
      .filter((s) => s.exerciseName === exerciseName)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [history, exerciseName]);

  const stats = useMemo(() => {
    if (sessions.length === 0) {
      return {
        totalSessions: 0,
        maxWeight: 0,
        avgWeight: 0,
        totalVolume: 0,
        improvement: 0,
      };
    }

    const weights = sessions.flatMap((s) =>
      s.sets.map((set) => set.weight).filter((w) => w > 0)
    );

    const maxWeight = Math.max(...weights);
    const avgWeight =
      weights.length > 0
        ? parseFloat((weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1))
        : 0;

    const totalVolume = sessions.reduce((sum, session) => {
      return (
        sum +
        session.sets.reduce((setSum, set) => {
          return setSum + set.weight * set.reps;
        }, 0)
      );
    }, 0);

    // Calcular melhoria (diferença entre primeira e última sessão)
    const firstSessionWeight =
      sessions[0].sets.find((s) => s.weight > 0)?.weight || 0;
    const lastSessionWeight =
      sessions[sessions.length - 1].sets.find((s) => s.weight > 0)?.weight || 0;

    const improvement =
      firstSessionWeight > 0
        ? parseFloat(
            (
              ((lastSessionWeight - firstSessionWeight) / firstSessionWeight) *
              100
            ).toFixed(1)
          )
        : 0;

    return {
      totalSessions: sessions.length,
      maxWeight,
      avgWeight,
      totalVolume: parseFloat(totalVolume.toFixed(1)),
      improvement,
    };
  }, [sessions]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/statistics')}
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-xl truncate">{exerciseName}</h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {sessions.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              Nenhuma sessão registrada para este exercício
            </p>
          </Card>
        ) : (
          <>
            {/* Cards de resumo */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Sessões</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </Card>

              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Peso Máx</p>
                <p className="text-2xl font-bold">{stats.maxWeight} kg</p>
              </Card>

              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Peso Médio</p>
                <p className="text-2xl font-bold">{stats.avgWeight} kg</p>
              </Card>

              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Volume Total</p>
                <p className="text-2xl font-bold">{stats.totalVolume} kg</p>
              </Card>
            </div>

            {/* Melhoria */}
            {stats.improvement !== 0 && (
              <Card className="p-4 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Melhoria desde o início
                    </p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                      +{stats.improvement}%
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Gráfico */}
            <ProgressChart
              exerciseName={exerciseName}
              sessions={sessions}
              chartType="line"
            />

            {/* Histórico detalhado */}
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Histórico de Sessões</h2>
              <div className="space-y-2">
                {sessions
                  .slice()
                  .reverse()
                  .map((session, index) => {
                    const maxWeight = Math.max(...session.sets.map((s) => s.weight));
                    const totalReps = session.sets.reduce(
                      (sum, s) => sum + s.reps,
                      0
                    );
                    const completedSets = session.sets.filter(
                      (s) => s.completed
                    ).length;

                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted rounded"
                      >
                        <div>
                          <p className="font-medium">
                            {new Date(session.date).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {completedSets}/{session.sets.length} séries
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{maxWeight} kg</p>
                          <p className="text-sm text-muted-foreground">
                            {totalReps} reps
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

