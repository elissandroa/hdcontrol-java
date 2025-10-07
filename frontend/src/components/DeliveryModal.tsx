import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { type OrderDetailed, Utils } from '../services/api';

interface DeliveryModalProps {
  order: OrderDetailed;
  onClose: () => void;
  onSave: (order: OrderDetailed) => void;
}

export function DeliveryModal({ order, onClose, onSave }: DeliveryModalProps) {
  const [deliveryDate, setDeliveryDate] = useState(order.deliveryDate || '');
  const [observation, setObservation] = useState(order.observation || '');

  const handleSave = () => {
    const updatedOrder = {
      ...order,
      deliveryDate,
      observation,
      status: 'READY' as const,
      lastUpdate: new Date().toISOString().split('T')[0]
    };

    onSave(updatedOrder);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Entrega - OS #{order.id}</DialogTitle>
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
            <Label>Data de Entrega</Label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
            />
          </div>

          <div>
            <Label>Observações da Entrega</Label>
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Observações sobre a entrega..."
              rows={3}
            />
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              Ao confirmar, o status será automaticamente alterado para "Pronto".
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Confirmar Entrega
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}