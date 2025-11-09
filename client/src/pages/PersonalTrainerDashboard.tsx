import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Plus, Send, Trash2, Edit2, User as UserIcon, LogOut } from 'lucide-react';
import { useLocation } from 'wouter';

// Simulação de funções de gestão de alunos e convites
const getStudents = (personalId: string) => {
  const studentProfiles = JSON.parse(localStorage.getItem('student_profiles') || '[]');
  return studentProfiles.filter((s: any) => s.personal_id === personalId);
};

const getInvitations = (personalId: string) => {
  return JSON.parse(localStorage.getItem('invitations') || '[]').filter((i: any) => i.personal_id === personalId);
};

const saveInvitations = (invitations: any) => {
  localStorage.setItem('invitations', JSON.stringify(invitations));
};

const generateInviteToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export default function PersonalTrainerDashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [students, setStudents] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [emailToInvite, setEmailToInvite] = useState('');
  const [activeTab, setActiveTab] = useState('students');
  const [manualStudentData, setManualStudentData] = useState({
    nome: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (user?.role !== 'personal' || user?.status !== 'ativo') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    if (user) {
      setStudents(getStudents(user.id));
      setInvitations(getInvitations(user.id));
    }
  };

  const handleGenerateInvite = () => {
    if (!user || !emailToInvite) return;

    // Simulação de verificação de email duplicado
    const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
    if (authUsers.some((u: any) => u.email === emailToInvite)) {
      alert('Erro: Já existe um usuário cadastrado com este e-mail.');
      return;
    }

    const token = generateInviteToken();
    const newInvite = {
      id: Date.now().toString(),
      personal_id: user.id,
      token_convite: token,
      email_aluno: emailToInvite,
      status: 'pendente',
      link: `${window.location.origin}/invite/${token}`,
    };

    const updatedInvitations = [...invitations, newInvite];
    saveInvitations(updatedInvitations);
    setInvitations(updatedInvitations);
    setEmailToInvite('');
    alert('Link de convite gerado e copiado para a área de transferência!');
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link de convite copiado!');
  };

  const handleManualStudentRegister = () => {
    if (!user || !manualStudentData.nome || !manualStudentData.email || !manualStudentData.password) {
      alert('Preencha todos os campos para o cadastro manual.');
      return;
    }

    // Simulação de verificação de email duplicado
    const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
    if (authUsers.some((u: any) => u.email === manualStudentData.email)) {
      alert('Erro: Já existe um usuário cadastrado com este e-mail.');
      return;
    }

    // 1. Criar o novo usuário (simulação de hash de senha)
    const newUserId = `aluno-${Date.now()}`;
    const newUser = {
      id: newUserId,
      email: manualStudentData.email,
      password_hash: btoa(manualStudentData.password), // Simulação de hash
      role: 'aluno',
      status: 'ativo',
      createdAt: new Date().toISOString(),
    };

    // 2. Criar o perfil do aluno
    const newStudentProfile = {
      user_id: newUserId,
      personal_id: user.id,
      nome: manualStudentData.nome,
      data_nascimento: 'N/A',
      peso: 0,
      altura: 0,
    };

    // 3. Salvar no localStorage
    localStorage.setItem('auth_users', JSON.stringify([...authUsers, newUser]));
    const studentProfiles = JSON.parse(localStorage.getItem('student_profiles') || '[]');
    localStorage.setItem('student_profiles', JSON.stringify([...studentProfiles, newStudentProfile]));

    // 4. Limpar formulário e atualizar lista de alunos
    setManualStudentData({ nome: '', email: '', password: '' });
    loadData();
    alert(`Aluno ${manualStudentData.nome} cadastrado com sucesso!`);
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir o aluno ${studentName}? Esta ação é irreversível.`)) {
      return;
    }

    // 1. Remover do student_profiles
    let studentProfiles = JSON.parse(localStorage.getItem('student_profiles') || '[]');
    studentProfiles = studentProfiles.filter((s: any) => s.user_id !== studentId);
    localStorage.setItem('student_profiles', JSON.stringify(studentProfiles));

    // 2. Remover do auth_users
    let authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
    authUsers = authUsers.filter((u: any) => u.id !== studentId);
    localStorage.setItem('auth_users', JSON.stringify(authUsers));

    // 3. Remover assigned_workouts (opcional, mas recomendado)
    let assignedWorkouts = JSON.parse(localStorage.getItem('assigned_workouts') || '[]');
    assignedWorkouts = assignedWorkouts.filter((w: any) => w.aluno_id !== studentId);
    localStorage.setItem('assigned_workouts', JSON.stringify(assignedWorkouts));

    // 4. Atualizar a lista na tela
    loadData();
    alert(`Aluno ${studentName} excluído com sucesso.`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderStudentManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Meus Alunos</h2>
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-700 text-white">
          <p className="text-sm text-slate-400">Total de Alunos</p>
          <p className="text-3xl font-bold">{students.length}</p>
        </Card>
        {/* Outros KPIs */}
      </div>
      
      <div className="space-y-4">
        {students.map((s: any) => (
          <Card key={s.user_id} className="p-4 bg-slate-700 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <UserIcon className="w-6 h-6 text-blue-400" />
              <div>
                <p className="font-semibold">{s.nome}</p>
                <p className="text-sm text-slate-400">Peso: {s.peso}kg | Altura: {s.altura}m</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-400 hover:bg-slate-600"
                onClick={() => navigate(`/personal/assign-workout/${s.user_id}`)}
              >
                <Edit2 className="w-4 h-4 mr-1" /> Gerenciar Treino
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-400 hover:bg-red-900"
                onClick={() => handleDeleteStudent(s.user_id, s.nome)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInviteManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gerenciamento de Alunos</h2>

      {/* Cadastro Manual de Aluno */}
      <Card className="p-6 bg-slate-700 space-y-4">
        <h3 className="text-xl font-bold text-white">Cadastrar Aluno Manualmente</h3>
        <div className="space-y-2">
          <Label htmlFor="nome-aluno" className="text-white">Nome Completo</Label>
          <Input
            id="nome-aluno"
            type="text"
            placeholder="Nome do Aluno"
            value={manualStudentData.nome}
            onChange={(e) => setManualStudentData({ ...manualStudentData, nome: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Label htmlFor="email-aluno" className="text-white">Email</Label>
          <Input
            id="email-aluno"
            type="email"
            placeholder="aluno@email.com"
            value={manualStudentData.email}
            onChange={(e) => setManualStudentData({ ...manualStudentData, email: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Label htmlFor="senha-aluno" className="text-white">Senha Inicial</Label>
          <Input
            id="senha-aluno"
            type="password"
            placeholder="Senha"
            value={manualStudentData.password}
            onChange={(e) => setManualStudentData({ ...manualStudentData, password: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
          <Button onClick={handleManualStudentRegister} className="w-full bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Cadastrar Aluno
          </Button>
        </div>
      </Card>

      {/* Geração de Convite por Link */}
      <Card className="p-6 bg-slate-700 space-y-4">
        <h3 className="text-xl font-bold text-white">Gerar Convite por Link</h3>
        <Label htmlFor="email-invite" className="text-white">Email do Aluno</Label>
        <div className="flex gap-2">
          <Input
            id="email-invite"
            type="email"
            placeholder="aluno@email.com"
            value={emailToInvite}
            onChange={(e) => setEmailToInvite(e.target.value)}
            className="flex-1 bg-slate-800 border-slate-600 text-white"
          />
          <Button onClick={handleGenerateInvite} disabled={!emailToInvite} className="bg-green-600 hover:bg-green-700">
            <Send className="w-4 h-4 mr-2" /> Gerar Link
          </Button>
        </div>
      </Card>

      <h3 className="text-xl font-bold text-white mt-6">Convites Pendentes ({invitations.length})</h3>
      <div className="space-y-4">
        {invitations.map((invite: any) => (
          <Card key={invite.id} className="p-4 bg-slate-700 text-white flex justify-between items-center">
            <div>
              <p className="font-semibold">{invite.email_aluno}</p>
              <p className="text-sm text-slate-400">Status: {invite.status}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleCopyLink(invite.link)} variant="ghost" size="sm" className="text-blue-400 hover:bg-slate-600">
                <Copy className="w-4 h-4 mr-1" /> Copiar Link
              </Button>
              <Button variant="ghost" size="sm" className="text-red-400 hover:bg-red-900">
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
        <h1 className="text-2xl font-bold text-white">Personal Trainer</h1>
        <nav className="space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'students' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('students')}
          >
            Meus Alunos
          </Button>
          <Button 
            variant="ghost" 
            className={`w-full justify-start ${activeTab === 'invite' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
            onClick={() => setActiveTab('invite')}
          >
            Gerenciar Alunos
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
        {activeTab === 'students' && renderStudentManagement()}
        {activeTab === 'invite' && renderInviteManagement()}
        {/* {activeTab === 'exercises' && renderExerciseManagement()} - Será implementado na próxima etapa */}
      </div>
    </div>
  );
}
