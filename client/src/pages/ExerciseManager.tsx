import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useExerciseDatabase } from '@/hooks/useExerciseDatabase';
import { ArrowLeft, Plus, Trash2, Edit2 } from 'lucide-react';

export default function ExerciseManager() {
  const [, navigate] = useLocation();
  const {
    store,
    addExercise,
    deleteExercise,
    updateExercise,
    getAllGroups,
  } = useExerciseDatabase();

  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    grupoMuscular: '',
    descricao: '',
  });

  const groups = getAllGroups();
  const filteredExercises = selectedGroup
    ? store.exercises.filter((ex) => ex.grupoMuscular === selectedGroup)
    : store.exercises;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.grupoMuscular) return;

    if (editingId) {
      updateExercise(editingId, {
        nome: formData.nome,
        grupoMuscular: formData.grupoMuscular,
        descricao: formData.descricao,
      });
      setEditingId(null);
    } else {
      addExercise({
        nome: formData.nome,
        grupoMuscular: formData.grupoMuscular,
        descricao: formData.descricao,
      });
    }

    setFormData({ nome: '', grupoMuscular: '', descricao: '' });
    setShowForm(false);
  };

  const handleEdit = (id: string) => {
    const exercise = store.exercises.find((ex) => ex.id === id);
    if (exercise) {
      setFormData({
        nome: exercise.nome,
        grupoMuscular: exercise.grupoMuscular,
        descricao: exercise.descricao || '',
      });
      setEditingId(id);
      setShowForm(true);
    }
  };

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
          <h1 className="font-bold text-xl">Gerenciar Exercícios</h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Filtro */}
        <div className="flex gap-2">
          <Select value={selectedGroup || 'all'} onValueChange={(value) => setSelectedGroup(value === 'all' ? '' : value)}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Filtrar por grupo muscular" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              {groups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => {
              setFormData({ nome: '', grupoMuscular: '', descricao: '' });
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="p-4 space-y-3">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nome do Exercício</label>
                <Input
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Supino Reto"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Grupo Muscular</label>
                <Select
                  value={formData.grupoMuscular}
                  onValueChange={(value) =>
                    setFormData({ ...formData, grupoMuscular: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                    <SelectItem value="Novo Grupo">+ Novo Grupo</SelectItem>
                  </SelectContent>
                </Select>
                {formData.grupoMuscular === 'Novo Grupo' && (
                  <Input
                    placeholder="Nome do novo grupo"
                    onChange={(e) =>
                      setFormData({ ...formData, grupoMuscular: e.target.value })
                    }
                    className="mt-2"
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Descrição (opcional)</label>
                <Input
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Ex: Exercício para peito"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Lista de Exercícios */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-semibold">
            {filteredExercises.length} exercício(s)
          </p>

          {filteredExercises.map((exercise) => (
            <Card key={exercise.id} className="p-3 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{exercise.nome}</p>
                <p className="text-xs text-muted-foreground">
                  {exercise.grupoMuscular}
                </p>
                {exercise.descricao && (
                  <p className="text-xs text-muted-foreground italic">
                    {exercise.descricao}
                  </p>
                )}
              </div>

              <div className="flex gap-2 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(exercise.id)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExercise(exercise.id)}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

