import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useParams } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Simulação de funções de acesso ao localStorage
const getStudentProfile = (userId: string) => {
  const studentProfiles = JSON.parse(localStorage.getItem('student_profiles') || '[]');
  return studentProfiles.find((s: any) => s.user_id === userId);
};

const getMasterExercises = () => {
  return JSON.parse(localStorage.getItem('master_exercises') || '[]');
};

const getAssignedWorkout = (studentId: string) => {
  const assignedWorkouts = JSON.parse(localStorage.getItem('assigned_workouts') || '[]');
  return assignedWorkouts.find((w: any) => w.aluno_id === studentId);
};

const saveAssignedWorkout = (workout: any) => {
  let assignedWorkouts = JSON.parse(localStorage.getItem('assigned_workouts') || '[]');
  const existingIndex = assignedWorkouts.findIndex((w: any) => w.aluno_id === workout.aluno_id);

  if (existingIndex > -1) {
    assignedWorkouts[existingIndex] = workout;
  } else {
    assignedWorkouts.push(workout);
  }

  localStorage.setItem('assigned_workouts', JSON.stringify(assignedWorkouts));
};

// Estrutura de um exercício no treino
interface WorkoutExercise {
  exercicio_id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga: string;
  observacoes: string;
}

// Estrutura de um bloco de treino
interface WorkoutBlock {
  id: string;
  titulo: string; // Ex: "Peito e Costas"
  exercicios: WorkoutExercise[];
}

// Estrutura do treino atribuído (para o localStorage)
interface AssignedWorkout {
  aluno_id: string;
  personal_id: string;
  data_atribuicao: string;
  blocos: WorkoutBlock[];
  ciclo_count: number; // Novo campo para o contador de 8 treinos
}

