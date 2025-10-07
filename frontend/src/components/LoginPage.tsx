import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { HardDrive, Loader2 } from 'lucide-react';
import { AuthService, type User } from '../services/api';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onForgotPassword?: () => void;
}

export function LoginPage({ onLogin, onForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setIsLoading(false);
      return;
    }

    try {
      const { user } = await AuthService.login(email, password);
      onLogin(user);
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Email ou senha inválidos. Verifique suas credenciais e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center p-4 sm:p-6">
          <div className="flex justify-center mb-4">
            <HardDrive className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          <CardTitle className="text-lg sm:text-xl">Sistema de Gerenciamento</CardTitle>
          <CardDescription className="text-sm">Ordens de Serviço - Conserto de HDs</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
            
            {onForgotPassword && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
                  onClick={onForgotPassword}
                >
                  Esqueci minha senha
                </Button>
              </div>
            )}
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 mb-2">📝 Usuários de demonstração:</p>
            <div className="text-xs space-y-1 text-blue-600">
              <p><strong>Admin:</strong> admin@sistema.com / admin123</p>
              <p><strong>Cliente:</strong> cliente@sistema.com / cliente123</p>
              <p><strong>Usuário:</strong> usuario@sistema.com / usuario123</p>
            </div>
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <p className="text-yellow-700">
                💡 <strong>Modo Demonstração:</strong> A API em localhost:8080 não está disponível. 
                O sistema está funcionando com dados mockados para demonstração.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}