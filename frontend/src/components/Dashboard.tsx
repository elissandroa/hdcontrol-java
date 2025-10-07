import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Eye, 
  RotateCcw, 
  Truck, 
  CreditCard
} from 'lucide-react';

import { OrderDetailsModal } from './OrderDetailsModal';
import { StatusChangeModal } from './StatusChangeModal';
import { DeliveryModal } from './DeliveryModal';
import { PaymentModal } from './PaymentModal';
import { NewOrderModal } from './NewOrderModal';
import { MobileOrderCard } from './MobileOrderCard';

import { 
  OrderService, 
  ProductService,
  PaymentService,
  Utils, 
  type User, 
  type OrderDetailed, 
  type Product
} from '../services/api';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onOpenAdmin: () => void;
}

export function Dashboard({ user, onLogout, onOpenAdmin }: DashboardProps) {
  const [orders, setOrders] = useState<OrderDetailed[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetailed | null>(null);
  const [statusModalOrder, setStatusModalOrder] = useState<OrderDetailed | null>(null);
  const [deliveryModalOrder, setDeliveryModalOrder] = useState<OrderDetailed | null>(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState<OrderDetailed | null>(null);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(0); // A API usa índice baseado em 0
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sortOrder, setSortOrder] = useState('id,desc');
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  
  // Estados para resumo financeiro
  const [financialSummary, setFinancialSummary] = useState({
    unpaidTotal: 0,
    unpaidCount: 0,
    paidTotal: 0,
    paidCount: 0,
    grandTotal: 0,
    totalCount: 0
  });

  const isAdmin = Utils.canAccessAdminPanel(user);
  const canManageOrders = isAdmin || Utils.isUserClient(user);

  // Função para carregar resumo financeiro (todas as ordens)
  const loadFinancialSummary = async () => {
    try {
      console.log('Carregando resumo financeiro...');
      
      let allOrdersData;
      
      // Buscar todas as ordens para o resumo financeiro (sem paginação)
      if (isAdmin) {
        console.log('Carregando todas as ordens para resumo como ADMIN');
        allOrdersData = await OrderService.getAllOrdersForAdmin({ size: 9999 }); // Tamanho grande para pegar todas
      } else if (Utils.isUserClient(user)) {
        console.log('Carregando todas as ordens para resumo como CLIENT para userId:', user.id);
        allOrdersData = await OrderService.getOrders({ userId: user.id, size: 9999 });
      } else if (Utils.isUserNormal(user)) {
        console.log('Carregando todas as ordens para resumo como USER para userId:', user.id);
        allOrdersData = await OrderService.getOrders({ userId: user.id, size: 9999 });
      } else {
        console.log('Tipo de usuário não reconhecido, carregando todas as ordens para resumo');
        allOrdersData = await OrderService.getOrders({ userId: user.id, size: 9999 });
      }
      
      const allOrders = allOrdersData.content || [];
      
      // Buscar todos os pagamentos para atualizar status
      let paymentsData: any[] = [];
      try {
        console.log('Buscando dados de pagamentos para resumo...');
        paymentsData = await PaymentService.getPayments();
        console.log('Pagamentos encontrados para resumo:', paymentsData.length);
      } catch (error) {
        console.error('Erro ao buscar pagamentos para resumo:', error);
      }
      
      // Aplicar dados de pagamento às ordens
      const ordersWithPayments = allOrders.map(order => {
        const payment = paymentsData.find(p => p.order?.id === order.id);
        
        if (payment) {
          return {
            ...order,
            paymentDate: payment.moment,
            status: payment.status === 'PAID' ? 'PAID' as const : order.status
          };
        }
        
        return order;
      });
      
      // Calcular resumo financeiro
      const unpaidOrders = ordersWithPayments.filter(order => order.status !== 'PAID');
      const paidOrders = ordersWithPayments.filter(order => order.status === 'PAID');
      
      const unpaidTotal = Utils.calculateUnpaidOrdersTotal(unpaidOrders);
      const paidTotal = paidOrders.reduce((total, order) => total + Utils.calculateOrderTotal(order.items), 0);
      const grandTotal = ordersWithPayments.reduce((total, order) => total + Utils.calculateOrderTotal(order.items), 0);
      
      setFinancialSummary({
        unpaidTotal,
        unpaidCount: unpaidOrders.length,
        paidTotal,
        paidCount: paidOrders.length,
        grandTotal,
        totalCount: ordersWithPayments.length
      });
      
      console.log('Resumo financeiro calculado:', {
        unpaidTotal,
        unpaidCount: unpaidOrders.length,
        paidTotal,
        paidCount: paidOrders.length,
        grandTotal,
        totalCount: ordersWithPayments.length
      });
      
    } catch (error) {
      console.error('Erro ao carregar resumo financeiro:', error);
      // Manter valores zerados em caso de erro
      setFinancialSummary({
        unpaidTotal: 0,
        unpaidCount: 0,
        paidTotal: 0,
        paidCount: 0,
        grandTotal: 0,
        totalCount: 0
      });
    }
  };

  // Função para recarregar todos os dados
  const reloadData = async (page = currentPage) => {
    try {
      setIsLoading(true);
      
      console.log('Dashboard - Informações do usuário:');
      console.log('- User:', user);
      console.log('- Roles:', user.roles);
      console.log('- IsAdmin:', isAdmin);
      console.log('- canAccessAllOrders:', Utils.canAccessAllOrders(user));
      console.log('- canOnlyViewOwnOrders:', Utils.canOnlyViewOwnOrders(user));
      
      // Carregar ordens e produtos separadamente para melhor tratamento de erro
      let ordersResponse: OrderDetailed[] = [];
      let productsResponse: Product[] = [];
      
      try {
        console.log('Tentando carregar ordens...');
        console.log('Usuário:', { id: user.id, isAdmin });
        console.log('Paginação:', { page, size: pageSize, sort: sortOrder });
        
        let ordersData;
        
        const paginationParams = {
          page,
          size: pageSize,
          sort: sortOrder
        };
        
        if (isAdmin) {
          console.log('Carregando ordens como ADMIN');
          ordersData = await OrderService.getAllOrdersForAdmin(paginationParams);
        } else if (Utils.isUserClient(user)) {
          console.log('Carregando ordens como CLIENT para userId:', user.id);
          ordersData = await OrderService.getOrders({ ...paginationParams, userId: user.id });
        } else if (Utils.isUserNormal(user)) {
          console.log('Carregando ordens como USER para userId:', user.id);
          ordersData = await OrderService.getOrders({ ...paginationParams, userId: user.id });
        } else {
          console.log('Tipo de usuário não reconhecido, carregando ordens gerais');
          ordersData = await OrderService.getOrders({ ...paginationParams, userId: user.id });
        }
        
        ordersResponse = ordersData.content || [];
        setTotalPages(ordersData.totalPages || 0);
        setTotalElements(ordersData.totalElements || 0);
        setCurrentPage(page);
        console.log('Ordens carregadas:', {
          total: ordersResponse?.length || 0,
          totalElements: ordersData.totalElements,
          totalPages: ordersData.totalPages,
          currentPage: page
        });
      } catch (error) {
        console.error('Erro ao carregar ordens:', error);
        ordersResponse = [];
        setTotalPages(0);
        setTotalElements(0);
      }
      
      try {
        productsResponse = await ProductService.getProducts();
        console.log('Produtos carregados:', productsResponse?.length || 0);
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        // Em caso de erro, inicializa como array vazio
        productsResponse = [];
      }

      // Buscar todos os pagamentos de uma vez
      let paymentsData: any[] = [];
      try {
        console.log('Buscando dados de pagamentos...');
        paymentsData = await PaymentService.getPayments();
        console.log('Pagamentos encontrados:', paymentsData.length);
        console.log('Primeiro pagamento:', paymentsData[0]);
      } catch (error) {
        console.error('Erro ao buscar pagamentos:', error);
      }

      // Aplicar dados de pagamento às ordens
      const ordersWithPayments = ordersResponse.map(order => {
        // Procurar pagamento correspondente a esta ordem
        const payment = paymentsData.find(p => p.order?.id === order.id);
        
        if (payment) {
          console.log(`Encontrado pagamento para ordem ${order.id}:`, payment);
          return {
            ...order,
            paymentDate: payment.moment, // Usar o campo 'moment' como paymentDate
            // Se o pagamento está como PAID, atualizar o status da ordem também
            status: payment.status === 'PAID' ? 'PAID' as const : order.status
          };
        }
        
        return order;
      });

      setProducts(productsResponse);
      
      // Para admin, mostra todas as ordens; para usuários normais, a API já filtrou pelo userId
      setOrders(ordersWithPayments);
      
      console.log('Dashboard carregado - Ordens:', ordersWithPayments.length, 'Produtos:', productsResponse.length);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Definir valores padrão em caso de erro
      setAllOrders([]);
      setOrders([]);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      reloadData(0);
      loadFinancialSummary(); // Carregar resumo financeiro
    }
  }, [user.id, isAdmin]);

  // useEffect separado para mudanças de página/tamanho/ordenação
  useEffect(() => {
    if (!isFirstLoad) {
      setCurrentPage(0);
      reloadData(0);
    }
  }, [pageSize, sortOrder]);

  // Funções de navegação de página
  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      reloadData(page);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0); // Voltar para primeira página
  };

  const handleSortChange = (newSort: string) => {
    setSortOrder(newSort);
    setCurrentPage(0); // Voltar para primeira página
  };

  // Com paginação, os filtros são aplicados no servidor
  // Por enquanto, mantemos o filtro local para funcionalidade básica
  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toString().includes(searchTerm) ||
      `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      Utils.formatOrderStatus(order.status) === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Função para aplicar filtros (recarregar primeira página)
  const applyFilters = () => {
    setCurrentPage(0);
    reloadData(0);
  };

  const getStatusBadge = (status: 'PENDING' | 'READY' | 'PAID') => {
    const displayStatus = Utils.formatOrderStatus(status);
    const colors = {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Pronto': 'bg-blue-100 text-blue-800',
      'Pago': 'bg-green-100 text-green-800'
    };

    return (
      <Badge className={colors[displayStatus]}>
        {displayStatus}
      </Badge>
    );
  };

  const handleOrderUpdate = async (updatedOrder: OrderDetailed) => {
    try {
      // Calcula totais
      const calculatedTotal = Utils.calculateOrderTotal(updatedOrder.items);
      const totalQuantity = updatedOrder.items.reduce((sum, item) => sum + item.quantity, 0);
      
      // Converte para formato da API conforme estrutura do Postman
      const orderForAPI: any = {
        serviceDescription: updatedOrder.serviceDescription,
        observation: updatedOrder.observation,
        status: updatedOrder.status,
        total: calculatedTotal,
        totalQuantity: totalQuantity,
        user: {
          id: updatedOrder.user.id,
          firstName: updatedOrder.user.firstName,
          lastName: updatedOrder.user.lastName,
          email: updatedOrder.user.email,
          phone: updatedOrder.user.phone || '',
          roles: updatedOrder.user.roles || []
        },
        items: updatedOrder.items.map(item => {
          const subTotal = item.quantity * item.price;
          const finalItem = {
            product: {
              id: item.product.id,
              name: item.product.name,
              description: item.product.description,
              brand: item.product.brand,
              price: item.product.price
            },
            quantity: item.quantity,
            price: item.price,
            description: item.description || '',
            service: item.service || '',
            observation: item.observation || '',
            subTotal: subTotal
          };
          
          // Só inclui ID se existir e não for temporário
          const isTemporaryId = item.id && typeof item.id === 'number' && item.id >= 1000000000000;
          if (!isTemporaryId && item.id) {
            finalItem.id = item.id;
          }
          
          return finalItem;
        }),
        products: [] // Array vazio conforme estrutura da API
      };
      
      console.log('Atualizando ordem:', updatedOrder.id);
      console.log('Items originais:', updatedOrder.items.length);
      console.log('Items para API:', orderForAPI.items.length);
      console.log('Total calculado:', calculatedTotal);
      console.log('JSON completo para API:', JSON.stringify(orderForAPI, null, 2));

      // Só inclui deliveryDate se foi fornecida
      if (updatedOrder.deliveryDate) {
        orderForAPI.deliveryDate = updatedOrder.deliveryDate;
      }

      const result = await OrderService.updateOrder(updatedOrder.id, orderForAPI);
      console.log('Resultado da atualização:', result);
      
      // Recarregar todos os dados para garantir sincronização
      await reloadData();
      await loadFinancialSummary(); // Recarregar resumo financeiro
      
    } catch (error) {
      console.error('Erro detalhado ao atualizar ordem:', error);
      const updatedWithTotal = { ...updatedOrder, total: Utils.calculateOrderTotal(updatedOrder.items) };
      
      // Atualiza localmente mesmo se a API falhar
      setOrders(orders.map(order => 
        order.id === updatedOrder.id ? updatedWithTotal : order
      ));
      setAllOrders(allOrders.map(order => 
        order.id === updatedOrder.id ? updatedWithTotal : order
      ));
    } finally {
      setSelectedOrder(null);
      setStatusModalOrder(null);
      setDeliveryModalOrder(null);
      setPaymentModalOrder(null);
    }
  };

  const handleNewOrder = async (orderData: {
    serviceDescription: string;
    observation: string;
    deliveryDate?: string;
    clientId?: number;
    items: { productId: number; quantity: number; price: number }[];
  }) => {
    try {
      // Converte para formato da API
      const orderForAPI: any = {
        serviceDescription: orderData.serviceDescription,
        observation: orderData.observation,
        status: 'PENDING' as const,
        user: { id: orderData.clientId || user.id }, // Usa clientId se fornecido, senão usa o usuário atual
        items: orderData.items.map(item => ({
          product: { id: item.productId },
          quantity: item.quantity,
          price: item.price
        }))
      };

      // Só inclui deliveryDate se foi fornecida
      if (orderData.deliveryDate) {
        orderForAPI.deliveryDate = orderData.deliveryDate;
      }

      await OrderService.createOrder(orderForAPI);
      
      // Recarregar todos os dados para garantir sincronização
      await reloadData();
      await loadFinancialSummary(); // Recarregar resumo financeiro
      
    } catch (error) {
      console.error('Erro ao criar ordem:', error);
      // Mock order para fallback
      const mockOrder: OrderDetailed = {
        id: Date.now(),
        serviceDescription: orderData.serviceDescription,
        observation: orderData.observation,
        deliveryDate: orderData.deliveryDate || '',
        status: 'PENDING',
        user: user,
        items: [],
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdate: new Date().toISOString().split('T')[0],
        total: 0
      };
      setOrders([mockOrder, ...orders]);
      setAllOrders([mockOrder, ...allOrders]);
    } finally {
      setShowNewOrderModal(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-3 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl truncate">Sistema de Ordens de Serviço</h1>
            <p className="text-muted-foreground text-sm">
              {isAdmin ? 'Administrador' : Utils.isUserClient(user) ? 'Cliente' : 'Usuário'} - {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
            {isAdmin && (
              <Button variant="outline" onClick={onOpenAdmin} className="flex-1 sm:flex-none">
                <Settings className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Painel Admin</span>
                <span className="sm:hidden">Admin</span>
              </Button>
            )}
            <Button variant="outline" onClick={onLogout} className="flex-1 sm:flex-none">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
              <span className="sm:hidden">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        {/* Resumo Financeiro */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-red-600 truncate">Ordens Não Pagas</p>
                    <p className="text-xl sm:text-2xl text-red-800 truncate">
                      {Utils.formatCurrency(financialSummary.unpaidTotal)}
                    </p>
                    <p className="text-xs text-red-500 truncate">
                      {financialSummary.unpaidCount} ordens pendentes
                    </p>
                  </div>
                  <div className="text-red-400 flex-shrink-0 ml-2">
                    <CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-green-600 truncate">Ordens Pagas</p>
                    <p className="text-xl sm:text-2xl text-green-800 truncate">
                      {Utils.formatCurrency(financialSummary.paidTotal)}
                    </p>
                    <p className="text-xs text-green-500 truncate">
                      {financialSummary.paidCount} ordens pagas
                    </p>
                  </div>
                  <div className="text-green-400 flex-shrink-0 ml-2">
                    <CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-blue-600 truncate">Total Geral</p>
                    <p className="text-xl sm:text-2xl text-blue-800 truncate">
                      {Utils.formatCurrency(financialSummary.grandTotal)}
                    </p>
                    <p className="text-xs text-blue-500 truncate">
                      {financialSummary.totalCount} ordens no total
                    </p>
                  </div>
                  <div className="text-blue-400 flex-shrink-0 ml-2">
                    <CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros */}
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar por cliente ou número..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters();
                      }
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Pronto">Pronto</SelectItem>
                    <SelectItem value="Pago">Pago</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={applyFilters}
                  className="w-full sm:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
              </div>
              {isAdmin && (
                <Button onClick={() => setShowNewOrderModal(true)} className="w-full sm:w-auto sm:self-end">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova OS
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de Ordens */}
        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-2">Carregando ordens...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma ordem encontrada</p>
              </div>
            ) : (
              <>
                {/* Tabela Desktop */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Número da OS</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Entrega</TableHead>
                        <TableHead>Atualização</TableHead>
                        <TableHead>Pagamento</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.user.firstName} {order.user.lastName}</TableCell>
                          <TableCell>R$ {(order.total || 0).toFixed(2)}</TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>
                            {order.deliveryDate ? Utils.formatDate(order.deliveryDate) : '-'}
                          </TableCell>
                          <TableCell>
                            {order.lastUpdate ? Utils.formatDate(order.lastUpdate) : '-'}
                          </TableCell>
                          <TableCell>
                            {order.paymentDate ? 
                              Utils.formatDate(order.paymentDate) : 
                              '-'
                            }
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                                title="Visualizar"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {canManageOrders && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStatusModalOrder(order)}
                                    title="Alterar Status"
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setDeliveryModalOrder(order)}
                                    title="Registrar Entrega"
                                  >
                                    <Truck className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPaymentModalOrder(order)}
                                    title="Registrar Pagamento"
                                  >
                                    <CreditCard className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Cards Mobile */}
                <div className="md:hidden space-y-3">
                  {filteredOrders.map((order) => (
                    <MobileOrderCard
                      key={order.id}
                      order={order}
                      canManageOrders={canManageOrders}
                      onViewDetails={setSelectedOrder}
                      onChangeStatus={setStatusModalOrder}
                      onRegisterDelivery={setDeliveryModalOrder}
                      onRegisterPayment={setPaymentModalOrder}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
          
          {/* Controles de Paginação */}
          {!isLoading && totalPages > 0 && (
            <div className="border-t bg-gray-50 px-6 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Informações da página */}
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredOrders.length} de {totalElements} registros
                  {totalPages > 1 && (
                    <span> - Página {currentPage + 1} de {totalPages}</span>
                  )}
                </div>

                {/* Controles */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {/* Seletor de tamanho da página */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Itens por página:</span>
                    <Select 
                      value={pageSize.toString()} 
                      onValueChange={(value) => handlePageSizeChange(Number(value))}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Seletor de ordenação */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Ordenar por:</span>
                    <Select 
                      value={sortOrder} 
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id,desc">ID (Mais recente)</SelectItem>
                        <SelectItem value="id,asc">ID (Mais antigo)</SelectItem>
                        <SelectItem value="status,asc">Status</SelectItem>
                        <SelectItem value="createdDate,desc">Data (Mais recente)</SelectItem>
                        <SelectItem value="createdDate,asc">Data (Mais antigo)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Navegação de páginas */}
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>

                        {/* Páginas */}
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i;
                          } else if (currentPage < 3) {
                            pageNum = i;
                          } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 5 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => handlePageChange(pageNum)}
                                isActive={pageNum === currentPage}
                                className="cursor-pointer"
                              >
                                {pageNum + 1}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        {totalPages > 5 && currentPage < totalPages - 3 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(totalPages - 1)}
                                className="cursor-pointer"
                              >
                                {totalPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Modais */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          products={products}
          isAdmin={canManageOrders}
          onClose={() => setSelectedOrder(null)}
          onSave={handleOrderUpdate}
        />
      )}

      {statusModalOrder && (
        <StatusChangeModal
          order={statusModalOrder}
          onClose={() => setStatusModalOrder(null)}
          onSave={handleOrderUpdate}
        />
      )}

      {deliveryModalOrder && (
        <DeliveryModal
          order={deliveryModalOrder}
          onClose={() => setDeliveryModalOrder(null)}
          onSave={handleOrderUpdate}
        />
      )}

      {paymentModalOrder && (
        <PaymentModal
          order={paymentModalOrder}
          onClose={() => setPaymentModalOrder(null)}
          onSave={handleOrderUpdate}
        />
      )}

      {showNewOrderModal && (
        <NewOrderModal
          products={products}
          isAdmin={isAdmin}
          currentUser={user}
          onClose={() => setShowNewOrderModal(false)}
          onSave={handleNewOrder}
        />
      )}
    </div>
  );
}