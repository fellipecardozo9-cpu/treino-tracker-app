import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { SetRecord } from '@/types/workout';
import { Plus, Trash2 } from 'lucide-react';

interface SetTrackerProps {
  exerciseName: string;
  targetSets: number;
  targetReps: string;
  onSave: (sets: SetRecord[]) => void;
  initialSets?: SetRecord[];
}

export function SetTracker({
  exerciseName,
  targetSets,
  targetReps,
  onSave,
  initialSets = [],
}: SetTrackerProps) {
  const [sets, setSets] = useState<SetRecord[]>(
    initialSets.length > 0
      ? initialSets
      : Array.from({ length: targetSets }, (_, i) => ({
          setNumber: i + 1,
          reps: parseInt(targetReps.split('–')[0]) || 0,
          weight: 0,
          completed: false,
        }))
  );

  const handleSetChange = (index: number, field: string, value: any) => {
    const newSets = [...sets];
    newSets[index] = {
      ...newSets[index],
      [field]: value,
    };
    setSets(newSets);
  };

  const handleAddSet = () => {
    setSets([
      ...sets,
      {
        setNumber: sets.length + 1,
        reps: 0,
        weight: 0,
        completed: false,
      },
    ]);
  };

  const handleRemoveSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(sets);
  };

  const completedCount = sets.filter((s) => s.completed).length;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">{exerciseName}</h3>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{sets.length} séries
        </span>
      </div>

      <div className="space-y-3">
        {sets.map((set, index) => (
          <div key={index} className="flex gap-2 items-center p-2 bg-muted rounded-lg">
            <Checkbox
              checked={set.completed}
              onCheckedChange={(checked) =>
                handleSetChange(index, 'completed', checked)
              }
              className="w-5 h-5"
            />

            <div className="flex-1 grid grid-cols-3 gap-2">
              <div>
                <label className="text-xs text-muted-foreground">Série</label>
                <Input
                  type="number"
                  value={set.setNumber}
                  onChange={(e) =>
                    handleSetChange(index, 'setNumber', parseInt(e.target.value))
                  }
                  className="h-8"
                  disabled
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Reps</label>
                <Input
                  type="number"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(index, 'reps', parseInt(e.target.value))
                  }
                  placeholder="0"
                  className="h-8"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Peso (kg)</label>
                <Input
                  type="number"
                  step="0.5"
                  value={set.weight}
                  onChange={(e) =>
                    handleSetChange(index, 'weight', parseFloat(e.target.value))
                  }
                  placeholder="0"
                  className="h-8"
                />
              </div>
            </div>

            {sets.length > targetSets && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSet(index)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddSet}
          className="flex-1"
        >
          <Plus className="w-4 h-4 mr-1" />
          Adicionar série
        </Button>

        <Button onClick={handleSave} className="flex-1">
          Salvar
        </Button>
      </div>
    </Card>
  );
}

