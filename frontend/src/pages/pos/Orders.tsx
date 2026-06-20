import React from 'react';
import { DataTable } from '../../components/common/DataTable';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { ORDER_STATUS_COLORS } from '../../constants/orderStatus';

export const Orders: React.FC = () => {
  const [orders] = React.useState<any[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Orders</h1>
        <Input
          type="text"
          placeholder="Search by order number, customer, date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { key: 'orderNumber', label: 'Order #' },
            { key: 'customerName', label: 'Customer' },
            { key: 'amount', label: 'Amount', render: (val) => formatCurrency(val) },
            {
              key: 'status',
              label: 'Status',
              render: (status) => (
                <Badge
                  text={status}
                  variant={
                    status === 'paid'
                      ? 'success'
                      : status === 'cancelled'
                      ? 'danger'
                      : 'warning'
                  }
                />
              ),
            },
            { key: 'date', label: 'Date' },
          ]}
          data={orders}
          emptyMessage="No orders found"
        />
      </div>
    </div>
  );
};
