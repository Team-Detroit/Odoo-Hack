import React from 'react';

export const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Total Orders (Today)</div>
          <div className="text-3xl font-bold mt-2 text-teal-600">24</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Revenue (Today)</div>
          <div className="text-3xl font-bold mt-2 text-green-600">₹12,450</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Avg Order Value</div>
          <div className="text-3xl font-bold mt-2 text-blue-600">₹519</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-600 text-sm font-medium">Active Tables</div>
          <div className="text-3xl font-bold mt-2 text-orange-600">8</div>
        </div>
      </div>
    </div>
  );
};
