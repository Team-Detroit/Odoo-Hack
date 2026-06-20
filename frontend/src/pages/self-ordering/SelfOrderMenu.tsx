import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { Product } from '../../types/product';

interface CartItem { product: Product; qty: number; }

export const SelfOrderMenu: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: productService.mockGetAll });
  const { data: categories = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catFilter, setCatFilter] = useState('');
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState('');
  const [view, setView] = useState<'menu' | 'cart' | 'tracking'>('menu');
  const [orderPlaced, setOrderPlaced] = useState(false);

  const addToCart = (p: Product) => setCart(prev => { const ex = prev.find(i => i.product.id === p.id); return ex ? prev.map(i => i.product.id === p.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { product: p, qty: 1 }]; });
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.product.id !== id));
  const filtered = products.filter(p => !catFilter || p.categoryId === catFilter);
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  if (view === 'tracking') return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-3">🍳</div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Placed!</h2>
        <div className="flex justify-between mb-6">
          {['To Cook', 'Preparing', 'Completed'].map((s, i) => (
            <div key={s} className={`flex-1 text-center ${i === 0 ? 'text-teal-600' : 'text-gray-300'}`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-400'}`}>{i + 1}</div>
              <p className="text-xs">{s}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500">Your order is being prepared. We'll notify you when it's ready.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="bg-teal-700 text-white px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg">☕ Odoo Cafe</h1>
          <div className="flex items-center gap-3">
            {view === 'menu' && <span className="text-xs text-teal-200">Table: {token}</span>}
            <button onClick={() => setView(view === 'cart' ? 'menu' : 'cart')} className="relative">
              🛒
              {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {view === 'menu' && (
        <div className="flex-1 p-4">
          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <button onClick={() => setCatFilter('')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${!catFilter ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600'}`}>All</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setCatFilter(c.id)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${catFilter === c.id ? 'text-white' : 'bg-gray-100 text-gray-600'}`} style={catFilter === c.id ? { backgroundColor: c.color } : {}}>{c.name}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-24 flex items-center justify-center text-3xl" style={{ backgroundColor: (p.category?.color ?? '#6B7280') + '22' }}>🍽️</div>
                <div className="p-3">
                  <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.category?.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-teal-600">₹{p.price}</span>
                    <button onClick={() => addToCart(p)} className="px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-medium hover:bg-teal-700">+ Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'cart' && (
        <div className="flex-1 p-4 flex flex-col">
          <h2 className="font-semibold text-gray-800 mb-4">Your Cart</h2>
          {cart.length === 0 ? <p className="text-center text-gray-400 py-8">Cart is empty</p> : (
            <>
              <div className="flex-1 space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-teal-600 font-bold">₹{item.product.price * item.qty}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => item.qty > 1 ? addToCart(item.product) : removeFromCart(item.product.id)} className="w-6 h-6 rounded-full bg-gray-200 text-sm flex items-center justify-center">−</button>
                      <span className="text-sm font-bold">{item.qty}</span>
                      <button onClick={() => addToCart(item.product)} className="w-6 h-6 rounded-full bg-teal-100 text-sm flex items-center justify-center">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mb-3">
                <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                <button onClick={() => setCouponApplied(coupon)} className="px-3 py-2 bg-gray-100 text-sm rounded-lg hover:bg-gray-200">Apply</button>
              </div>
              {couponApplied && <p className="text-xs text-green-600 mb-3">✓ Coupon applied: {couponApplied}</p>}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-1 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-800"><span>Total</span><span>₹{subtotal.toFixed(2)}</span></div>
              </div>
              <button onClick={() => { setOrderPlaced(true); setView('tracking'); }} className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700">Place Order</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
