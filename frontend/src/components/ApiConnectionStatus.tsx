import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { RefreshCw, Server, AlertTriangle } from 'lucide-react';

interface ApiConnectionStatusProps {
  children: React.ReactNode;
}

export function ApiConnectionStatus({ children }: ApiConnectionStatusProps) {
  const [isApiConnected, setIsApiConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkApiConnection = async () => {
    setIsChecking(true);
    try {
      // Tenta acessar o endpoint de OAuth2 para verificar se a API está rodando
      const response = await fetch('http://localhost:8080/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials', // Request básico só para testar conexão
      });
      
      // Se chegou até aqui (mesmo com erro 400/401), a API está rodando
      setIsApiConnected(true);
    } catch (error) {
      // Erro de rede significa que a API não está rodando
      setIsApiConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkApiConnection();
  }, []);

  // Mostra loading enquanto verifica a conexão
  if (isApiConnected === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando conexão com a API...</p>
        </div>
      </div>
    );
  }

  // Se a API não estiver conectada, mostra tela de instrução
  if (!isApiConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="flex items-center justify-center gap-2">
              <Server className="h-5 w-5" />
              API não encontrada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                A API do sistema não está rodando ou não está acessível. 
                Para usar o sistema, você precisa iniciar a API primeiro.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-medium">Instruções para iniciar a API:</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Certifique-se de que a API Spring Boot está rodando em <code className="bg-muted px-1 rounded">http://localhost:8080</code></li>
                <li>Verifique se o endpoint OAuth2 <code className="bg-muted px-1 rounded">/oauth2/token</code> está acessível</li>
                <li>Confirme que o banco de dados está configurado e rodando</li>
                <li>Verifique se não há firewall bloqueando a porta 8080</li>
                <li>Execute o comando para iniciar o servidor da API</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Configuração OAuth2 necessária:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Client ID:</strong> <code className="bg-muted px-1 rounded">myclientid</code></p>
                <p><strong>Client Secret:</strong> <code className="bg-muted px-1 rounded">myclientsecret</code></p>
                <p><strong>Grant Type:</strong> <code className="bg-muted px-1 rounded">password</code></p>
                <p><strong>Endpoint Token:</strong> <code className="bg-muted px-1 rounded">/oauth2/token</code></p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Endpoints necessários:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><code className="bg-muted px-1 rounded">POST /oauth2/token</code> - Autenticação</p>
                <p><code className="bg-muted px-1 rounded">GET /users/me</code> - Dados do usuário</p>
                <p><code className="bg-muted px-1 rounded">GET /orders</code> - Listar ordens</p>
                <p><code className="bg-muted px-1 rounded">GET /products</code> - Listar produtos</p>
                <p><code className="bg-muted px-1 rounded">GET /users</code> - Listar usuários</p>
                <p><code className="bg-muted px-1 rounded">GET /payments</code> - Listar pagamentos</p>
              </div>
            </div>

            <Button 
              onClick={checkApiConnection} 
              disabled={isChecking}
              className="w-full"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se a API estiver conectada, renderiza o conteúdo normal
  return <>{children}</>;
}