import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { UserManagement } from './UserManagement';
import { ProductManagement } from './ProductManagement';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-3 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button variant="outline" onClick={onBack} className="self-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-lg sm:text-xl">Painel Administrativo</h1>
            <p className="text-muted-foreground text-sm">Gerenciamento de usuários e produtos</p>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Administração do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="users" className="text-sm sm:text-base">Usuários</TabsTrigger>
                <TabsTrigger value="products" className="text-sm sm:text-base">Produtos</TabsTrigger>
              </TabsList>
              
              <TabsContent value="users" className="mt-4 sm:mt-6">
                <UserManagement />
              </TabsContent>
              
              <TabsContent value="products" className="mt-4 sm:mt-6">
                <ProductManagement />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}