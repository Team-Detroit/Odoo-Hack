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
import { 
  Banknote, 
  CreditCard, 
  Smartphone, 
  Trash2, 
  Percent, 
  Send, 
  Check, 
  QrCode 
} from 'lucide-react';

// Food images mapping based on product name/category
const getProductImage = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes('espresso')) {
    return 'https://images.unsplash.com/photo-1510707577719-0d85837a3d41?w=300&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('cappuccino') || normalized.includes('coffee') || normalized.includes('latte')) {
    return 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=300&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('croissant') || normalized.includes('pastry') || normalized.includes('bakery')) {
    return 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('sandwich') || normalized.includes('burger')) {
    return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=300&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('iced tea') || normalized.includes('tea') || normalized.includes('juice') || normalized.includes('drink')) {
    return 'https://images.unsplash.com/photo-1499638472904-ea5c6178a300?w=300&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80';
};

// ── Category Tabs ──────────────────────────────────────────────────────────
const CategoryTabs: React.FC<{ selected: string; onSelect: (id: string) => void }> = ({ selected, onSelect }) => {
  const { data: cats = [] } = useQuery({ queryKey: ['categories'], queryFn: categoryService.mockGetAll });
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 scrollbar-none">
      <button 
        onClick={() => onSelect('')} 
        className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-250 cursor-pointer shadow-sm border ${
          !selected 
            ? 'bg-odoo-purple text-white border-odoo-purple' 
            : 'bg-white text-gray-700 border-gray-200 hover:border-odoo-purple hover:text-odoo-purple'
        }`}
      >
        All Products
      </button>
      {cats.map(c => (
        <button 
          key={c.id} 
          onClick={() => onSelect(c.id)}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-250 cursor-pointer shadow-sm border ${
            selected === c.id 
              ? 'text-white border-transparent' 
              : 'bg-white text-gray-700 border-gray-200 hover:border-odoo-purple hover:text-odoo-purple'
          }`}
          style={selected === c.id ? { backgroundColor: c.color || '#714B67', borderColor: c.color || '#714B67' } : {}}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
};

