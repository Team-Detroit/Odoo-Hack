import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { useCartStore } from '../../store/cartStore';
import { Product } from '../../types/product';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

// ── Category Tabs ──────────────────────────────────────────────────────────
const CategoryTabs: React.FC<{ selected: string; onSelect: (id: string) => void }> = ({ selected, onSelect }) => {
  const { data: cats = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 shrink-0">
      <button onClick={() => onSelect('')} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${!selected ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All</button>
      {cats.map(c => (
        <button key={c.id} onClick={() => onSelect(c.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selected === c.id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          style={selected === c.id ? { backgroundColor: c.color } : {}}>
          {c.name}
        </button>
      ))}
    </div>
  );
};

// ── Product Card ───────────────────────────────────────────────────────────
const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void }> = ({ product, onAdd }) => (
  <button onClick={() => onAdd(product)}
    className="bg-white border border-gray-200 rounded-xl p-3 text-left hover:border-teal-400 hover:shadow-sm transition-all group w-full">
    <div className="w-full h-16 rounded-lg mb-2 flex items-center justify-center text-2xl" style={{ backgroundColor: (product.category?.color ?? '#6B7280') + '22' }}>
      🍽️
    </div>
    <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
    <p className="text-xs text-teal-600 font-bold mt-0.5">₹{product.price}</p>
    <p className="text-xs text-gray-400">{product.category?.name}</p>
  </button>
);

// ── Cart Item Row ──────────────────────────────────────────────────────────
const CartItemRow: React.FC<{ productId: string }> = ({ productId }) => {
  const { items, updateQty, removeItem } = useCartStore();
  const item = items.find(i => i.productId === productId);
  if (!item) return null;
  return (
    <div className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-800 truncate">{item.product.name}</p>
        <p className="text-xs text-gray-400">₹{item.unitPrice} each</p>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => updateQty(productId, item.quantity - 1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center">−</button>
        <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
        <button onClick={() => updateQty(productId, item.quantity + 1)} className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center">+</button>
      </div>
      <p className="text-xs font-bold text-gray-800 w-14 text-right">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
      <button onClick={() => removeItem(productId)} className="text-gray-300 hover:text-red-400 transition-colors">✕</button>
    </div>
  );
};

// ── Payment Modal ──────────────────────────────────────────────────────────
const PaymentModal: React.FC<{ open: boolean; onClose: () => void; total: number; onPaid: () => void }> = ({ open, onClose, total, onPaid }) => {
  const [method, setMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [cash, setCash] = useState('');
  const change = Number(cash) - total;
  return (
    <Modal open={open} onClose={onClose} title="Payment" size="md">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['cash', 'card', 'upi'] as const).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium capitalize transition-colors ${method === m ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {m === 'cash' ? '💵' : m === 'card' ? '💳' : '📱'} {m}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-2xl font-bold text-teal-600">₹{total.toFixed(2)}</p>
        </div>
        {method === 'cash' && (
          <div>
            <Input label="Cash Received (₹)" type="number" value={cash} onChange={e => setCash(e.target.value)} placeholder="0.00" />
            {Number(cash) >= total && <p className="mt-2 text-sm text-green-600 font-medium">Change: ₹{change.toFixed(2)}</p>}
          </div>
        )}
        {method === 'card' && <Input label="Transaction Reference" placeholder="Enter reference number" />}
        {method === 'upi' && (
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg mx-auto flex items-center justify-center text-gray-400 text-sm">UPI QR</div>
            <p className="text-xs text-gray-400 mt-2">Scan to pay ₹{total.toFixed(2)}</p>
          </div>
        )}
        <Button className="w-full" size="lg" onClick={onPaid}>Confirm Payment</Button>
      </div>
    </Modal>
  );
};

// ── Main OrderView ─────────────────────────────────────────────────────────
export const OrderView: React.FC = () => {
  const ctx = useOutletContext<{ search: string }>();
  const search = ctx?.search ?? '';
  const { data: products = [], isLoading } = useQuery({ queryKey: ['products'], queryFn: productService.mockGetAll });
  const { items, totals, addItem, clearCart, couponCode, setCoupon, setDiscount } = useCartStore();
  const [catFilter, setCatFilter] = useState('');
  const [payOpen, setPayOpen] = useState(false);
  const [discountOpen, setDiscountOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [discountInput, setDiscountInput] = useState('');

  const filtered = products.filter(p => {
    const matchCat = !catFilter || p.categoryId === catFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handlePaid = () => { clearCart(); setPayOpen(false); };

  return (
    <div className="flex h-full">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <CategoryTabs selected={catFilter} onSelect={setCatFilter} />
        <div className="flex-1 overflow-y-auto mt-3">
          {isLoading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Cart</h3>
          {items.length > 0 && <button onClick={clearCart} className="text-xs text-red-400 hover:text-red-600">Clear</button>}
        </div>

        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No items yet</p>
          ) : (
            items.map(i => <CartItemRow key={i.productId} productId={i.productId} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            {/* Coupon */}
            <div className="flex gap-2">
              <input value={couponInput} onChange={e => setCouponInput(e.target.value)} placeholder="Coupon code" className="flex-1 px-2 py-1.5 text-xs border border-gray-300 rounded-md" />
              <Button size="sm" variant="outline" onClick={() => setCoupon(couponInput)}>Apply</Button>
            </div>
            {couponCode && <p className="text-xs text-green-600">✓ Coupon: {couponCode}</p>}

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{totals.subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{totals.tax.toFixed(2)}</span></div>
              {totals.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>−₹{totals.discountAmount.toFixed(2)}</span></div>}
              <div className="flex justify-between font-bold text-gray-800 text-base pt-1 border-t border-gray-100"><span>Total</span><span>₹{totals.total.toFixed(2)}</span></div>
            </div>

            {/* Discount button */}
            <button onClick={() => setDiscountOpen(true)} className="w-full text-xs text-teal-600 hover:underline text-left">+ Add manual discount</button>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" size="sm" onClick={() => {}}>Send to Kitchen</Button>
              <Button size="sm" onClick={() => setPayOpen(true)}>Pay ₹{totals.total.toFixed(2)}</Button>
            </div>
          </div>
        )}
      </div>

      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} total={totals.total} onPaid={handlePaid} />

      {/* Discount Modal */}
      <Modal open={discountOpen} onClose={() => setDiscountOpen(false)} title="Add Discount" size="sm">
        <Input label="Discount Amount (₹)" type="number" value={discountInput} onChange={e => setDiscountInput(e.target.value)} />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setDiscountOpen(false)}>Cancel</Button>
          <Button onClick={() => { setDiscount(Number(discountInput)); setDiscountOpen(false); }}>Apply</Button>
        </div>
      </Modal>
    </div>
  );
};
