import { useState } from 'react';
import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useWorkoutData } from '@/hooks/useWorkoutData';
import { useSequentialWorkoutProgress } from '@/hooks/useSequentialWorkoutProgress';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Settings, BarChart3 } from 'lucide-react';

const DAYS = ['segunda', 'terça', 'quarta', 'quinta', 'sexta'];
const DAYS_LABEL = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

export default function Home() {
  const [, navigate] = useLocation();
  const { data, loading } = useWorkoutData();
  const { isDayUnlocked, getCurrentWeek, getCurrentDay, isWorkoutCompleted } = useSequentialWorkoutProgress();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleWeekClick = (day: string, week: number) => {
    navigate(`/workout/${day}/${week}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  const currentWeek = getCurrentWeek();
  const currentDay = getCurrentDay();
  const workoutCompleted = isWorkoutCompleted(); // Forçar novo hash para cache

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
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
              <Settings className="w-4 h-4" />
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
          <p className="text-slate-400">
            {workoutCompleted
              ? '🎉 Parabéns! Você completou todas as 8 semanas!'
              : `Progresso: ${currentDay} - Semana ${currentWeek}/8`}
          </p>
        </div>

        {/* Botão de Estatísticas */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/statistics')}
            className="w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <BarChart3 className="w-4 h-4" />
            Ver Estatísticas Completas
          </Button>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-1 gap-6">
          {DAYS.map((day, index) => {
            const dayLabel = DAYS_LABEL[index];

            return (
              <Card key={day} className="bg-slate-800 border-slate-700 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-white capitalize">{data?.workoutPrograms?.[0]?.dias?.[index]?.titulo || DAYS_LABEL[index]}</h3>
                  <p className="text-sm text-slate-400">
                    {day === currentDay.toLowerCase() ? `Dia atual - Semana ${currentWeek}` : `Semana ${currentWeek}`}
                  </p>
                </div>

                {/* Week Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((week) => {
                    const isUnlocked = isDayUnlocked(dayLabel, week);
                    const isCurrent = dayLabel === currentDay && week === currentWeek;

                    return (
                      <button
                        key={week}
                        onClick={() => isUnlocked && handleWeekClick(dayLabel, week)}
                        disabled={!isUnlocked}
                        className={`
                          py-3 px-2 rounded-lg font-semibold text-sm transition-all
                          ${!isUnlocked
                            ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                            : isCurrent
                            ? 'bg-blue-600 text-white hover:bg-blue-700 ring-2 ring-blue-400'
                            : 'bg-slate-700 text-white hover:bg-slate-600'
                          }
                        `}
                      >
                        {week}
                      </button>
                    );
                  })}
                </div>

                {/* Status */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  {dayLabel === currentDay && dayLabel === 'Sexta' && currentWeek === 8 ? (
                    <p className="text-green-400 text-sm font-semibold">✓ Última semana - Sexta 8/8</p>
                  ) : dayLabel === currentDay ? (
                    <p className="text-blue-400 text-sm font-semibold">→ Próximo treino</p>
                  ) : (
                    <p className="text-slate-400 text-sm">
                      {isDayUnlocked(dayLabel, currentWeek) ? 'Liberado' : 'Bloqueado'}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
