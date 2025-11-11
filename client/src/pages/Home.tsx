import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, BarChart3, Play, Edit2, User as UserIcon, Trash2, CheckCircle, XCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function Home() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [assignedWorkout, setAssignedWorkout] = useState<any>(null);
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null); // Para controlar qual bloco está aberto/ativo
  const [weeklyProgress, setWeeklyProgress] = useState<Record<number, boolean>>({}); // 0=Dom, 1=Seg, ..., 6=Sáb

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

      // Lógica para o progresso semanal
      const completedWorkouts = JSON.parse(localStorage.getItem('completed_workouts') || '[]');
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo da semana atual

      const progress: Record<number, boolean> = {};
      for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayString = day.toISOString().split('T')[0];
        
        const hasCompletedWorkout = completedWorkouts.some((cw: any) => 
          cw.user_id === user.id && cw.date === dayString
        );
        progress[i] = hasCompletedWorkout;
      }
      setWeeklyProgress(progress);
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStartWorkout = (blockId: string) => {
    // Navega para a página de rastreamento, passando o ID do bloco de treino
    navigate(`/track/${blockId}`);
  };

  const renderWorkout = () => {
    if (!assignedWorkout || assignedWorkout.blocos.length === 0) {
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
        </div>

        <p className="text-sm text-slate-400">Atribuído em: {new Date(assignedWorkout.data_atribuicao).toLocaleDateString()}</p>
        <p className="text-sm text-slate-400">Ciclo de Treino: {assignedWorkout.ciclo_count || 0} / 8</p>

        <Accordion type="single" collapsible className="w-full space-y-2">
          {assignedWorkout.blocos.map((block: any) => (
            <AccordionItem key={block.id} value={block.id} className="border-slate-700 bg-slate-700 rounded-md">
              <AccordionTrigger className="text-white hover:no-underline p-4">
                <div className="flex justify-between items-center w-full pr-8">
                  <span className="font-bold text-lg">{block.titulo} ({block.exercicios.length} exercícios)</span>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que o Accordion feche/abra
                      handleStartWorkout(block.id);
                    }} 
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Play className="w-4 h-4 mr-2" /> Iniciar Treino
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 space-y-3 border-t border-slate-600">
                {block.exercicios.map((ex: any, index: number) => (
                  <div key={index} className="p-3 bg-slate-600 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-lg">{index + 1}. {ex.nome}</p>
                      <p className="text-sm text-slate-400">
                        {ex.series} Séries de {ex.repeticoes} ({ex.carga})
                      </p>
                      {ex.observacoes && (
                        <p className="text-xs text-yellow-400 mt-1">Obs: {ex.observacoes}</p>
                      )}
                    </div>
                    {/* Botão de edição removido, pois o aluno não deve editar o treino */}
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
	              {/* Removido o botão de Gerenciar Treinos para o Aluno */}
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

        {/* Indicador de Progresso Semanal */}
        <Card className="p-4 bg-slate-800 mb-8">
          <h3 className="text-lg font-bold text-white mb-3">Progresso Semanal</h3>
          <div className="flex justify-between">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, index) => (
              <div key={day} className="flex flex-col items-center">
                <p className="text-sm text-slate-400 mb-1">{day}</p>
                {weeklyProgress[index] ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
            ))}
          </div>
        </Card>

        {renderWorkout()}
      </div>
    </div>
  );
}
