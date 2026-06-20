import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Coffee, Utensils } from 'lucide-react';

export const QrMenuOnly: React.FC = () => {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: productService.mockGetAll });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });
  const [catFilter, setCatFilter] = useState('');

  const filtered = products.filter(p => !catFilter || p.categoryId === catFilter);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-teal-700 text-white px-4 py-4 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <Coffee className="w-5 h-5 text-white" />
          <h1 className="text-xl font-bold">Odoo Cafe — Menu</h1>
        </div>
        <p className="text-teal-200 text-sm mt-1">Browse our menu</p>
      </div>
      <div className="px-4 py-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button onClick={() => setCatFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${!catFilter ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setCatFilter(c.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${catFilter === c.id ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={catFilter === c.id ? { backgroundColor: c.color } : {}}>{c.name}</button>
          ))}
        </div>
      </div>
      <div className="px-4 pb-8 grid grid-cols-2 gap-3">
        {filtered.map(p => (
          <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="h-28 flex items-center justify-center" style={{ backgroundColor: (p.category?.color ?? '#6B7280') + '22' }}>
              <Utensils className="w-8 h-8 text-gray-400" />
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm text-gray-800">{p.name}</p>
              <p className="text-xs text-gray-400 mb-1">{p.category?.name}</p>
              {p.description && <p className="text-xs text-gray-400 mb-2 line-clamp-2">{p.description}</p>}
              <p className="font-bold text-teal-600">₹{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
