import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { ApiConnectionStatus } from './components/ApiConnectionStatus';
import { Toaster } from './components/ui/sonner';
import { AuthService, Utils, type User } from './services/api';

type AppState = 'login' | 'dashboard' | 'admin' | 'forgot-password' | 'reset-password';

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetToken, setResetToken] = useState<string>('');

  // Verifica se usuário já está autenticado ao carregar a aplicação
  useEffect(() => {
    const checkAuthentication = () => {
      // Verificar se há um token de reset na URL
      const urlPath = window.location.pathname;

      // Regex para capturar o token, considerando barras duplas ou múltiplas
      const recoverMatch = urlPath.match(/(?:\/hdcontrol-java)?\/recover-password\/([^/]+)/);

      if (recoverMatch) {
        let token = recoverMatch[1];
        // Limpar o token de possíveis caracteres extras
        token = token.trim();
        setResetToken(token);
        setAppState('reset-password');
        setIsLoading(false);
        return;
      }

      // Verificação normal de autenticação
      if (AuthService.isAuthenticated()) {
        const user = AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setAppState('dashboard');
        }
      }
      setIsLoading(false);
    };

    checkAuthentication();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setAppState('login');
  };

  const handleOpenAdmin = () => {
    setAppState('admin');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
  };

  const handleForgotPassword = () => {
    setAppState('forgot-password');
  };

  const handleBackToLogin = () => {
    setAppState('login');
    // Limpar a URL se estiver em uma rota de recuperação
    if (window.location.pathname.includes('/recover-password/')) {
      window.history.pushState({}, '', '/');
    }
  };

  const handleResetSuccess = () => {
    setAppState('login');
    setResetToken('');
    // Limpar a URL
    window.history.pushState({}, '', '/');
  };

  return (
    <ApiConnectionStatus>
      {/* Mostra loading enquanto verifica autenticação */}
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Carregando...</p>
          </div>
        </div>
      ) : appState === 'login' ? (
        <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
      ) : appState === 'forgot-password' ? (
        <ForgotPasswordPage onBack={handleBackToLogin} />
      ) : appState === 'reset-password' ? (
        <ResetPasswordPage
          token={resetToken}
          onSuccess={handleResetSuccess}
          onBack={handleBackToLogin}
        />
      ) : appState === 'admin' && currentUser && Utils.canAccessAdminPanel(currentUser) ? (
        <AdminPanel onBack={handleBackToDashboard} />
      ) : appState === 'dashboard' && currentUser ? (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
          onOpenAdmin={handleOpenAdmin}
        />
      ) : (
        <LoginPage onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
      )}
      <Toaster />
    </ApiConnectionStatus>
  );
}