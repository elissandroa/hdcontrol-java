import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, EyeOff, Key, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AuthService } from '../services/api';

interface ResetPasswordPageProps {
  token: string;
  onSuccess: () => void;
  onBack: () => void;
}

export function ResetPasswordPage({ token, onSuccess, onBack }: ResetPasswordPageProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Validações de senha
  const minLength = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;
  const isPasswordValid = minLength && hasUpperCase && hasLowerCase && hasNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      toast.error('A senha não atende todos os critérios de segurança');
      return;
    }

    if (!passwordsMatch) {
      toast.error('As senhas não coincidem');
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.resetPasswordWithToken(token, password);
      toast.success('Senha alterada com sucesso!');
      onSuccess();
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      toast.error('Erro ao alterar senha. Verifique se o token ainda é válido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Key className="h-5 w-5" />
            Nova Senha
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Digite sua nova senha. Ela deve ser segura e fácil de lembrar.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nova Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua nova senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Campo Confirmar Senha */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Validações da Senha */}
            {password.length > 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">Critérios da senha:</p>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs ${minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`h-3 w-3 ${minLength ? 'text-green-600' : 'text-gray-400'}`} />
                    Mínimo 6 caracteres
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`h-3 w-3 ${hasUpperCase ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos uma letra maiúscula
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`h-3 w-3 ${hasLowerCase ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos uma letra minúscula
                  </div>
                  <div className={`flex items-center gap-2 text-xs ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    <CheckCircle className={`h-3 w-3 ${hasNumber ? 'text-green-600' : 'text-gray-400'}`} />
                    Pelo menos um número
                  </div>
                  {confirmPassword.length > 0 && (
                    <div className={`flex items-center gap-2 text-xs ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                      <CheckCircle className={`h-3 w-3 ${passwordsMatch ? 'text-green-600' : 'text-red-400'}`} />
                      Senhas coincidem
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Alterando Senha...
                </div>
              ) : (
                'Alterar Senha'
              )}
            </Button>
          </form>
          
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-full"
            disabled={isLoading}
          >
            Voltar ao Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}