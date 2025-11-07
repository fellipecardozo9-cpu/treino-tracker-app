import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (exercise: {
    nome: string;
    series: number;
    reps: number;
    grupo_muscular: string;
    observacao: string;
  }) => void;
}

const MUSCLE_GROUPS = [
  'Peito',
  'Costas',
  'Ombros',
  'Pernas',
  'Bíceps',
  'Tríceps',
  'Abdômen',
  'Antebraço',
  'Glúteos',
  'Panturrilha',
];

export function CreateExerciseDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateExerciseDialogProps) {
  const [nome, setNome] = useState('');
  const [series, setSeries] = useState('3');
  const [reps, setReps] = useState('10');
  const [grupoMuscular, setGrupoMuscular] = useState('');
  const [observacao, setObservacao] = useState('');

  const handleCreate = () => {
    if (!nome.trim() || !grupoMuscular) {
      alert('Preencha nome e grupo muscular');
      return;
    }

    onCreate({
      nome: nome.trim(),
      series: parseInt(series) || 3,
      reps: parseInt(reps) || 10,
      grupo_muscular: grupoMuscular,
      observacao: observacao.trim() || '—',
    });

    // Limpar formulário
    setNome('');
    setSeries('3');
    setReps('10');
    setGrupoMuscular('');
    setObservacao('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Criar Novo Exercício</DialogTitle>
          <DialogDescription>
            Adicione um novo exercício ao banco de dados
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Exercício *</Label>
            <Input
              id="nome"
              placeholder="Ex: Supino Reto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="series">Séries</Label>
              <Input
                id="series"
                type="number"
                min="1"
                max="10"
                value={series}
                onChange={(e) => setSeries(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reps">Repetições</Label>
              <Input
                id="reps"
                type="number"
                min="1"
                max="50"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grupo">Grupo Muscular *</Label>
            <Select value={grupoMuscular} onValueChange={setGrupoMuscular}>
              <SelectTrigger id="grupo">
                <SelectValue placeholder="Selecione um grupo" />
              </SelectTrigger>
              <SelectContent>
                {MUSCLE_GROUPS.map((grupo) => (
                  <SelectItem key={grupo} value={grupo}>
                    {grupo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs">Observação (opcional)</Label>
            <Input
              id="obs"
              placeholder="Ex: Usar barra reta"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleCreate}>Criar Exercício</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

