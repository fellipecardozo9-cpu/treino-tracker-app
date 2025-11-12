import React from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
// Nota: Assumindo que você tem um arquivo de tipos em '@/types/auth'
// Se não tiver, você precisará criar um tipo UserRole
type UserRole = 'master' | 'personal' | 'aluno'; 

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  requiredRole?: UserRole;
  [key: string]: any; // Para aceitar props adicionais como studentId ou workoutId
}

export default function ProtectedRoute({ component: Component, requiredRole, ...rest }: ProtectedRouteProps) {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redireciona para a home se a role não for a requerida
    navigate('/');
    return null;
  }

  if (user?.role === 'personal' && user?.status === 'pendente') {
    // Tela de aguardando aprovação para Personal Trainer
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-yellow-500">Aguardando aprovação do Master Admin...</p>
      </div>
    );
  }

  // Passa as props adicionais (como studentId, workoutId) para o componente
  return <Component {...rest} />;
}
