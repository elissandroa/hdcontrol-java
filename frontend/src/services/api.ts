// Configurações da API
const API_BASE_URL = 'http://localhost:8080';
const CLIENT_ID = 'myclientid';
const CLIENT_SECRET = 'myclientsecret';

// Tipos para autenticação
interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface Role {
  id: number;
  authority: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  roles: Role[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: number;
}

interface OrderItem {
  product: {
    id: number;
  };
  quantity: number;
  price: number;
}

interface OrderItemDetailed {
  id?: number;
  product: Product;
  quantity: number;
  price: number;
  description?: string; // Descrição específica do item
  service?: string; // Serviço executado no item
  observation?: string; // Observações específicas do item
  subTotal?: number; // Total calculado do item (quantity * price)
}

interface Order {
  id: number;
  serviceDescription: string;
  observation: string;
  deliveryDate?: string;
  status: 'PENDING' | 'READY' | 'PAID';
  user: {
    id: number;
  };
  items: OrderItem[];
  createdDate?: string;
  lastUpdate?: string;
  paymentDate?: string;
}

interface OrderDetailed {
  id: number;
  serviceDescription: string;
  observation: string;
  deliveryDate?: string;
  status: 'PENDING' | 'READY' | 'PAID';
  user: User;
  items: OrderItemDetailed[];
  createdDate?: string;
  lastUpdate?: string;
  paymentDate?: string;
  total?: number;
}

interface Payment {
  id: number;
  moment: string;
  status: 'PENDING' | 'PAID';
  order: OrderDetailed;
}

interface UserCreate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  roles: Role[];
}

interface UserUpdate {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  roles: Role[];
}

// Gerenciamento de token
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'auth_user';

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

// Cliente HTTP com interceptadores
class HttpClient {
  private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = TokenManager.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Adiciona Bearer token se disponível (exceto para login)
    if (token && !url.includes('/oauth2/token')) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, config);
    
    // Se token expirou, redireciona para login
    if (response.status === 401) {
      TokenManager.removeToken();
      window.location.reload();
      throw new Error('Token expirado');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Verifica se a resposta tem conteúdo
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  }

  async get<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' });
  }
}

// Instância do cliente HTTP
const httpClient = new HttpClient();