// ── Product Card ───────────────────────────────────────────────────────────
const ProductCard: React.FC<{ product: Product; onAdd: (p: Product) => void }> = ({ product, onAdd }) => (
  <button 
    onClick={() => onAdd(product)}
    className="bg-white border border-gray-200 rounded-xl p-3 text-left hover:border-odoo-purple hover:shadow-md transition-all duration-250 group w-full cursor-pointer flex flex-col justify-between h-48"
  >
    <div className="w-full h-24 rounded-lg overflow-hidden mb-2 bg-gray-100 shrink-0 relative">
      <img 
        src={getProductImage(product.name)} 
        alt={product.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-gray-800 truncate group-hover:text-odoo-purple transition-colors">{product.name}</p>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{product.category?.name}</p>
    </div>
    <p className="text-sm text-odoo-teal font-extrabold mt-1 shrink-0">₹{product.price.toFixed(2)}</p>
  </button>
);

// ── Cart Item Row ──────────────────────────────────────────────────────────
const CartItemRow: React.FC<{ productId: string }> = ({ productId }) => {
  const { items, updateQty, removeItem } = useCartStore();
  const item = items.find(i => i.productId === productId);
  if (!item) return null;
  return (
    <div className="flex items-center gap-2.5 py-3.5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-850 truncate">{item.product.name}</p>
        <p className="text-[10px] text-gray-400 font-medium">₹{item.unitPrice.toFixed(2)} each</p>
      </div>
      <div className="flex items-center gap-1.5 bg-gray-100 p-0.5 rounded-md">
        <button 
          onClick={() => updateQty(productId, item.quantity - 1)} 
          className="w-5.5 h-5.5 rounded bg-white text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer"
        >
          −
        </button>
        <span className="w-5 text-center text-xs font-bold text-gray-800">{item.quantity}</span>
        <button 
          onClick={() => updateQty(productId, item.quantity + 1)} 
          className="w-5.5 h-5.5 rounded bg-white text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer"
        >
          +
        </button>
      </div>
      <p className="text-xs font-extrabold text-gray-800 w-16 text-right">₹{(item.unitPrice * item.quantity).toFixed(2)}</p>
      <button 
        onClick={() => removeItem(productId)} 
        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// ── Payment Modal ──────────────────────────────────────────────────────────
const PaymentModal: React.FC<{ open: boolean; onClose: () => void; total: number; onPaid: () => void }> = ({ open, onClose, total, onPaid }) => {
  const [method, setMethod] = useState<'cash' | 'card' | 'upi'>('cash');
  const [cash, setCash] = useState('');
  const change = Number(cash) - total;
  return (
    <Modal open={open} onClose={onClose} title="Payment Methods" size="md">
      <div className="space-y-4">
        <div className="flex gap-2">
          {(['cash', 'card', 'upi'] as const).map(m => {
            const Icon = m === 'cash' ? Banknote : m === 'card' ? CreditCard : Smartphone;
            return (
              <button 
                key={m} 
                onClick={() => setMethod(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 border ${
                  method === m 
                    ? 'bg-odoo-purple text-white border-odoo-purple shadow-sm' 
                    : 'bg-white text-gray-700 border-gray-200 hover:border-odoo-purple hover:text-odoo-purple'
                }`}
              >
                <Icon className="w-4 h-4" />
                {m}
              </button>
            );
          })}
        </div>
        <div className="bg-odoo-purple-light border border-odoo-purple/10 rounded-xl p-4 text-center">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total Amount Due</p>
          <p className="text-3xl font-extrabold text-odoo-purple mt-1">₹{total.toFixed(2)}</p>
        </div>
        {method === 'cash' && (
          <div className="space-y-2">
            <Input label="Cash Received (₹)" type="number" value={cash} onChange={e => setCash(e.target.value)} placeholder="0.00" />
            {Number(cash) >= total && (
              <div className="p-3 bg-green-50 border border-green-150 rounded-lg text-sm text-green-700 font-semibold flex justify-between">
                <span>Change to Return:</span>
                <span>₹{change.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
        {method === 'card' && <Input label="Transaction Reference" placeholder="Enter reference number" />}
        {method === 'upi' && (
          <div className="text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="w-36 h-36 bg-white border border-gray-200 rounded-lg mx-auto flex items-center justify-center text-gray-400">
              <QrCode className="w-24 h-24 text-gray-600" />
            </div>
            <p className="text-xs text-gray-500 font-semibold mt-3">Scan QR code using UPI App to pay ₹{total.toFixed(2)}</p>
          </div>
        )}
        <Button className="w-full" size="lg" onClick={onPaid}>
          <Check className="w-4 h-4" /> Confirm Payment
        </Button>
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
    <div className="flex h-full bg-gray-50">
      {/* Left: Products */}
      <div className="flex-1 flex flex-col p-5 overflow-hidden">
        <CategoryTabs selected={catFilter} onSelect={setCatFilter} />
        <div className="flex-1 overflow-y-auto mt-4 pr-1">
          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-6">
              <p className="text-gray-400 font-medium">No products found matching filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={addItem} />)}
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-88 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-150 flex items-center justify-between">
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">Current Cart</h3>
          {items.length > 0 && (
            <button 
              onClick={clearCart} 
              className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-2">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <p className="text-sm font-medium">Your cart is empty</p>
              <p className="text-xs text-gray-400 mt-1">Tap products on the left to add them</p>
            </div>
          ) : (
            items.map(i => <CartItemRow key={i.productId} productId={i.productId} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-150 p-5 space-y-4 bg-gray-50/50">
            {/* Coupon */}
            <div className="flex gap-2">
              <input 
                value={couponInput} 
                onChange={e => setCouponInput(e.target.value)} 
                placeholder="Promo code" 
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal" 
              />
              <Button size="sm" variant="outline" onClick={() => setCoupon(couponInput)}>Apply</Button>
            </div>
            {couponCode && (
              <div className="text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md flex items-center gap-1.5 font-semibold">
                <Check className="w-3.5 h-3.5" /> Code Applied: {couponCode}
              </div>
            )}

            {/* Totals */}
            <div className="space-y-1.5 text-xs font-semibold">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>GST Tax</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
              {totals.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 bg-green-50/50 p-1.5 rounded">
                  <span className="flex items-center gap-1"><Percent className="w-3 h-3" /> Discount</span>
                  <span>−₹{totals.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-extrabold text-gray-800 text-sm pt-2 border-t border-gray-200">
                <span>Total Amount</span>
                <span>₹{totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Discount link */}
            <button 
              onClick={() => setDiscountOpen(true)} 
              className="text-xs text-odoo-teal hover:text-odoo-teal-hover hover:underline text-left font-bold block cursor-pointer"
            >
              + Add manual discount
            </button>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button 
                variant="outline" 
                size="md" 
                onClick={() => {}} 
                className="border-gray-300 text-gray-700"
              >
                <Send className="w-4 h-4" /> Kitchen
              </Button>
              <Button 
                size="md" 
                onClick={() => setPayOpen(true)}
              >
                Pay ₹{totals.total.toFixed(2)}
              </Button>
            </div>
          </div>
        )}
      </div>

      <PaymentModal open={payOpen} onClose={() => setPayOpen(false)} total={totals.total} onPaid={handlePaid} />

      {/* Discount Modal */}
      <Modal open={discountOpen} onClose={() => setDiscountOpen(false)} title="Manual Discount" size="sm">
        <Input label="Discount Amount (₹)" type="number" value={discountInput} onChange={e => setDiscountInput(e.target.value)} />
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={() => setDiscountOpen(false)}>Cancel</Button>
          <Button onClick={() => { setDiscount(Number(discountInput)); setDiscountOpen(false); }}>Apply</Button>
        </div>
      </Modal>
    </div>
  );
};
