import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetEmail, setResetEmail] = useState(''); // Email para o qual a senha será resetada

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    // Simulação: Apenas verifica se o email existe no localStorage
    const authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
    const userExists = authUsers.some((u: any) => u.email === email);

    if (userExists) {
      // Simulação de envio de link/token. Na verdade, avança para a próxima etapa.
      setResetEmail(email);
      setStep('reset');
      setMessage('Simulação: Um link de redefinição foi "enviado" para seu e-mail. Por favor, insira sua nova senha.');
    } else {
      setMessage('Erro: E-mail não encontrado. Verifique o endereço e tente novamente.');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (newPassword !== confirmPassword) {
      setMessage('Erro: As senhas não coincidem.');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Erro: A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // 1. Atualizar a senha no localStorage
    let authUsers = JSON.parse(localStorage.getItem('auth_users') || '[]');
    const userIndex = authUsers.findIndex((u: any) => u.email === resetEmail);

    if (userIndex > -1) {
      // Simulação de hash de senha
      authUsers[userIndex].password_hash = btoa(newPassword);
      localStorage.setItem('auth_users', JSON.stringify(authUsers));
      
      alert('Senha redefinida com sucesso! Você será redirecionado para o login.');
      navigate('/login');
    } else {
      setMessage('Erro: Usuário não encontrado durante a redefinição.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-slate-800 text-white border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Esqueceu sua Senha?</CardTitle>
        </CardHeader>
        <CardContent>
          {message && (
            <div className={`p-3 mb-4 rounded-md ${message.startsWith('Erro') ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
              {message}
            </div>
          )}

          {step === 'email' ? (
            <form onSubmit={handleSendResetLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">E-mail de Cadastro</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Enviar Link de Redefinição
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-sm text-slate-400">Redefinindo senha para: <span className="font-semibold text-white">{resetEmail}</span></p>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">Nova Senha</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Repita a nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                Redefinir Senha
              </Button>
            </form>
          )}

          <Button 
            variant="link" 
            onClick={() => navigate('/login')} 
            className="w-full mt-4 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
