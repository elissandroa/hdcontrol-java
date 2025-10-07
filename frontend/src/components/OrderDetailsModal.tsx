import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ProductSelector } from './ProductSelector';
import { ItemEditModal } from './ItemEditModal';
import { Edit, Trash2 } from 'lucide-react';
import { type OrderDetailed, type Product, type OrderItemDetailed, Utils } from '../services/api';

interface OrderDetailsModalProps {
  order: OrderDetailed;
  products: Product[];
  isAdmin: boolean;
  onClose: () => void;
  onSave: (order: OrderDetailed) => void;
}

export function OrderDetailsModal({ order, products, isAdmin, onClose, onSave }: OrderDetailsModalProps) {
  const [editingOrder, setEditingOrder] = useState<OrderDetailed>(order);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItemDetailed | null>(null);

  const handleSave = () => {
    onSave(editingOrder);
    setIsEditing(false);
    onClose();
  };

  const handleCancel = () => {
    setEditingOrder(order);
    setIsEditing(false);
  };

  const addProduct = (product: Product, quantity: number, customPrice?: number) => {
    const newItem: OrderItemDetailed = {
      id: Date.now(), // ID temporário para itens novos
      product: product,
      quantity: quantity,
      price: customPrice ?? product.price,
      description: '',
      service: '',
      observation: '',
      subTotal: quantity * (customPrice ?? product.price)
    };
    
    setEditingOrder({
      ...editingOrder,
      items: [...editingOrder.items, newItem],
      total: Utils.calculateOrderTotal([...editingOrder.items, newItem])
    });
  };

  const removeProduct = (index: number) => {
    const newItems = editingOrder.items.filter((_, i) => i !== index);
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      total: Utils.calculateOrderTotal(newItems)
    });
  };

  const removeProductById = (itemId: number) => {
    const newItems = editingOrder.items.filter(item => item.id !== itemId);
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      total: Utils.calculateOrderTotal(newItems)
    });
  };

  const updateItem = (updatedItem: OrderItemDetailed) => {
    const newItems = editingOrder.items.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    );
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      total: Utils.calculateOrderTotal(newItems)
    });
  };

  const updateProductQuantity = (index: number, quantity: number) => {
    const newItems = editingOrder.items.map((item, i) => 
      i === index ? { ...item, quantity } : item
    );
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      total: Utils.calculateOrderTotal(newItems)
    });
  };

  const updateProductPrice = (index: number, price: number) => {
    const newItems = editingOrder.items.map((item, i) => 
      i === index ? { ...item, price } : item
    );
    setEditingOrder({
      ...editingOrder,
      items: newItems,
      total: Utils.calculateOrderTotal(newItems)
    });
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

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Ordem de Serviço #{order.id}
            {isEditing && <span className="text-muted-foreground text-sm sm:text-base"> (Editando)</span>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <Label>Cliente</Label>
              <Input 
                value={`${editingOrder.user.firstName} ${editingOrder.user.lastName}`} 
                disabled 
                className="bg-gray-50"
              />
            </div>
            <div>
              <Label>Status</Label>
              {isEditing && isAdmin ? (
                <Select 
                  value={editingOrder.status} 
                  onValueChange={(value: 'PENDING' | 'READY' | 'PAID') => 
                    setEditingOrder({ ...editingOrder, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendente</SelectItem>
                    <SelectItem value="READY">Pronto</SelectItem>
                    <SelectItem value="PAID">Pago</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="p-2">
                  {getStatusBadge(editingOrder.status)}
                </div>
              )}
            </div>
            <div>
              <Label>Data de Entrega</Label>
              <Input 
                type="date"
                value={editingOrder.deliveryDate || ''}
                onChange={(e) => setEditingOrder({ ...editingOrder, deliveryDate: e.target.value })}
                disabled={!isEditing || !isAdmin}
              />
            </div>
            <div>
              <Label>Total</Label>
              <Input 
                value={`R$ ${(editingOrder.total || 0).toFixed(2)}`} 
                disabled 
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Descrição do Serviço */}
          <div>
            <Label>Descrição do Serviço</Label>
            <Textarea
              value={editingOrder.serviceDescription || ''}
              onChange={(e) => setEditingOrder({ ...editingOrder, serviceDescription: e.target.value })}
              disabled={!isEditing || !isAdmin}
              rows={3}
            />
          </div>

          {/* Observações */}
          <div>
            <Label>Observações</Label>
            <Textarea
              value={editingOrder.observation || ''}
              onChange={(e) => setEditingOrder({ ...editingOrder, observation: e.target.value })}
              disabled={!isEditing || !isAdmin}
              rows={3}
            />
          </div>

          <Separator />

          {/* Produtos */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3>Produtos/Serviços</h3>
              {isEditing && isAdmin && (
                <ProductSelector products={products} isAdmin={isAdmin} onAddProduct={addProduct} />
              )}
            </div>

            <div className="space-y-3">
              {editingOrder.items.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="border rounded-lg p-4 space-y-3">
                  {/* Cabeçalho do item */}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProduct(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Informações básicas do item */}
                  <div className={`grid gap-4 text-sm ${isAdmin ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'}`}>
                    <div>
                      <Label className="text-xs">Quantidade</Label>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Valor Unitário</Label>
                      <p className="font-medium">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="text-xs">Subtotal</Label>
                      <p className="font-medium text-green-600">R$ {(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                    {/* Preço Original - apenas para Admin */}
                    {isAdmin && (
                      <div>
                        <Label className="text-xs">Preço Original</Label>
                        <p className="text-muted-foreground">R$ {item.product.price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>

                  {/* Descrição específica do item */}
                  {item.description && (
                    <div>
                      <Label className="text-xs">Descrição do Item</Label>
                      <p className="text-sm">{item.description}</p>
                    </div>
                  )}

                  {/* Serviço executado */}
                  {item.service && (
                    <div>
                      <Label className="text-xs">Serviço Executado</Label>
                      <p className="text-sm">{item.service}</p>
                    </div>
                  )}

                  {/* Observações do item */}
                  {item.observation && (
                    <div>
                      <Label className="text-xs">Observações do Item</Label>
                      <p className="text-sm">{item.observation}</p>
                    </div>
                  )}
                </div>
              ))}
              
              {editingOrder.items.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum produto adicionado
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-between pt-4">
            <div className="flex gap-2">
              {!isEditing && isAdmin ? (
                <Button onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
              ) : isEditing ? (
                <>
                  <Button onClick={handleSave}>
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancelar
                  </Button>
                </>
              ) : null}
            </div>
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Modal de edição de item */}
      {editingItem && (
        <ItemEditModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={updateItem}
          onDelete={removeProductById}
        />
      )}
    </Dialog>
  );
}