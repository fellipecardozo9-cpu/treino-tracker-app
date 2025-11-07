import { useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWorkoutStorage } from '@/hooks/useWorkoutStorage';
import { useWorkoutData } from '@/hooks/useWorkoutData';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserProfileCard } from '@/components/UserProfileCard';
import { ArrowLeft, TrendingUp, Zap, ChevronRight, TrendingDown } from 'lucide-react';

export default function Statistics() {
  const [, navigate] = useLocation();
  const { history } = useWorkoutStorage();
  const { data } = useWorkoutData();
  const { profile, getLatestMetrics, getWeightEvolution, getWeightChange } = useUserProfile();

  const stats = useMemo(() => {
    const allSessions = Object.values(history).flat();

    if (allSessions.length === 0) {
      return {
        totalWorkouts: 0,
        totalSets: 0,
        totalVolume: 0,
        averageWeight: 0,
        exerciseProgress: {},
      };
    }

    const totalSets = allSessions.reduce((sum, session) => {
      return sum + session.sets.filter((s) => s.completed).length;
    }, 0);

    const totalVolume = allSessions.reduce((sum, session) => {
      return (
        sum +
        session.sets.reduce((setSum, set) => {
          return setSum + (set.weight * set.reps);
        }, 0)
      );
    }, 0);

    const allWeights = allSessions
      .flatMap((s) => s.sets.map((set) => set.weight))
      .filter((w) => w > 0);

    const averageWeight =
      allWeights.length > 0
        ? (allWeights.reduce((a, b) => a + b, 0) / allWeights.length).toFixed(1)
        : 0;

    // Agrupar progresso por exercício
    const exerciseProgress: Record<string, any> = {};
    allSessions.forEach((session) => {
      if (!exerciseProgress[session.exerciseName]) {
        exerciseProgress[session.exerciseName] = {
          sessions: 0,
          maxWeight: 0,
          totalVolume: 0,
          avgReps: 0,
        };
      }

      const stats = exerciseProgress[session.exerciseName];
      stats.sessions += 1;

      session.sets.forEach((set) => {
        if (set.weight > stats.maxWeight) {
          stats.maxWeight = set.weight;
        }
        stats.totalVolume += set.weight * set.reps;
        stats.avgReps += set.reps;
      });

      stats.avgReps = Math.round(stats.avgReps / session.sets.length);
    });

    return {
      totalWorkouts: allSessions.length,
      totalSets,
      totalVolume: Math.round(totalVolume),
      averageWeight,
      exerciseProgress,
    };
  }, [history]);

  const topExercises = useMemo(() => {
    return Object.entries(stats.exerciseProgress)
      .sort(([, a], [, b]) => b.maxWeight - a.maxWeight)
      .slice(0, 5);
  }, [stats]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="h-10 w-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-xl">Estatísticas</h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Perfil do Usuário */}
        <UserProfileCard />
        {stats.totalWorkouts === 0 ? (
          <Card className="p-8 text-center">
            <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Nenhum treino registrado ainda. Comece a treinar!
            </p>
          </Card>
        ) : (
          <>
            {/* Seção de Perfil e Evolução */}
            {profile && (
              <>
                <Card className="p-4">
                  <h2 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Meu Perfil
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted p-3 rounded">
                      <p className="text-xs text-muted-foreground mb-1">Peso</p>
                      <p className="text-xl font-bold">{profile.weight} kg</p>
                    </div>
                    <div className="bg-muted p-3 rounded">
                      <p className="text-xs text-muted-foreground mb-1">Altura</p>
                      <p className="text-xl font-bold">{profile.height} cm</p>
                    </div>
                    {getLatestMetrics() && (
                      <>
                        <div className="bg-muted p-3 rounded">
                          <p className="text-xs text-muted-foreground mb-1">IMC</p>
                          <p className="text-xl font-bold">{getLatestMetrics()?.imc}</p>
                        </div>
                        <div className="bg-muted p-3 rounded">
                          <p className="text-xs text-muted-foreground mb-1">Evolução</p>
                          <div className="flex items-center gap-1">
                            {getWeightChange().change < 0 ? (
                              <TrendingDown className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingUp className="w-4 h-4 text-red-600" />
                            )}
                            <p className="font-bold">{Math.abs(getWeightChange().change)} kg</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                {getWeightEvolution().length > 0 && (
                  <Card className="p-4">
                    <h2 className="font-semibold mb-4">Histórico de Peso</h2>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {getWeightEvolution()
                        .slice()
                        .reverse()
                        .map((metric, index) => (
                          <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                            <div>
                              <p className="font-medium">{metric.weight} kg</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(metric.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">IMC: {metric.imc}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </Card>
                )}
              </>
            )}

            {/* Cards de resumo */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Treinos</p>
                <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
              </Card>

              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Séries</p>
                <p className="text-2xl font-bold">{stats.totalSets}</p>
              </Card>

              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Volume Total</p>
                <p className="text-2xl font-bold">{stats.totalVolume} kg</p>
              </Card>

              <Card className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Peso Médio</p>
                <p className="text-2xl font-bold">{stats.averageWeight} kg</p>
              </Card>
            </div>

            {/* Top Exercícios */}
            {topExercises.length > 0 && (
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" />
                  <h2 className="font-semibold">Top Exercícios</h2>
                </div>

                <div className="space-y-3">
                  {topExercises.map(([name, exerciseStats], index) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/exercise/${encodeURIComponent(name)}`)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{name}</p>
                        <p className="text-sm text-muted-foreground">
                          Máx: {exerciseStats.maxWeight} kg • Vol: {exerciseStats.totalVolume} kg
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Todos os exercícios */}
            <Card className="p-4">
              <h2 className="font-semibold mb-4">Todos os Exercícios</h2>
              <div className="space-y-2">
                {Object.entries(stats.exerciseProgress)
                  .sort(([, a], [, b]) => b.sessions - a.sessions)
                  .map(([name, exerciseStats]) => (
                    <div
                      key={name}
                      className="flex justify-between items-center p-2 bg-muted rounded hover:bg-muted/70 cursor-pointer transition-colors"
                      onClick={() => navigate(`/exercise/${encodeURIComponent(name)}`)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exerciseStats.sessions} sessões
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-2">
                        <div>
                          <p className="text-sm font-semibold">
                            {exerciseStats.maxWeight} kg
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Vol: {exerciseStats.totalVolume} kg
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