export default function AssignWorkout({ studentId }: { studentId: string }) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const [student, setStudent] = useState<any>(null);
  const [masterExercises, setMasterExercises] = useState<any[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string>(''); // Bloco de destino para adicionar exercício
  const [workoutBlocks, setWorkoutBlocks] = useState<WorkoutBlock[]>([]); // Alterado para blocos
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'personal') {
      navigate('/');
      return;
    }

    const studentProfile = getStudentProfile(studentId);
    if (!studentProfile || studentProfile.personal_id !== user.id) {
      alert('Aluno não encontrado ou não pertence a este Personal Trainer.');
      navigate('/personal/dashboard');
      return;
    }
    setStudent(studentProfile);

    const exercises = getMasterExercises();
    setMasterExercises(exercises);

    const assignedWorkout: AssignedWorkout | undefined = getAssignedWorkout(studentId);
    let initialBlocks: WorkoutBlock[];
    if (assignedWorkout) {
      initialBlocks = assignedWorkout.blocos;
    } else {
      // Inicializa com um bloco vazio se não houver treino atribuído
      initialBlocks = [{ id: Date.now().toString(), titulo: 'Treino 1', exercicios: [] }];
    }
    setWorkoutBlocks(initialBlocks);
    setSelectedBlockId(initialBlocks[0].id); // Define o primeiro bloco como padrão

    setLoading(false);
  }, [user, navigate, studentId]);

  const handleAddBlock = () => {
    const newBlock: WorkoutBlock = {
      id: Date.now().toString(),
      titulo: `Treino ${workoutBlocks.length + 1}`,
      exercicios: [],
    };
    setWorkoutBlocks([...workoutBlocks, newBlock]);
  };

  const handleRemoveBlock = (blockId: string) => {
    if (workoutBlocks.length === 1) {
      alert('O treino deve ter pelo menos um bloco.');
      return;
    }
    setWorkoutBlocks(workoutBlocks.filter(block => block.id !== blockId));
  };

  const handleUpdateBlockTitle = (blockId: string, newTitle: string) => {
    setWorkoutBlocks(workoutBlocks.map(block =>
      block.id === blockId ? { ...block, titulo: newTitle } : block
    ));
  };

  const handleAddExercise = (exercise: any) => {
    if (!selectedBlockId) {
      alert('Selecione um bloco de treino para adicionar o exercício.');
      return;
    }
    const blockId = selectedBlockId;
    const newExercise: WorkoutExercise = {
      exercicio_id: exercise.id,
      nome: exercise.nome,
      series: 3,
      repeticoes: '10-12',
      carga: 'Ajustar',
      observacoes: '',
    };

    setWorkoutBlocks(workoutBlocks.map(block =>
      block.id === blockId
        ? { ...block, exercicios: [...block.exercicios, newExercise] }
        : block
    ));
  };

  const handleUpdateExercise = (blockId: string, index: number, field: keyof WorkoutExercise, value: string | number) => {
    setWorkoutBlocks(workoutBlocks.map(block => {
      if (block.id === blockId) {
        const newExercicios = [...block.exercicios];
        (newExercicios[index] as any)[field] = value;
        return { ...block, exercicios: newExercicios };
      }
      return block;
    }));
  };

  const handleRemoveExercise = (blockId: string, index: number) => {
    setWorkoutBlocks(workoutBlocks.map(block => {
      if (block.id === blockId) {
        const newExercicios = block.exercicios.filter((_, i) => i !== index);
        return { ...block, exercicios: newExercicios };
      }
      return block;
    }));
  };

  const handleSaveWorkout = () => {
    if (!student || workoutBlocks.every(block => block.exercicios.length === 0)) {
      alert('O treino deve ter pelo menos um exercício em algum bloco.');
      return;
    }

    const assignedWorkout: AssignedWorkout | undefined = getAssignedWorkout(studentId);

    const newAssignedWorkout: AssignedWorkout = {
      aluno_id: student.user_id,
      personal_id: user?.id || '',
      data_atribuicao: new Date().toISOString(),
      blocos: workoutBlocks,
      ciclo_count: assignedWorkout?.ciclo_count || 0, // Mantém o contador existente ou inicia em 0
    };

    saveAssignedWorkout(newAssignedWorkout);
    alert('Treino atribuído e salvo com sucesso!');
    navigate('/personal/dashboard');
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white p-8">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Button onClick={() => navigate('/personal/dashboard')} variant="ghost" className="text-blue-400 hover:bg-slate-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Dashboard
        </Button>

        <h1 className="text-3xl font-bold mb-2">Atribuir Treino para {student?.nome}</h1>
        <p className="text-slate-400 mb-8">Defina os exercícios, séries e repetições para o aluno.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna 1: Banco de Exercícios */}
          <Card className="p-6 bg-slate-800 lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-slate-700 pb-2">Banco de Exercícios</h2>
            
            {/* Seletor de Bloco de Destino */}
            <div className="space-y-2">
              <Label htmlFor="select-block" className="text-slate-400">Adicionar ao Bloco:</Label>
              <Select value={selectedBlockId} onValueChange={setSelectedBlockId}>
                <SelectTrigger id="select-block" className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione o Bloco" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-white">
                  {workoutBlocks.map(block => (
                    <SelectItem key={block.id} value={block.id}>{block.titulo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de Exercícios Agrupados */}
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              {masterExercises.length > 0 ? (
                Object.entries(
                  masterExercises.reduce((acc, ex) => {
                    const grupo = ex.grupoMuscular || 'Outros';
                    if (!acc[grupo]) {
                      acc[grupo] = [];
                    }
                    acc[grupo].push(ex);
                    return acc;
                  }, {} as Record<string, any[]>)
                ).map(([grupo, exercises]) => (
                  <Accordion key={grupo} type="single" collapsible className="w-full">
                    <AccordionItem value={grupo} className="border-slate-700">
                      <AccordionTrigger className="text-white hover:no-underline bg-slate-700 p-3 rounded-t-md">
                        {grupo} ({exercises.length})
                      </AccordionTrigger>
                      <AccordionContent className="bg-slate-700 p-3 rounded-b-md space-y-2">
                        {exercises.map((ex) => (
                          <div key={ex.id} className="flex justify-between items-center p-2 bg-slate-600 rounded-md">
                            <p className="text-sm">{ex.nome}</p>
                            <Button onClick={() => handleAddExercise(ex)} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))
              ) : (
                <p className="text-slate-400">Nenhum exercício cadastrado no banco mestre.</p>
              )}
            </div>
          </Card>

          {/* Coluna 2 e 3: Treino Atribuído */}
          <Card className="p-6 bg-slate-800 lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <h2 className="text-xl font-bold text-white">Treino Atual ({workoutBlocks.length} Blocos)</h2>
              <div className="flex gap-2">
                <Button onClick={handleAddBlock} variant="outline" className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="w-4 h-4 mr-2" /> Adicionar Bloco
                </Button>
                <Button onClick={handleSaveWorkout} disabled={workoutBlocks.every(block => block.exercicios.length === 0)} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="w-4 h-4 mr-2" /> Salvar Treino
                </Button>
              </div>
            </div>

            {workoutBlocks.length > 0 ? (
              <div className="space-y-6">
                {workoutBlocks.map((block, blockIndex) => (
                  <Card key={block.id} className="p-4 bg-slate-700 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-600 pb-2">
                      <Input
                        type="text"
                        value={block.titulo}
                        onChange={(e) => handleUpdateBlockTitle(block.id, e.target.value)}
                        className="text-lg font-bold bg-transparent border-none focus:ring-0 focus:ring-offset-0 text-white p-0"
                      />
                      <Button onClick={() => handleRemoveBlock(block.id)} variant="ghost" size="sm" className="text-red-400 hover:bg-slate-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {block.exercicios.length > 0 ? (
                      <div className="space-y-3">
                        {block.exercicios.map((ex, index) => (
                          <Card key={index} className="p-3 bg-slate-600 space-y-2">
                            <div className="flex justify-between items-center">
                              <p className="font-semibold text-lg">{index + 1}. {ex.nome}</p>
                              <Button onClick={() => handleRemoveExercise(block.id, index)} variant="ghost" size="sm" className="text-red-400 hover:bg-slate-500">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            
                            <div className="grid grid-cols-4 gap-3">
                              <div>
                                <Label className="text-xs text-slate-400">Séries</Label>
                                <Input
                                  type="number"
                                  value={ex.series}
                                  onChange={(e) => handleUpdateExercise(block.id, index, 'series', parseInt(e.target.value) || 0)}
                                  className="bg-slate-700 border-slate-500 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-slate-400">Repetições</Label>
                                <Input
                                  type="text"
                                  value={ex.repeticoes}
                                  onChange={(e) => handleUpdateExercise(block.id, index, 'repeticoes', e.target.value)}
                                  className="bg-slate-700 border-slate-500 text-white"
                                />
                              </div>
                              <div>
                                <Label className="text-xs text-slate-400">Carga</Label>
                                <Input
                                  type="text"
                                  value={ex.carga}
                                  onChange={(e) => handleUpdateExercise(block.id, index, 'carga', e.target.value)}
                                  className="bg-slate-700 border-slate-500 text-white"
                                />
                              </div>
                              <div className="col-span-4">
                                <Label className="text-xs text-slate-400">Observações</Label>
                                <Input
                                  type="text"
                                  value={ex.observacoes}
                                  onChange={(e) => handleUpdateExercise(block.id, index, 'observacoes', e.target.value)}
                                  className="bg-slate-700 border-slate-500 text-white"
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-center py-4">Nenhum exercício neste bloco. Adicione um do Banco de Exercícios.</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Clique em "Adicionar Bloco" para começar a montar o treino.</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
