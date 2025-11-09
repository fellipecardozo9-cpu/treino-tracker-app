import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserStatus } from '@/types/auth';
import { PersonalProfile } from '@/types/app';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Trash2, Edit2, Plus, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';

// Simulação de funções de gestão
const getPendingPersonal = (): User[] => {
  const users = JSON.parse(localStorage.getItem('auth_users') || '[]');
  const personalProfiles = JSON.parse(localStorage.getItem('personal_profiles') || '[]');
  
  return users
    .filter((u: User) => u.role === 'personal' && u.status === 'pendente')
    .map((u: User) => {
      const profile = personalProfiles.find((p: PersonalProfile) => p.user_id === u.id);
      return { ...u, profile };
    });
};

const updatePersonalStatus = (userId: string, status: UserStatus) => {
  const users = JSON.parse(localStorage.getItem('auth_users') || '[]');
  const updatedUsers = users.map((u: User) => 
    u.id === userId ? { ...u, status } : u
  );
  localStorage.setItem('auth_users', JSON.stringify(updatedUsers));
};

const getExercises = () => {
  return JSON.parse(localStorage.getItem('exercises') || '[]');
};

const saveExercises = (exercises: any) => {
  localStorage.setItem('exercises', JSON.stringify(exercises));
};

const initialExercises = [
  { id: 'ex1', nome_exercicio: 'Supino Reto', grupo_muscular: 'Peito', link_video: 'link1', descricao: 'Descrição 1' },
  { id: 'ex2', nome_exercicio: 'Agachamento Livre', grupo_muscular: 'Pernas', link_video: 'link2', descricao: 'Descrição 2' },
  { id: 'ex3', nome_exercicio: 'Remada Curvada', grupo_muscular: 'Costas', link_video: 'link3', descricao: 'Descrição 3' },
];

if (!localStorage.getItem('exercises')) {
  localStorage.setItem('exercises', JSON.stringify(initialExercises));
}

export default function MasterAdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [pendingPersonal, setPendingPersonal] = useState<User[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (user?.role !== 'master') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    setPendingPersonal(getPendingPersonal());
    setExercises(getExercises());
  };

  const handleStatusChange = (userId: string, status: UserStatus) => {
    updatePersonalStatus(userId, status);
    loadData();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Funções de gestão de exercícios
  const handleAddExercise = () => {
    // Simulação de adição de exercício
    const newEx = {
      id: Date.now().toString(),
      nome_exercicio: `Novo Exercício ${exercises.length + 1}`,
      grupo_muscular: 'Outros',
      link_video: '',
      descricao: '',
    };
    const updatedExercises = [...exercises, newEx];
    saveExercises(updatedExercises);
    setExercises(updatedExercises);
  };

  const handleDeleteExercise = (id: string) => {
    const updatedExercises = exercises.filter(ex => ex.id !== id);
    saveExercises(updatedExercises);
    setExercises(updatedExercises);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Visão Geral do Sistema</h2>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-700 text-white">
          <p className="text-sm text-slate-400">Personal Trainers Pendentes</p>
          <p className="text-3xl font-bold">{pendingPersonal.length}</p>
        </Card>
        {/* Outros KPIs */}
      </div>
    </div>
  );

  const renderPersonalManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gestão de Personal Trainers</h2>
      {pendingPersonal.length === 0 ? (
        <p className="text-slate-400">Nenhum Personal Trainer pendente de aprovação.</p>
      ) : (
        <div className="space-y-4">
          {pendingPersonal.map((p: any) => (
            <Card key={p.id} className="p-4 bg-slate-700 border-l-4 border-yellow-500 text-white flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.profile?.nome || 'Nome não informado'}</p>
                <p className="text-sm text-slate-400">{p.email}</p>
                <p className="text-xs text-slate-500">CREF: {p.profile?.cref || 'N/A'}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  className="text-green-400 hover:bg-green-900"
                  onClick={() => handleStatusChange(p.id, 'ativo')}
                >
                  <Check className="w-4 h-4 mr-2" /> Aprovar
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-red-400 hover:bg-red-900"
                  onClick={() => handleStatusChange(p.id, 'rejeitado')}
                >
                  <X className="w-4 h-4 mr-2" /> Rejeitar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderExerciseManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Banco de Exercícios Central</h2>
      <Button onClick={handleAddExercise} className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" /> Adicionar Novo
      </Button>
      <div className="space-y-4">
        {exercises.map((ex) => (
          <Card key={ex.id} className="p-4 bg-slate-700 text-white flex justify-between items-center">
            <div>
              <p className="font-semibold">{ex.nome_exercicio}</p>
              <Badge variant="secondary" className="bg-slate-600 text-xs">{ex.grupo_muscular}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-600">
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-900" onClick={() => handleDeleteExercise(ex.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-800 p-6 space-y-6 border-r border-slate-700">
        <h1 className="text-2xl font-bold text-white">Master Admin</h1>
        <nav className="space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'dashboard' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'personal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('personal')}
          >
            Gestão Personal 
            {pendingPersonal.length > 0 && <Badge className="ml-2 bg-yellow-500">{pendingPersonal.length}</Badge>}
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'exercises' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('exercises')}
          >
            Banco de Exercícios
          </Button>
        </nav>
        <Button onClick={handleLogout} className="w-full justify-start bg-red-600 hover:bg-red-700">
          <LogOut className="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'personal' && renderPersonalManagement()}
        {activeTab === 'exercises' && renderExerciseManagement()}
      </div>
    </div>
  );
}
