import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label'; // Adicionado Label para consistência, embora não seja usado diretamente no código original, é bom ter.

export default function Login() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@everstrong.com');
  const [password, setPassword] = useState('senha123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <img src="/everstrong-logo.png" alt="Everstrong" className="w-24 h-24" />
        </div>

        {/* Título */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Everstrong</h1>
          <p className="text-sm text-muted-foreground">Sempre forte. Sempre em frente.</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 flex gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Senha</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full mb-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
          <Button 
            variant="link" 
            onClick={() => navigate('/forgot-password')} 
            className="w-full text-sm text-muted-foreground hover:text-primary"
          >
            Esqueceu sua senha?
          </Button>
        </form>

        {/* Credenciais de Teste */}
        <div className="bg-muted p-4 rounded-lg space-y-2 text-xs">
          <p className="font-semibold">Credenciais de Teste:</p>
          <p>
            <span className="font-medium">Admin:</span> admin@everstrong.com / senha123
          </p>
          <p>
            <span className="font-medium">Personal:</span> personal@everstrong.com / senha123
          </p>
          <p>
            <span className="font-medium">Aluno:</span> aluno@everstrong.com / senha123
          </p>
        </div>
      </Card>
    </div>
  );
}
