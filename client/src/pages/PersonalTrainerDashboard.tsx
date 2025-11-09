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
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Link de convite copiado!');
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
              <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-slate-600">
                <Edit2 className="w-4 h-4 mr-1" /> Gerenciar Treino
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInviteManagement = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Gerar Convite para Aluno</h2>
      <Card className="p-6 bg-slate-700 space-y-4">
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
            Gerar Convite
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
