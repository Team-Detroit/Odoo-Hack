import React, { useState } from 'react';
import { Select } from '../../components/common/Select';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const Reports: React.FC = () => {
  const [period, setPeriod] = useState('today');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <Select
            label="Period"
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'custom', label: 'Custom Range' },
            ]}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
          {period === 'custom' && (
            <>
              <Input type="date" label="From Date" />
              <Input type="date" label="To Date" />
            </>
          )}
        </div>
        <div className="flex gap-2">
          <Button>Apply Filters</Button>
          <Button variant="secondary">Export PDF</Button>
          <Button variant="secondary">Export XLS</Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Total Orders</div>
          <div className="text-3xl font-bold mt-2 text-teal-600">48</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Total Revenue</div>
          <div className="text-3xl font-bold mt-2 text-green-600">₹24,900</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Avg Order Value</div>
          <div className="text-3xl font-bold mt-2 text-blue-600">₹519</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Customers</div>
          <div className="text-3xl font-bold mt-2 text-orange-600">32</div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Sales Trend</h3>
          <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Top Categories</h3>
          <div className="h-64 bg-gray-50 flex items-center justify-center text-gray-500">
            Chart placeholder
          </div>
        </div>
      </div>
    </div>
  );
};
