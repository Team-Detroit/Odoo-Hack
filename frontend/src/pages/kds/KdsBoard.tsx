import React, { useState } from 'react';
import { Input } from '../../components/common/Input';

export const KdsBoard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickets] = useState<any[]>([]);

  return (
    <div className="p-4 h-full overflow-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Kitchen Display System</h1>
        <Input
          type="text"
          placeholder="Search by order or product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-80"
        />
      </div>

      {/* KDS Stages */}
      <div className="grid grid-cols-3 gap-4 h-full">
        {/* To Cook */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-red-800 mb-4">To Cook</h2>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {tickets.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tickets</p>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="bg-white p-4 rounded border-l-4 border-red-500 cursor-pointer hover:shadow-md"
                >
                  <p className="font-bold">Ticket #{ticket.ticketNumber}</p>
                  <p className="text-sm text-gray-600">Table {ticket.table}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Preparing */}
        <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Preparing</h2>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <p className="text-gray-500 text-center py-8">No tickets</p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Completed</h2>
          <div className="space-y-3 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <p className="text-gray-500 text-center py-8">No tickets</p>
          </div>
        </div>
      </div>
    </div>
  );
};
