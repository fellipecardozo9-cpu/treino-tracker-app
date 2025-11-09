import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, UserStatus } from '@/types/auth';
import { PersonalProfile } from '@/types/app';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Trash2, Edit2, Plus, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  // Agora usa a chave master_exercises
  return JSON.parse(localStorage.getItem('master_exercises') || '[]');
};

const saveExercises = (exercises: any) => {
  localStorage.setItem('master_exercises', JSON.stringify(exercises));
};

export default function MasterAdminDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [pendingPersonal, setPendingPersonal] = useState<User[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('personal'); // Inicia na aba de gestão de Personal Trainers
  const [manualTrainerData, setManualTrainerData] = useState({
    nome: '',
    email: '',
    password: '',
  });

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

  const handleManualTrainerRegister = () => {
    if (!manualTrainerData.nome || !manualTrainerData.email || !manualTrainerData.password) {
      alert('Preencha todos os campos para o cadastro manual.');
      return;
    }

    // Simulação de verificação de email duplicado
    const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
    if (authUsers.some((u: any) => u.email === manualTrainerData.email)) {
      alert('Erro: Já existe um usuário cadastrado com este e-mail.');
      return;
    }

    // 1. Criar o novo usuário (simulação de hash de senha)
    const newUserId = `personal-${Date.now()}`;
    const newUser = {
      id: newUserId,
      email: manualTrainerData.email,
      password_hash: btoa(manualTrainerData.password), // Simulação de hash
      role: 'personal',
      status: 'ativo', // Master Admin já cadastra como ativo
      createdAt: new Date().toISOString(),
    };

    // 2. Criar o perfil do Personal Trainer
    const newTrainerProfile = {
      user_id: newUserId,
      nome: manualTrainerData.nome,
      cref: 'N/A', // Adicionar campo CREF
    };

    // 3. Salvar no localStorage
    localStorage.setItem('auth_users', JSON.stringify([...authUsers, newUser]));
    const personalProfiles = JSON.parse(localStorage.getItem('personal_profiles') || '[]');
    localStorage.setItem('personal_profiles', JSON.stringify([...personalProfiles, newTrainerProfile]));

    // 4. Limpar formulário e atualizar lista de Personal Trainers
    setManualTrainerData({ nome: '', email: '', password: '' });
    loadData();
    alert(`Personal Trainer ${manualTrainerData.nome} cadastrado com sucesso!`);
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
      nome: `Novo Exercício ${exercises.length + 1}`,
      grupoMuscular: 'Outros',
      createdAt: new Date().toISOString(),
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

      {/* Cadastro Manual de Personal Trainer */}
      <Card className="p-6 bg-slate-700 space-y-4">
        <h3 className="text-xl font-bold text-white">Cadastrar Personal Trainer Manualmente</h3>
        <div className="space-y-2">
          <Label htmlFor="nome-trainer" className="text-white">Nome Completo</Label>
          <Input
            id="nome-trainer"
            type="text"
            placeholder="Nome do Personal Trainer"
            value={manualTrainerData.nome}
            onChange={(e) => setManualTrainerData({ ...manualTrainerData, nome: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Label htmlFor="email-trainer" className="text-white">Email</Label>
          <Input
            id="email-trainer"
            type="email"
            placeholder="personal@email.com"
            value={manualTrainerData.email}
            onChange={(e) => setManualTrainerData({ ...manualTrainerData, email: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Label htmlFor="senha-trainer" className="text-white">Senha Inicial</Label>
          <Input
            id="senha-trainer"
            type="password"
            placeholder="Senha"
            value={manualTrainerData.password}
            onChange={(e) => setManualTrainerData({ ...manualTrainerData, password: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Button onClick={handleManualTrainerRegister} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Cadastrar Personal Trainer
          </Button>
        </div>
      </Card>

      <h3 className="text-xl font-bold text-white mt-6">Aprovações Pendentes ({pendingPersonal.length})</h3>
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
              <p className="font-semibold">{ex.nome}</p>
              <Badge variant="secondary" className="bg-slate-600 text-xs">{ex.grupoMuscular}</Badge>
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
