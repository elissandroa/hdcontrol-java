import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ProductSelector } from './ProductSelector';
import { ClientSelector } from './ClientSelector';
import { type Product, type User } from '../services/api';

interface SelectedProduct {
  product: Product;
  quantity: number;
  customPrice: number;
}

interface NewOrderModalProps {
  products: Product[];
  isAdmin: boolean;
  currentUser: User;
  onClose: () => void;
  onSave: (order: {
    serviceDescription: string;
    observation: string;
    deliveryDate?: string;
    clientId?: number;
    items: { productId: number; quantity: number; price: number }[];
  }) => void;
}

export function NewOrderModal({ products, isAdmin, currentUser, onClose, onSave }: NewOrderModalProps) {
  const [serviceDescription, setServiceDescription] = useState('');
  const [observation, setObservation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(isAdmin ? null : currentUser);

  const addProduct = (product: Product, quantity: number, customPrice?: number) => {
    setSelectedProducts([...selectedProducts, { 
      product, 
      quantity, 
      customPrice: customPrice ?? product.price 
    }]);
  };

  const removeProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const updateProductQuantity = (index: number, quantity: number) => {
    setSelectedProducts(selectedProducts.map((item, i) => 
      i === index ? { ...item, quantity } : item
    ));
  };

  const updateProductPrice = (index: number, customPrice: number) => {
    setSelectedProducts(selectedProducts.map((item, i) => 
      i === index ? { ...item, customPrice } : item
    ));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => 
      total + (item.customPrice * item.quantity), 0
    );
  };

  const handleSave = () => {
    if (!serviceDescription) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (isAdmin && !selectedClient) {
      alert('Selecione um cliente para a ordem');
      return;
    }

    const orderData: any = {
      serviceDescription,
      observation,
      clientId: selectedClient?.id,
      items: selectedProducts.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.customPrice
      }))
    };

    // Só inclui deliveryDate se foi informada
    if (deliveryDate.trim()) {
      orderData.deliveryDate = deliveryDate;
    }

    onSave(orderData);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 sm:space-y-4">
          {/* Seleção de Cliente - apenas para admins */}
          {isAdmin && (
            <ClientSelector 
              selectedClient={selectedClient}
              onClientSelect={setSelectedClient}
            />
          )}

          {/* Exibir cliente para usuários não admin */}
          {!isAdmin && (
            <div>
              <Label>Cliente</Label>
              <div className="p-3 border rounded-lg bg-gray-50">
                <div className="font-medium">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentUser.email}
                </div>
              </div>
            </div>
          )}

          <div>
            <Label>Descrição do Serviço *</Label>
            <Textarea
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Descreva o serviço a ser executado..."
              rows={3}
            />
          </div>

          <div>
            <Label>Data de Entrega</Label>
            <Input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              placeholder="Opcional"
            />
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Observações adicionais..."
              rows={2}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3>Produtos/Serviços</h3>
              <ProductSelector products={products} isAdmin={isAdmin} onAddProduct={addProduct} />
            </div>

            <div className="space-y-2">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{item.product.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{item.product.brand}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
                    <div className="text-center sm:text-right">
                      <div className="text-sm">Qtd: 
                        <Input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateProductQuantity(index, parseInt(e.target.value) || 0)}
                          className="w-16 ml-2 inline-block"
                          min="1"
                        />
                      </div>
                      {isAdmin && (
                        <div className="text-xs text-muted-foreground">
                          Orig: R$ {item.product.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="text-center sm:text-right">
                      <div className="text-sm">Preço: 
                        <Input 
                          type="number"
                          value={item.customPrice}
                          onChange={(e) => updateProductPrice(index, parseFloat(e.target.value) || 0)}
                          className="w-20 ml-2 inline-block"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="text-center sm:text-right sm:min-w-[100px]">
                      <div className="text-sm font-medium">R$ {(item.quantity * item.customPrice).toFixed(2)}</div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeProduct(index)}
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
              
              {selectedProducts.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  Nenhum produto adicionado
                </div>
              )}
            </div>

            {selectedProducts.length > 0 && (
              <div className="text-right pt-4 border-t">
                <div className="text-lg font-medium">
                  Total: R$ {calculateTotal().toFixed(2)}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Criar Ordem
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}