import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { type OrderDetailed, Utils, PaymentService, OrderService } from '../services/api';

interface PaymentModalProps {
  order: OrderDetailed;
  onClose: () => void;
  onSave: (order: OrderDetailed) => void;
}

type PaymentStatus = 'PAID' | 'CANCELED';

export function PaymentModal({ order, onClose, onSave }: PaymentModalProps) {
  const [paymentDate, setPaymentDate] = useState(
    order.paymentDate || new Date().toISOString().split('T')[0]
  );
  const [observation, setObservation] = useState(order.observation || '');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PAID');

  const handleSave = async () => {
    try {
      // 1. Criar registro de pagamento na API
      const paymentData = {
        id: order.id, // ID do pagamento deve ser igual ao ID da ordem
        moment: new Date(paymentDate).toISOString(),
        status: paymentStatus,
        order: {
          id: order.id
        }
      };
      
      console.log('Criando pagamento:', paymentData);
      const paymentResult = await PaymentService.createPayment(paymentData);
      console.log('Pagamento criado:', paymentResult);

      // 2. Atualizar a ordem no banco (só muda para PAID se o pagamento foi confirmado)
      const calculatedTotal = Utils.calculateOrderTotal(order.items);
      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
      
      // Determina o novo status da ordem baseado no status do pagamento
      const newOrderStatus = paymentStatus === 'PAID' ? 'PAID' : order.status;
      
      const orderUpdateData = {
        serviceDescription: order.serviceDescription,
        observation: observation,
        status: newOrderStatus,
        total: calculatedTotal,
        totalQuantity: totalQuantity,
        user: {
          id: order.user.id,
          firstName: order.user.firstName,
          lastName: order.user.lastName,
          email: order.user.email,
          phone: order.user.phone || '',
          roles: order.user.roles || []
        },
        items: order.items.map(item => {
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
            subTotal: item.quantity * item.price
          };
          
          // Só inclui ID se existir e não for temporário
          const isTemporaryId = item.id && typeof item.id === 'number' && item.id >= 1000000000000;
          if (!isTemporaryId && item.id) {
            finalItem.id = item.id;
          }
          
          return finalItem;
        }),
        products: []
      };

      if (order.deliveryDate) {
        orderUpdateData.deliveryDate = order.deliveryDate;
      }

      console.log('Atualizando ordem no banco com status:', newOrderStatus, orderUpdateData);
      
      // Só atualiza a ordem no banco se o pagamento foi confirmado como PAID
      if (paymentStatus === 'PAID') {
        await OrderService.updateOrder(order.id, orderUpdateData);
      }

      // 3. Atualizar a ordem localmente
      const updatedOrder = {
        ...order,
        paymentDate,
        observation,
        status: newOrderStatus,
        lastUpdate: new Date().toISOString().split('T')[0]
      };

      console.log('Salvando ordem atualizada no PaymentModal:', updatedOrder);
      onSave(updatedOrder);
      onClose();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      alert('Erro ao registrar pagamento: ' + (error?.message || 'Verifique sua conexão.'));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Pagamento - OS #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <div className="p-2 bg-gray-50 rounded">
              {order.user.firstName} {order.user.lastName}
            </div>
          </div>

          <div>
            <Label>Total da Ordem</Label>
            <div className="p-2 bg-gray-50 rounded">
              R$ {(order.total || 0).toFixed(2)}
            </div>
          </div>

          <div>
            <Label>Status Atual</Label>
            <div className="p-2 bg-gray-50 rounded">
              {Utils.formatOrderStatus(order.status)}
            </div>
          </div>

          <div>
            <Label>Status do Pagamento</Label>
            <Select value={paymentStatus} onValueChange={(value: PaymentStatus) => setPaymentStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PAID">Pago</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data do Pagamento</Label>
            <Input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Observações do Pagamento</Label>
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Observações sobre o pagamento..."
              rows={3}
            />
          </div>

          {paymentStatus === 'PAID' ? (
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-800">
                Ao confirmar, o status da ordem será automaticamente alterado para "Pago".
              </p>
            </div>
          ) : (
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-sm text-red-800">
                Ao confirmar, será registrado um pagamento cancelado. O status da ordem não será alterado.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {paymentStatus === 'PAID' ? 'Confirmar Pagamento' : 'Registrar Cancelamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}