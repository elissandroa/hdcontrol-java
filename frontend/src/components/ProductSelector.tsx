import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus } from 'lucide-react';
import { type Product } from '../services/api';

interface ProductSelectorProps {
  products: Product[];
  isAdmin?: boolean;
  onAddProduct: (product: Product, quantity: number, customPrice?: number) => void;
}

export function ProductSelector({ products, isAdmin = true, onAddProduct }: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState<number | ''>(0);

  const handleAdd = () => {
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (product && quantity > 0) {
      const finalPrice = typeof customPrice === 'number' ? customPrice : product.price;
      onAddProduct(product, quantity, finalPrice);
      setSelectedProductId('');
      setQuantity(1);
      setCustomPrice('');
      setIsOpen(false);
    }
  };

  const selectedProduct = products.find(p => p.id.toString() === selectedProductId);

  // Atualiza o preço customizado quando um produto é selecionado
  useEffect(() => {
    if (selectedProduct) {
      setCustomPrice(selectedProduct.price);
    }
  }, [selectedProduct]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Produto/Serviço</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Produto/Serviço</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um produto..." />
              </SelectTrigger>
              <SelectContent>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name} - {product.brand} - R$ {product.price.toFixed(2)}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-products" disabled>
                    Nenhum produto disponível
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm">
                <div><strong>Produto:</strong> {selectedProduct.name}</div>
                <div><strong>Marca:</strong> {selectedProduct.brand}</div>
                {isAdmin && (
                  <div><strong>Preço original:</strong> R$ {selectedProduct.price.toFixed(2)}</div>
                )}
              </div>
            </div>
          )}

          <div>
            <Label>Quantidade</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>

          {selectedProduct && (
            <div>
              <Label>Preço Unitário</Label>
              <Input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
                placeholder="Preço personalizado"
              />
            </div>
          )}

          {selectedProduct && quantity > 0 && typeof customPrice === 'number' && (
            <div className="text-right">
              <div className="font-medium">
                Total: R$ {(customPrice * quantity).toFixed(2)}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAdd} 
              disabled={!selectedProductId || quantity <= 0}
            >
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}