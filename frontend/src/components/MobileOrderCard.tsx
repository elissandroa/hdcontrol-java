import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Eye, RotateCcw, Truck, CreditCard } from 'lucide-react';
import { type OrderDetailed, Utils } from '../services/api';

interface MobileOrderCardProps {
  order: OrderDetailed;
  canManageOrders: boolean;
  onViewDetails: (order: OrderDetailed) => void;
  onChangeStatus: (order: OrderDetailed) => void;
  onRegisterDelivery: (order: OrderDetailed) => void;
  onRegisterPayment: (order: OrderDetailed) => void;
}

export function MobileOrderCard({
  order,
  canManageOrders,
  onViewDetails,
  onChangeStatus,
  onRegisterDelivery,
  onRegisterPayment
}: MobileOrderCardProps) {
  const getStatusBadge = (status: 'PENDING' | 'READY' | 'PAID') => {
    const displayStatus = Utils.formatOrderStatus(status);
    const variants = {
      'Pendente': 'secondary',
      'Pronto': 'default',
      'Pago': 'default'
    } as const;
    
    const colors = {
      'Pendente': 'bg-yellow-100 text-yellow-800',
      'Pronto': 'bg-blue-100 text-blue-800',
      'Pago': 'bg-green-100 text-green-800'
    };

    return (
      <Badge variant={variants[displayStatus]} className={colors[displayStatus]}>
        {displayStatus}
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col space-y-3">
          {/* Header com OS e Status */}
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">OS #{order.id}</div>
              <div className="text-sm text-muted-foreground">
                {order.user.firstName} {order.user.lastName}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {getStatusBadge(order.status)}
              <div className="text-sm font-medium">
                R$ {(order.total || 0).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            {order.deliveryDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Entrega:</span>
                <span>{Utils.formatDate(order.deliveryDate)}</span>
              </div>
            )}
            {order.lastUpdate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Atualização:</span>
                <span>{Utils.formatDate(order.lastUpdate)}</span>
              </div>
            )}
            {order.paymentDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pagamento:</span>
                <span>{Utils.formatDate(order.paymentDate)}</span>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-1" />
              Ver
            </Button>
            {canManageOrders && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onChangeStatus(order)}
                  title="Alterar Status"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegisterDelivery(order)}
                  title="Registrar Entrega"
                >
                  <Truck className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegisterPayment(order)}
                  title="Registrar Pagamento"
                >
                  <CreditCard className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}