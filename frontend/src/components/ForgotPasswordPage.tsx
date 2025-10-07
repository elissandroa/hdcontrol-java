import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { AuthService } from '../services/api';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Por favor, informe seu email');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Por favor, informe um email válido');
      return;
    }

    try {
      setIsLoading(true);
      await AuthService.requestPasswordRecovery(email);
      setEmailSent(true);
      toast.success('Email de recuperação enviado com sucesso!');
    } catch (error) {
      console.error('Erro ao solicitar recuperação:', error);
      toast.error('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle>Recuperar Senha</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!emailSent ? (
            <>
              <div className="text-center space-y-2">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Digite seu email para receber as instruções de recuperação de senha
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Enviando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Enviar Email de Recuperação
                    </div>
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Mail className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <h3 className="font-medium text-green-800 mb-1">
                  Email Enviado!
                </h3>
                <p className="text-sm text-green-700">
                  Verificamos seu email <strong>{email}</strong> e enviamos as instruções de recuperação.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Importante:</strong> O token de recuperação expira em 30 minutos. 
                  Verifique sua caixa de entrada e spam.
                </p>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail('');
                  }}
                  className="w-full"
                >
                  Tentar Novamente
                </Button>
                <Button
                  variant="ghost"
                  onClick={onBack}
                  className="w-full"
                >
                  Voltar ao Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}