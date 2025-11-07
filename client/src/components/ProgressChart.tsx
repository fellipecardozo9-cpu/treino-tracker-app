import { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { ExerciseSession } from '@/types/workout';

interface ProgressChartProps {
  exerciseName: string;
  sessions: ExerciseSession[];
  chartType?: 'line' | 'bar';
}

export function ProgressChart({
  exerciseName,
  sessions,
  chartType = 'line',
}: ProgressChartProps) {
  const chartData = useMemo(() => {
    if (sessions.length === 0) return [];

    return sessions
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((session) => {
        const maxWeight = Math.max(...session.sets.map((s) => s.weight));
        const totalReps = session.sets.reduce((sum, s) => sum + s.reps, 0);
        const totalVolume = session.sets.reduce(
          (sum, s) => sum + s.weight * s.reps,
          0
        );

        return {
          date: new Date(session.date).toLocaleDateString('pt-BR', {
            month: 'short',
            day: 'numeric',
          }),
          maxWeight: parseFloat(maxWeight.toFixed(1)),
          totalReps,
          totalVolume: parseFloat(totalVolume.toFixed(1)),
          fullDate: session.date,
        };
      });
  }, [sessions]);

  if (chartData.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Sem dados de progresso para {exerciseName}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">{exerciseName}</h3>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="maxWeight"
              stroke="#3b82f6"
              name="Peso Máx (kg)"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="totalVolume"
              stroke="#10b981"
              name="Volume Total (kg)"
              dot={{ r: 4 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="maxWeight" fill="#3b82f6" name="Peso Máx (kg)" />
            <Bar dataKey="totalVolume" fill="#10b981" name="Volume Total (kg)" />
          </BarChart>
        )}
      </ResponsiveContainer>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
        <div className="p-2 bg-muted rounded">
          <p className="text-xs text-muted-foreground">Última Sessão</p>
          <p className="font-semibold">
            {chartData[chartData.length - 1].maxWeight} kg
          </p>
        </div>
        <div className="p-2 bg-muted rounded">
          <p className="text-xs text-muted-foreground">Melhor Carga</p>
          <p className="font-semibold">
            {Math.max(...chartData.map((d) => d.maxWeight))} kg
          </p>
        </div>
        <div className="p-2 bg-muted rounded">
          <p className="text-xs text-muted-foreground">Sessões</p>
          <p className="font-semibold">{chartData.length}</p>
        </div>
      </div>
    </Card>
  );
}

