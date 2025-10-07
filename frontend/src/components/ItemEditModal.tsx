import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { type OrderItemDetailed } from '../services/api';

interface ItemEditModalProps {
  item: OrderItemDetailed;
  onClose: () => void;
  onSave: (item: OrderItemDetailed) => void;
  onDelete?: (itemId: number) => void;
}

export function ItemEditModal({ item, onClose, onSave, onDelete }: ItemEditModalProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [price, setPrice] = useState(item.price);
  const [description, setDescription] = useState(item.description || '');
  const [service, setService] = useState(item.service || '');
  const [observation, setObservation] = useState(item.observation || '');

  // Calcula o subtotal automaticamente
  const subTotal = quantity * price;

  const handleSave = () => {
    const updatedItem: OrderItemDetailed = {
      ...item,
      quantity,
      price,
      description,
      service,
      observation,
      subTotal
    };
    onSave(updatedItem);
    onClose();
  };

  const handleDelete = () => {
    if (item.id && onDelete && confirm('Tem certeza que deseja excluir este item?')) {
      onDelete(item.id);
      onClose();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Produto</Label>
            <div className="p-2 bg-gray-50 rounded">
              {item.product.name} - {item.product.brand}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantidade</Label>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            <div>
              <Label>Valor Unitário (R$)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <Label>Subtotal</Label>
            <div className="p-2 bg-green-50 rounded font-medium">
              R$ {subTotal.toFixed(2)}
            </div>
          </div>

          <div>
            <Label>Descrição do Item</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição específica deste item..."
            />
          </div>

          <div>
            <Label>Serviço Executado</Label>
            <Input
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="Serviço realizado neste item..."
            />
          </div>

          <div>
            <Label>Observações do Item</Label>
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Observações específicas deste item..."
              rows={3}
            />
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {item.id && onDelete && (
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Excluir Item
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}