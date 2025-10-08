import { useState, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Search, User as UserIcon, X } from 'lucide-react';
import { UserService, type User } from '../services/api';

interface ClientSelectorProps {
  selectedClient: User | null;
  onClientSelect: (client: User | null) => void;
}

export function ClientSelector({ selectedClient, onClientSelect }: ClientSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Buscar usuários baseado no termo de pesquisa
  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const users = await UserService.searchUsersByName(searchTerm);
        setSearchResults(users);
        setShowResults(true);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300); // Debounce de 300ms
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClientSelect = (client: User) => {
    onClientSelect(client);
    setSearchTerm('');
    setShowResults(false);
    setSearchResults([]);
  };

  const handleClearSelection = () => {
    onClientSelect(null);
    setSearchTerm('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      <Label>Cliente *</Label>
      
      {selectedClient ? (
        // Cliente selecionado
        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-blue-800">
                {selectedClient.firstName} {selectedClient.lastName}
              </div>
              <div className="text-sm text-blue-600">{selectedClient.email}</div>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearSelection}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Campo de busca
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar cliente por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Resultados da busca */}
          {showResults && (
            <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
              <CardContent className="p-0">
                {isSearching ? (
                  <div className="p-3 text-center text-muted-foreground">
                    Buscando...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => handleClientSelect(user)}
                        className="w-full text-left p-3 hover:bg-gray-50 flex items-center gap-3 border-b last:border-b-0"
                      >
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Roles: {user.roles?.map(role => role.authority.replace('ROLE_', '')).join(', ')}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-muted-foreground">
                    Nenhum cliente encontrado
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      <p className="text-xs text-muted-foreground">
        Digite pelo menos 2 caracteres para buscar clientes cadastrados
      </p>
    </div>
  );
}