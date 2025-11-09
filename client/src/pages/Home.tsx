import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, BarChart3, Play, Edit2, User as UserIcon } from 'lucide-react';

export default function Home() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [assignedWorkout, setAssignedWorkout] = useState<any>(null);

  useEffect(() => {
    if (user?.role === 'master') {
      navigate('/master/dashboard');
      return;
    } else if (user?.role === 'personal') {
      navigate('/personal/dashboard');
      return;
    }

    // Lógica para Aluno
    if (user?.role === 'aluno') {
      const workouts = JSON.parse(localStorage.getItem('assigned_workouts') || '[]');
      const currentWorkout = workouts.find((w: any) => w.aluno_id === user.id);
      setAssignedWorkout(currentWorkout);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartWorkout = () => {
    // Por enquanto, apenas um alerta. A lógica de rastreamento será implementada depois.
    alert('Funcionalidade de iniciar treino em desenvolvimento.');
  };

  const renderWorkout = () => {
    if (!assignedWorkout || assignedWorkout.treino.length === 0) {
      return (
        <Card className="p-6 bg-slate-800 text-white text-center">
          <p className="text-xl font-semibold mb-2">Nenhum treino atribuído.</p>
          <p className="text-slate-400">Seu Personal Trainer ainda não montou seu treino. Entre em contato!</p>
        </Card>
      );
    }

    return (
      <Card className="p-6 bg-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-700 pb-2">
          <h2 className="text-2xl font-bold text-white">Seu Treino Atual</h2>
          <Button onClick={handleStartWorkout} className="bg-green-600 hover:bg-green-700">
            <Play className="w-4 h-4 mr-2" /> Iniciar Treino
          </Button>
        </div>

        <p className="text-sm text-slate-400">Atribuído em: {new Date(assignedWorkout.data_atribuicao).toLocaleDateString()}</p>

        <div className="space-y-3">
          {assignedWorkout.treino.map((ex: any, index: number) => (
            <div key={index} className="p-3 bg-slate-700 rounded-md flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">{index + 1}. {ex.nome}</p>
                <p className="text-sm text-slate-400">
                  {ex.series} Séries de {ex.repeticoes} ({ex.carga})
                </p>
                {ex.observacoes && (
                  <p className="text-xs text-yellow-400 mt-1">Obs: {ex.observacoes}</p>
                )}
              </div>
              <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-slate-600">
                <Edit2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  if (user?.role !== 'aluno') {
    return null; // Redirecionamento já tratado no useEffect
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/everstrong-logo.png" alt="Everstrong" className="w-10 h-10" />
            <h1 className="text-xl font-bold text-white">Everstrong</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/workout-manager')}
              className="text-white hover:bg-slate-700"
              title="Gerenciar treinos"
            >
              {/* Removido Settings, pois o aluno não deve gerenciar treinos */}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-slate-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Bem-vindo, {user?.email?.split('@')[0] || 'Usuário'}</h2>
          <p className="text-slate-400">Seu treino personalizado está pronto!</p>
        </div>

        {/* Botão de Estatísticas */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/statistics')}
            className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <BarChart3 className="w-4 h-4" />
            Meu Perfil e Estatísticas
          </Button>
        </div>

        {renderWorkout()}
      </div>
    </div>
  );
}
