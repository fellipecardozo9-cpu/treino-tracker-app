import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useParams } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

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

export default function AssignWorkout({ studentId }: { studentId: string }) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const [student, setStudent] = useState<any>(null);
  const [masterExercises, setMasterExercises] = useState<any[]>([]);
  const [workout, setWorkout] = useState<WorkoutExercise[]>([]);
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

    const assignedWorkout = getAssignedWorkout(studentId);
    if (assignedWorkout) {
      setWorkout(assignedWorkout.treino);
    }

    setLoading(false);
  }, [user, navigate, studentId]);

  const handleAddExercise = (exercise: any) => {
    const newExercise: WorkoutExercise = {
      exercicio_id: exercise.id,
      nome: exercise.nome,
      series: 3,
      repeticoes: '10-12',
      carga: 'Ajustar',
      observacoes: '',
    };
    setWorkout([...workout, newExercise]);
  };

  const handleUpdateExercise = (index: number, field: keyof WorkoutExercise, value: string | number) => {
    const newWorkout = [...workout];
    (newWorkout[index] as any)[field] = value;
    setWorkout(newWorkout);
  };

  const handleRemoveExercise = (index: number) => {
    const newWorkout = workout.filter((_, i) => i !== index);
    setWorkout(newWorkout);
  };

  const handleSaveWorkout = () => {
    if (!student) return;

    const newAssignedWorkout = {
      aluno_id: student.user_id,
      personal_id: user?.id,
      data_atribuicao: new Date().toISOString(),
      treino: workout,
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
            <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
              {masterExercises.length > 0 ? (
                masterExercises.map((ex) => (
                  <div key={ex.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-md">
                    <p className="text-sm">{ex.nome}</p>
                    <Button onClick={() => handleAddExercise(ex)} size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">Nenhum exercício cadastrado no banco mestre.</p>
              )}
            </div>
          </Card>

          {/* Coluna 2 e 3: Treino Atribuído */}
          <Card className="p-6 bg-slate-800 lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-700 pb-2">
              <h2 className="text-xl font-bold text-white">Treino Atual ({workout.length} exercícios)</h2>
              <Button onClick={handleSaveWorkout} disabled={workout.length === 0} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" /> Salvar Treino
              </Button>
            </div>

            <div className="space-y-4">
              {workout.length > 0 ? (
                workout.map((ex, index) => (
                  <Card key={index} className="p-4 bg-slate-700 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg">{index + 1}. {ex.nome}</h3>
                      <Button onClick={() => handleRemoveExercise(index)} variant="ghost" size="sm" className="text-red-400 hover:bg-red-900">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`series-${index}`} className="text-slate-400">Séries</Label>
                        <Input
                          id={`series-${index}`}
                          type="number"
                          value={ex.series}
                          onChange={(e) => handleUpdateExercise(index, 'series', parseInt(e.target.value))}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`reps-${index}`} className="text-slate-400">Repetições</Label>
                        <Input
                          id={`reps-${index}`}
                          type="text"
                          value={ex.repeticoes}
                          onChange={(e) => handleUpdateExercise(index, 'repeticoes', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`carga-${index}`} className="text-slate-400">Carga</Label>
                        <Input
                          id={`carga-${index}`}
                          type="text"
                          value={ex.carga}
                          onChange={(e) => handleUpdateExercise(index, 'carga', e.target.value)}
                          className="bg-slate-600 border-slate-500 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`obs-${index}`} className="text-slate-400">Observações</Label>
                      <Input
                        id={`obs-${index}`}
                        type="text"
                        value={ex.observacoes}
                        onChange={(e) => handleUpdateExercise(index, 'observacoes', e.target.value)}
                        className="bg-slate-600 border-slate-500 text-white"
                      />
                    </div>
                  </Card>
                ))
              ) : (
                <p className="text-slate-400 text-center py-10">Use o Banco de Exercícios ao lado para montar o treino.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
