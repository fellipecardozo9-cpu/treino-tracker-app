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
import { ArrowLeft, Plus, Trash2, Edit2, Check } from 'lucide-react';

const DAYS_OF_WEEK = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export default function WorkoutManager() {
  const [, navigate] = useLocation();
  const {
    store,
    addWorkoutProgram,
    updateWorkoutProgram,
    deleteWorkoutProgram,
    setActiveWorkout,
    getActiveWorkout,
    getExercisesByGroup,
    getAllGroups,
  } = useExerciseDatabase();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
  });

  const [selectedDayForEdit, setSelectedDayForEdit] = useState<string | null>(null);
  const [editingExercise, setEditingExercise] = useState<{ dayIndex: number; exIndex: number } | null>(null);
  const [selectedExerciseGroup, setSelectedExerciseGroup] = useState<string>('');

  const activeWorkout = getActiveWorkout();
  const groups = getAllGroups();

  const handleCreateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) return;

    const newProgram = addWorkoutProgram({
      nome: formData.nome,
      descricao: formData.descricao,
      dias: DAYS_OF_WEEK.map((dia) => ({
        dia,
        titulo: `${dia} - Selecione exercícios`,
        exercicios: [],
      })),
    });

    setFormData({ nome: '', descricao: '' });
    setShowForm(false);
  };

  const handleAddExerciseToDay = (dayIndex: number, exerciseId: string) => {
    if (!activeWorkout) return;

    const exercise = store.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    const updatedDays = [...activeWorkout.dias];
    updatedDays[dayIndex].exercicios.push({
      exerciseId,
      nome: exercise.nome,
      series: 0, // Inicia com 0 para forçar a edição
      reps: '', // Inicia vazio para forçar a edição
      observacao: '',
    });

    updateWorkoutProgram(activeWorkout.id, { dias: updatedDays });
  };

  const handleRemoveExerciseFromDay = (dayIndex: number, exerciseIndex: number) => {
    if (!activeWorkout) return;

    const updatedDays = [...activeWorkout.dias];
    updatedDays[dayIndex].exercicios.splice(exerciseIndex, 1);

    updateWorkoutProgram(activeWorkout.id, { dias: updatedDays });
  };

  const handleUpdateExerciseInDay = (
    dayIndex: number,
    exerciseIndex: number,
    field: string,
    value: any
  ) => {
    if (!activeWorkout) return;

    const updatedDays = [...activeWorkout.dias];
    updatedDays[dayIndex].exercicios[exerciseIndex] = {
      ...updatedDays[dayIndex].exercicios[exerciseIndex],
      [field]: value,
    };

    updateWorkoutProgram(activeWorkout.id, { dias: updatedDays });
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
          <h1 className="font-bold text-xl">Gerenciar Treinos</h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Seleção de Treino */}
        {store.workoutPrograms.length > 0 && (
          <Card className="p-4">
            <p className="text-sm text-muted-foreground mb-2">Treino Ativo</p>
            <Select
              value={activeWorkout?.id || ''}
              onValueChange={(id) => setActiveWorkout(id)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um treino" />
              </SelectTrigger>
              <SelectContent>
                {store.workoutPrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        )}

        {/* Botão Novo Treino */}
        <Button onClick={() => setShowForm(!showForm)} className="w-full gap-2">
          <Plus className="w-4 h-4" />
          Novo Treino
        </Button>

        {/* Formulário Novo Treino */}
        {showForm && (
          <Card className="p-4 space-y-3">
            <form onSubmit={handleCreateWorkout} className="space-y-3">
              <div>
                <label className="text-sm font-medium">Nome do Treino</label>
                <Input
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  placeholder="Ex: Treino Avançado Fase 2"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descrição (opcional)</label>
                <Input
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  placeholder="Ex: 8 semanas de treino"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Criar Treino
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Editor de Treino */}
        {activeWorkout && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg">{activeWorkout.nome}</h2>
                {activeWorkout.descricao && (
                  <p className="text-sm text-muted-foreground">
                    {activeWorkout.descricao}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  deleteWorkoutProgram(activeWorkout.id);
                  setActiveWorkout(null);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Dias da Semana */}
            {activeWorkout.dias.map((day, dayIndex) => (
              <Card key={dayIndex} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{day.dia}</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setSelectedDayForEdit(
                        selectedDayForEdit === day.dia ? null : day.dia
                      )
                    }
                  >
                    {selectedDayForEdit === day.dia ? 'Fechar' : 'Editar'}
                  </Button>
                </div>

                {/* Exercícios do Dia */}
                <div className="space-y-2">
                  {day.exercicios.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">
                      Nenhum exercício adicionado
                    </p>
                  ) : (
                    day.exercicios.map((exercise, exIndex) => (
                      {editingExercise && editingExercise.dayIndex === dayIndex && editingExercise.exIndex === exIndex ? (
                        <Card className="p-3 space-y-2">
                          <p className="font-medium">{exercise.nome}</p>
                          <div className="flex gap-2">
                            <Input
                              type="number"
                              placeholder="Séries"
                              value={exercise.series || ''}
                              onChange={(e) =>
                                handleUpdateExerciseInDay(
                                  dayIndex,
                                  exIndex,
                                  'series',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-1/3"
                            />
                            <Input
                              type="text"
                              placeholder="Repetições (ex: 8-12)"
                              value={exercise.reps}
                              onChange={(e) =>
                                handleUpdateExerciseInDay(
                                  dayIndex,
                                  exIndex,
                                  'reps',
                                  e.target.value
                                )
                              }
                              className="w-2/3"
                            />
                          </div>
                          <Input
                            type="text"
                            placeholder="Observação (ex: Foco na excêntrica)"
                            value={exercise.observacao}
                            onChange={(e) =>
                              handleUpdateExerciseInDay(
                                dayIndex,
                                exIndex,
                                'observacao',
                                e.target.value
                              )
                            }
                          />
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => setEditingExercise(null)}
                          >
                            <Check className="w-4 h-4 mr-2" /> Salvar
                          </Button>
                        </Card>
                      ) : (
                        <div
                          key={exIndex}
                          className="p-2 bg-muted rounded flex items-center justify-between"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{exercise.nome}</p>
                            <p className="text-xs text-muted-foreground">
                              {exercise.series} x {exercise.reps}
                            </p>
                            {exercise.observacao && (
                              <p className="text-xs text-muted-foreground italic">
                                {exercise.observacao}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingExercise({ dayIndex, exIndex })}
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleRemoveExerciseFromDay(dayIndex, exIndex)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      )}
                    ))
                  )}
                </div>

                {/* Adicionar Exercício */}
                {selectedDayForEdit === day.dia && (
                  <div className="space-y-2 pt-2 border-t">
                    <p className="text-sm font-medium">Adicionar Exercício</p>
                    <Select
                      value={selectedExerciseGroup}
                      onValueChange={setSelectedExerciseGroup}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione grupo muscular" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedExerciseGroup && (
                      <div className="space-y-1">
                        {getExercisesByGroup(selectedExerciseGroup).map(
                          (exercise) => (
                            <Button
                              key={exercise.id}
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                handleAddExerciseToDay(dayIndex, exercise.id);
                                setSelectedExerciseGroup('');
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              {exercise.nome}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* Lista de Treinos */}
        {store.workoutPrograms.length > 0 && (
          <Card className="p-4">
            <p className="font-semibold mb-3">Todos os Treinos</p>
            <div className="space-y-2">
              {store.workoutPrograms.map((program) => (
                <div
                  key={program.id}
                  className="flex items-center justify-between p-2 bg-muted rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium">{program.nome}</p>
                    <p className="text-xs text-muted-foreground">
                      {program.dias.reduce((sum, day) => sum + day.exercicios.length, 0)} exercícios
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveWorkout(program.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
