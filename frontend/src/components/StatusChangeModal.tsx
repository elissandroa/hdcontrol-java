import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { type OrderDetailed, Utils, OrderService } from '../services/api';

interface StatusChangeModalProps {
  order: OrderDetailed;
  onClose: () => void;
  onSave: (order: OrderDetailed) => void;
}

export function StatusChangeModal({ order, onClose, onSave }: StatusChangeModalProps) {
  const [status, setStatus] = useState<'PENDING' | 'READY' | 'PAID'>(order.status);
  const [observation, setObservation] = useState(order.observation || '');

  const handleSave = async () => {
    try {
      // 1. Atualizar a ordem no banco com novo status
      const calculatedTotal = Utils.calculateOrderTotal(order.items);
      const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
      
      const orderUpdateData = {
        serviceDescription: order.serviceDescription,
        observation: observation,
        status: status,
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

      console.log('Atualizando status da ordem no banco:', order.id, 'para:', status);
      await OrderService.updateOrder(order.id, orderUpdateData);

      // 2. Atualizar localmente
      const updatedOrder = {
        ...order,
        status,
        observation,
        lastUpdate: new Date().toISOString().split('T')[0]
      };

      console.log('Alteração de status concluída:', updatedOrder);
      onSave(updatedOrder);
      onClose();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status: ' + (error?.message || 'Verifique sua conexão.'));
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Status - OS #{order.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Cliente</Label>
            <div className="p-2 bg-gray-50 rounded">
              {order.user.firstName} {order.user.lastName}
            </div>
          </div>

          <div>
            <Label>Status Atual</Label>
            <div className="p-2 bg-gray-50 rounded">
              {Utils.formatOrderStatus(order.status)}
            </div>
          </div>

          <div>
            <Label>Novo Status</Label>
            <Select value={status} onValueChange={(value: 'PENDING' | 'READY' | 'PAID') => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="READY">Pronto</SelectItem>
                <SelectItem value="PAID">Pago</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Adicione observações sobre a mudança de status..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}