// Serviços da API
export const AuthService = {
  async login(username: string, password: string): Promise<{ user: User; token: string }> {
    // Prepara Basic Auth para o client
    const clientAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
    
    // Prepara dados do formulário
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${clientAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Credenciais inválidas');
    }

    const authData: AuthResponse = await response.json();
    
    // Salva o token
    TokenManager.setToken(authData.access_token);

    // Busca dados do usuário autenticado
    const user = await this.getCurrentUserFromAPI();
    TokenManager.setUser(user);

    return { user, token: authData.access_token };
  },

  async getCurrentUserFromAPI(): Promise<User> {
    const token = TokenManager.getToken();
    if (!token) {
      throw new Error('Token não encontrado');
    }

    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao buscar dados do usuário: ${errorText}`);
    }

    return await response.json();
  },

  logout(): void {
    TokenManager.removeToken();
  },

  getCurrentUser(): User | null {
    return TokenManager.getUser();
  },

  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.some(role => role.authority === 'ROLE_ADMIN') || false;
  },

  hasRole(roleName: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.some(role => role.authority === roleName) || false;
  },

  isClient(): boolean {
    return this.hasRole('ROLE_CLIENT');
  },

  isUser(): boolean {
    return this.hasRole('ROLE_USER');
  },

  // Solicitar token de recuperação de senha
  async requestPasswordRecovery(email: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/recover-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: "Recuperação de Senha",
        body: "Recuperação de Senha você tem 30 minutos para utilizar o token contido nesse email: http://localhost:3000/recover-password/"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao solicitar recuperação de senha: ${errorText}`);
    }
  },

  // Alterar senha com token
  async resetPasswordWithToken(token: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/new-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        newPassword: newPassword
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao alterar senha: ${errorText}`);
    }
  },

  async requestPasswordRecovery(email: string): Promise<void> {
    const recoveryData = {
      to: email,
      subject: "Recuperação de Senha",
      body: "Recuperação de Senha você tem 30 minutos para utilizar o token contido nesse email:"
    };

    const response = await fetch(`${API_BASE_URL}/auth/recover-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recoveryData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao solicitar recuperação de senha: ${errorText}`);
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const resetData = {
      token,
      newPassword
    };

    const response = await fetch(`${API_BASE_URL}/auth/new-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(resetData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao redefinir senha: ${errorText}`);
    }
  }
};

export const OrderService = {
  async getOrderById(id: number): Promise<OrderDetailed> {
    return await httpClient.get<OrderDetailed>(`/orders/${id}`);
  },

  async getOrders(params: {
    sort?: string;
    size?: number;
    page?: number;
    userId?: number;
  } = {}): Promise<{ content: OrderDetailed[]; totalElements: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.userId) queryParams.append('userId', params.userId.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/orders?${queryString}` : '/orders';
    
    try {
      const response = await httpClient.get<{ content: OrderDetailed[]; totalElements: number; totalPages: number }>(url);
      
      // Se a resposta for um array direto (não paginado), adapta para o formato esperado
      if (Array.isArray(response)) {
        return {
          content: response,
          totalElements: response.length,
          totalPages: 1
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar ordens:', error);
      throw error;
    }
  },

  async getAllOrdersForAdmin(params: {
    sort?: string;
    size?: number;
    page?: number;
  } = {}): Promise<{ content: OrderDetailed[]; totalElements: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    
    if (params.sort) queryParams.append('sort', params.sort);
    if (params.size) queryParams.append('size', params.size.toString());
    if (params.page) queryParams.append('page', params.page.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `/orders/allorders?${queryString}` : '/orders/allorders';
    
    try {
      const response = await httpClient.get<{ content: OrderDetailed[]; totalElements: number; totalPages: number }>(url);
      
      // Se a resposta for um array direto (não paginado), adapta para o formato esperado
      if (Array.isArray(response)) {
        return {
          content: response,
          totalElements: response.length,
          totalPages: 1
        };
      }
      
      return response;
    } catch (error) {
      console.error('Erro ao buscar todas as ordens:', error);
      throw error;
    }
  },

  async createOrder(order: Omit<Order, 'id'>): Promise<OrderDetailed> {
    return await httpClient.post<OrderDetailed>('/orders', order);
  },

  async updateOrder(id: number, order: Partial<Order>): Promise<OrderDetailed> {
    return await httpClient.put<OrderDetailed>(`/orders/${id}`, order);
  },

  async deleteOrder(id: number): Promise<void> {
    return await httpClient.delete<void>(`/orders/${id}`);
  }
};

export const ProductService = {
  async getProducts(name?: string): Promise<Product[]> {
    const url = name ? `/products?name=${encodeURIComponent(name)}` : '/products';
    const response = await httpClient.get<{ content: Product[]; totalElements: number; totalPages: number } | Product[]>(url);
    
    // Se a resposta for um array direto, retorna como está
    if (Array.isArray(response)) {
      return response;
    }
    
    // Se a resposta for paginada, retorna o conteúdo
    return response.content || [];
  },

  async getProductById(id: number): Promise<Product> {
    return await httpClient.get<Product>(`/products/${id}`);
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    return await httpClient.post<Product>('/products', product);
  },

  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    return await httpClient.put<Product>(`/products/${id}`, product);
  },

  async deleteProduct(id: number): Promise<void> {
    return await httpClient.delete<void>(`/products/${id}`);
  }
};

export const UserService = {
  async getUsers(): Promise<User[]> {
    const response = await httpClient.get<{ content: User[] }>('/users');
    return response.content || [];
  },

  async getUserById(id: number): Promise<User> {
    return await httpClient.get<User>(`/users/${id}`);
  },

  async searchUsersByName(name: string): Promise<User[]> {
    if (!name.trim()) {
      return [];
    }
    try {
      const allUsers = await this.getUsers();
      const searchTerm = name.toLowerCase().trim();
      return allUsers.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const firstName = user.firstName.toLowerCase();
        const lastName = user.lastName.toLowerCase();
        return fullName.includes(searchTerm) || 
               firstName.includes(searchTerm) || 
               lastName.includes(searchTerm);
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  },

  async createUser(user: UserCreate): Promise<User> {
    return await httpClient.post<User>('/users', user);
  },

  async updateUser(id: number, user: UserUpdate): Promise<User> {
    return await httpClient.put<User>(`/users/${id}`, user);
  },

  async deleteUser(id: number): Promise<void> {
    return await httpClient.delete<void>(`/users/${id}`);
  }
};

export const PaymentService = {
  async getPayments(): Promise<Payment[]> {
    try {
      const response = await httpClient.get<{ content: Payment[]; totalElements: number; totalPages: number } | Payment[]>('/payments');
      
      // Se a resposta for um array direto, retorna como está
      if (Array.isArray(response)) {
        return response;
      }
      
      // Se a resposta for paginada, retorna o conteúdo
      return response.content || [];
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      return [];
    }
  },

  async createPayment(payment: { moment: string; status: 'PENDING' | 'PAID'; order: { id: number } }): Promise<Payment> {
    return await httpClient.post<Payment>('/payments', payment);
  },

  async updatePayment(id: number, payment: { moment: string; status: 'PENDING' | 'PAID'; order: { id: number } }): Promise<Payment> {
    return await httpClient.put<Payment>(`/payments/${id}`, payment);
  },

  async deletePayment(id: number): Promise<void> {
    return await httpClient.delete<void>(`/payments/${id}`);
  }
};

// Serviço para buscar roles disponíveis (roles estáticos baseados na API)
export const RoleService = {
  async getRoles(): Promise<Role[]> {
    // Como não há endpoint específico para roles no Postman, retornamos as roles conhecidas
    return [
      { id: 1, authority: 'ROLE_ADMIN' },
      { id: 2, authority: 'ROLE_USER' },
      { id: 3, authority: 'ROLE_CLIENT' }
    ];
  }
};

// Funções utilitárias para conversão entre formatos
export const Utils = {
  // Converte status da API para formato de exibição
  formatOrderStatus(status: 'PENDING' | 'READY' | 'PAID'): 'Pendente' | 'Pronto' | 'Pago' {
    const statusMap = {
      'PENDING': 'Pendente' as const,
      'READY': 'Pronto' as const,
      'PAID': 'Pago' as const
    };
    return statusMap[status];
  },

  // Converte status de exibição para formato da API
  parseOrderStatus(status: 'Pendente' | 'Pronto' | 'Pago'): 'PENDING' | 'READY' | 'PAID' {
    const statusMap = {
      'Pendente': 'PENDING' as const,
      'Pronto': 'READY' as const,
      'Pago': 'PAID' as const
    };
    return statusMap[status];
  },

  // Calcula total de uma ordem
  calculateOrderTotal(items: OrderItemDetailed[]): number {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  },

  // Verifica se usuário é admin
  isUserAdmin(user: User): boolean {
    return user.roles?.some(role => role.authority === 'ROLE_ADMIN') || false;
  },

  // Verifica se usuário tem role específico
  hasRole(user: User, roleName: string): boolean {
    return user.roles?.some(role => role.authority === roleName) || false;
  },

  // Verifica se usuário é cliente
  isUserClient(user: User): boolean {
    return user.roles?.some(role => role.authority === 'ROLE_CLIENT') || false;
  },

  // Verifica se usuário é usuário normal (ROLE_USER)
  isUserNormal(user: User): boolean {
    return user.roles?.some(role => role.authority === 'ROLE_USER') || false;
  },

  // Verifica permissões de acesso a ordens
  canAccessAllOrders(user: User): boolean {
    return this.isUserAdmin(user);
  },

  // Verifica se pode acessar painel administrativo
  canAccessAdminPanel(user: User): boolean {
    return this.isUserAdmin(user);
  },

  // Verifica se pode criar/editar ordens
  canManageOrders(user: User): boolean {
    return this.isUserAdmin(user);
  },

  // Verifica se pode ver apenas suas próprias ordens
  canOnlyViewOwnOrders(user: User): boolean {
    return this.isUserNormal(user) || this.isUserClient(user);
  },

  // Formata data para exibição
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('pt-BR');
  },

  // Formata data para API (YYYY-MM-DD)
  formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  },

  // Calcula total de ordens não pagas
  calculateUnpaidOrdersTotal(orders: OrderDetailed[]): number {
    return orders
      .filter(order => order.status !== 'PAID')
      .reduce((total, order) => {
        const orderTotal = this.calculateOrderTotal(order.items);
        return total + orderTotal;
      }, 0);
  },

  // Formata valor monetário
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
};

export type { 
  User, 
  Order, 
  OrderDetailed, 
  Product, 
  OrderItem, 
  OrderItemDetailed, 
  Payment, 
  Role, 
  UserCreate, 
  UserUpdate 
};