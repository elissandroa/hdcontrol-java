
  # Sistema de Gerenciamento de Ordens de Serviço - HDs

Um sistema completo para gerenciamento de ordens de serviço de conserto de HDs (Hard Drives), desenvolvido com React, TypeScript e Tailwind CSS, com autenticação segura e interface responsiva.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Telas do Sistema](#-telas-do-sistema)
- [API Endpoints](#-api-endpoints)
- [Autenticação](#-autenticação)
- [Permissões](#-permissões)
- [Fluxos de Trabalho](#-fluxos-de-trabalho)
- [Responsividade](#-responsividade)

## 🚀 Funcionalidades

### Autenticação e Segurança
- ✅ Login com email e senha
- ✅ Recuperação de senha via email
- ✅ Reset de senha com token temporário
- ✅ Autenticação JWT com Bearer Token
- ✅ Sistema de permissões (Usuário/Administrador)
- ✅ Logout seguro

### Gerenciamento de Ordens de Serviço
- ✅ Criação de novas ordens
- ✅ Visualização detalhada de ordens
- ✅ Filtros por status (Pendente, Pronto, Pago)
- ✅ Mudança de status das ordens
- ✅ Registro de entrega
- ✅ Controle de pagamentos
- ✅ Histórico completo de serviços

### Painel Administrativo
- ✅ Cadastro e gerenciamento de usuários
- ✅ Cadastro e gerenciamento de produtos
- ✅ Acesso a todas as ordens do sistema
- ✅ Controle de permissões

### Interface e Experiência
- ✅ Design responsivo (Mobile-first)
- ✅ Tema claro/escuro
- ✅ Notificações toast
- ✅ Modais intuitivos
- ✅ Validação de formulários
- ✅ Loading states

## 🛠 Tecnologias

### Frontend
- **React 18** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework CSS utilitário
- **Shadcn/ui** - Biblioteca de componentes
- **Lucide React** - Ícones
- **Sonner** - Sistema de notificações
- **React Hook Form** - Gerenciamento de formulários

### Backend (API)
- **Spring Boot** - Framework Java
- **OAuth2** - Autenticação
- **JWT** - Tokens de acesso
- **REST API** - Comunicação HTTP

## 📁 Estrutura do Projeto

```
├── App.tsx                    # Componente principal e roteamento
├── components/
│   ├── AdminPanel.tsx         # Painel administrativo
│   ├── Dashboard.tsx          # Dashboard principal
│   ├── LoginPage.tsx          # Página de login
│   ├── ForgotPasswordPage.tsx # Recuperação de senha
│   ├── ResetPasswordPage.tsx  # Reset de senha
│   ├── UserManagement.tsx     # Gerenciamento de usuários
│   ├── ProductManagement.tsx  # Gerenciamento de produtos
│   ├── NewOrderModal.tsx      # Modal de nova ordem
│   ├── OrderDetailsModal.tsx  # Detalhes da ordem
│   ├── StatusChangeModal.tsx  # Mudança de status
│   ├── PaymentModal.tsx       # Controle de pagamento
│   ├── DeliveryModal.tsx      # Registro de entrega
│   └── ui/                    # Componentes UI (Shadcn)
├── services/
│   └── api.ts                 # Serviços de API
└── styles/
    └── globals.css            # Estilos globais
```

## ⚙️ Configuração

### Pré-requisitos
- Node.js 18+
- Backend Spring Boot rodando em `http://localhost:8080`

### Instalação
```bash
# Clone o repositório
git clone [repository-url]

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração da API
O sistema espera que a API esteja rodando em `http://localhost:8080` com os seguintes endpoints configurados:

- **Autenticação**: `POST /oauth2/token`
- **Recuperação de senha**: `POST /auth/recover-token`
- **Reset de senha**: `POST /auth/new-password`
- **Usuários**: `GET/POST/PUT/DELETE /users`
- **Produtos**: `GET/POST/PUT/DELETE /products`
- **Ordens**: `GET/POST/PUT/DELETE /orders`
- **Pagamentos**: `GET/POST/PUT/DELETE /payments`

## 🖥 Telas do Sistema

### 1. Tela de Login
- **Rota**: `/`
- **Funcionalidades**:
  - Login com email e senha
  - Link para recuperação de senha
  - Validação de campos
  - Redirect automático após login

### 2. Recuperação de Senha
- **Rota**: `/forgot-password`
- **Funcionalidades**:
  - Solicitação de reset via email
  - Envio de token temporário
  - Feedback visual do processo

### 3. Reset de Senha
- **Rota**: `/recover-password/{token}`
- **Funcionalidades**:
  - Validação de nova senha
  - Confirmação de senha
  - Critérios de segurança
  - Processamento do token

### 4. Dashboard Principal
- **Rota**: `/dashboard`
- **Funcionalidades**:
  - Visão geral das ordens
  - Filtros por status
  - Busca de ordens
  - Acesso rápido às ações
  - Cards responsivos para mobile

### 5. Painel Administrativo
- **Rota**: `/admin`
- **Restrito**: Apenas administradores
- **Funcionalidades**:
  - Gerenciamento de usuários
  - Gerenciamento de produtos
  - Acesso a todas as ordens
  - Relatórios e estatísticas

## 🔗 API Endpoints

### Autenticação
```http
# Login
POST /oauth2/token
Authorization: Basic {base64(client-id:client-secret)}
Content-Type: application/x-www-form-urlencoded

grant_type=password&username={email}&password={password}

# Recuperar senha
POST /auth/recover-token
Content-Type: application/json

{
  "to": "user@email.com",
  "subject": "Recuperação de Senha",
  "body": "Recuperação de Senha você tem 30 minutos para utilizar o token contido nesse email: http://localhost:3000/recover-password/"
}

# Reset senha
POST /auth/new-password
Content-Type: application/json

{
  "token": "recovery-token",
  "newPassword": "new-password"
}
```

### Recursos
```http
# Usuários
GET    /users           # Listar usuários
POST   /users           # Criar usuário
PUT    /users/{id}      # Atualizar usuário
DELETE /users/{id}      # Deletar usuário

# Produtos
GET    /products        # Listar produtos
POST   /products        # Criar produto
PUT    /products/{id}   # Atualizar produto
DELETE /products/{id}   # Deletar produto

# Ordens
GET    /orders          # Listar ordens
POST   /orders          # Criar ordem
PUT    /orders/{id}     # Atualizar ordem
DELETE /orders/{id}     # Deletar ordem

# Pagamentos
GET    /payments        # Listar pagamentos
POST   /payments        # Criar pagamento
PUT    /payments/{id}   # Atualizar pagamento
DELETE /payments/{id}   # Deletar pagamento
```

## 🔐 Autenticação

### Fluxo OAuth2
1. **Client Credentials**: `myclientid:myclientsecret`
2. **Grant Type**: `password`
3. **Token Type**: `Bearer`
4. **Headers**: `Authorization: Bearer {access_token}`

### Configuração
```typescript
// services/api.ts
const CLIENT_ID = 'myclientid';
const CLIENT_SECRET = 'myclientsecret';
const API_BASE_URL = 'http://localhost:8080';

// Headers para requisições autenticadas
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 👥 Permissões

### Usuário Normal
- ✅ Ver apenas suas próprias ordens
- ✅ Criar novas ordens
- ✅ Atualizar suas ordens
- ❌ Acesso ao painel administrativo
- ❌ Gerenciar outros usuários

### Administrador
- ✅ Ver todas as ordens do sistema
- ✅ Criar/editar/deletar qualquer ordem
- ✅ Acesso ao painel administrativo
- ✅ Gerenciar usuários
- ✅ Gerenciar produtos
- ✅ Acessar relatórios

### Verificação de Permissões
```typescript
// Verificar se é admin
Utils.canAccessAdminPanel(user)

// Verificar se pode editar ordem
Utils.canEditOrder(user, order)
```

## 🔄 Fluxos de Trabalho

### 1. Ciclo de Vida de uma Ordem
```
1. CRIAÇÃO
   ├─ Cliente selecionado
   ├─ Produto selecionado
   ├─ Descrição do problema
   └─ Status: "Pendente"

2. DIAGNÓSTICO
   ├─ Técnico analisa
   ├─ Atualiza descrição
   └─ Status: "Pendente"

3. REPARO
   ├─ Execução do serviço
   ├─ Registro do trabalho
   └─ Status: "Pronto"

4. ENTREGA
   ├─ Cliente notificado
   ├─ Data de entrega
   └─ Status: "Pronto"

5. PAGAMENTO
   ├─ Valor cobrado
   ├─ Forma de pagamento
   └─ Status: "Pago"
```

### 2. Fluxo de Recuperação de Senha
```
1. SOLICITAÇÃO
   ├─ Email informado
   ├─ Validação do email
   └─ Token gerado (30min)

2. EMAIL
   ├─ Token enviado
   ├─ Link personalizado
   └─ Instruções de uso

3. RESET
   ├─ Token validado
   ├─ Nova senha definida
   └─ Confirmação enviada
```

## 📱 Responsividade

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Adaptações Mobile
- **Cards**: Layout empilhado
- **Tabelas**: Scroll horizontal
- **Modais**: Largura 95vw
- **Fontes**: Tamanho reduzido (14px)
- **Padding**: Reduzido para 0.75rem

### Componentes Responsivos
```typescript
// MobileOrderCard.tsx - Cards otimizados para mobile
// Dashboard.tsx - Layout adaptativo
// Modais - Dimensionamento automático
```

## 📊 Estrutura de Dados

### Usuário
```typescript
interface User {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}
```

### Produto
```typescript
interface Produto {
  id: number;
  descricao: string;
  marca: string;
  preco: number;
}
```

### Ordem de Serviço
```typescript
interface Order {
  id: number;
  cliente: string;
  dataCriacao: string;
  dataEntrega?: string;
  status: 'Pendente' | 'Pronto' | 'Pago';
  quantidade: number;
  descricao: string;
  valor: number;
  total: number;
  servicoExecutado?: string;
  observacoes?: string;
}
```

### Pagamento
```typescript
interface Payment {
  id: number;
  orderId: number;
  valor: number;
  dataPagamento: string;
  formaPagamento: string;
  status: string;
}
```

## 🎨 Personalização

### Temas
O sistema usa Tailwind CSS v4 com suporte a tema claro/escuro configurado em `styles/globals.css`.

### Componentes
Todos os componentes UI são baseados no Shadcn/ui e podem ser personalizados individualmente.

### Cores
```css
:root {
  --primary: #030213;
  --secondary: #f3f3f5;
  --destructive: #d4183d;
  --muted: #ececf0;
  /* ... outras cores */
}
```

## 🐛 Solução de Problemas

### Problemas Comuns

1. **API não conecta**
   - Verificar se backend está rodando na porta 8080
   - Conferir configuração CORS no backend

2. **Token expirado**
   - Fazer logout e login novamente
   - Verificar validade do token JWT

3. **Recuperação de senha não funciona**
   - Verificar configuração de email no backend
   - Conferir se token está sendo gerado corretamente

4. **Permissões negadas**
   - Verificar role do usuário no banco
   - Confirmar headers de autenticação

## 📝 Notas de Desenvolvimento

### Estados da Aplicação
```typescript
type AppState = 'login' | 'dashboard' | 'admin' | 'forgot-password' | 'reset-password';
```

### Persistência
- **Token**: LocalStorage
- **User Data**: SessionStorage
- **Preferences**: LocalStorage

### Validações
- **Senha**: Min 6 chars, maiúscula, minúscula, número
- **Email**: Formato válido obrigatório
- **Campos**: Validação em tempo real

---

## 📞 Suporte

Para dúvidas ou problemas:
1. Verificar esta documentação
2. Consultar logs do console
3. Verificar status da API
4. Contatar equipe de desenvolvimento

**Versão**: 1.0.0  
**Última atualização**: Outubro 2025