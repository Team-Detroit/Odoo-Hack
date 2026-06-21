import React, { useState, useEffect } from 'react';
import axiosInstance from '../../lib/axios';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { tableService } from '../../services/tableService';
import { sessionService } from '../../services/sessionService';
import { selfOrderingService } from '../../services/selfOrderingService';
import { Product } from '../../types/product';
import { Table } from '../../types/table';
import { Session } from '../../types/session';
import { Category } from '../../types/category';
import {
  ShoppingBag,
  CreditCard,
  Smartphone,
  CheckCircle,
  RefreshCw,
  X,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  ShoppingCart,
  Percent,
  Check,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  Search,
  Utensils,
  Banknote,
  Loader2
} from 'lucide-react';
import razorpayService from '../../services/razorpayService';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

interface CartItem {
  product: Product;
  qty: number;
}

type CheckoutStep = 'menu' | 'dining_choice' | 'customer_info' | 'payment_choice' | 'payment_details' | 'processing' | 'success';

const getProductImage = (name: string): string => {
  const normalized = name.toLowerCase();
  if (normalized.includes('espresso')) {
    return 'https://images.unsplash.com/photo-1510707577719-0d85837a3d41?w=400&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('cappuccino') || normalized.includes('coffee') || normalized.includes('latte')) {
    return 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('croissant') || normalized.includes('pastry') || normalized.includes('bakery')) {
    return 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('sandwich') || normalized.includes('burger')) {
    return 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&auto=format&fit=crop&q=80';
  }
  if (normalized.includes('iced tea') || normalized.includes('tea') || normalized.includes('juice') || normalized.includes('drink')) {
    return 'https://images.unsplash.com/photo-1499638472904-ea5c6178a300?w=400&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80';
};

export const CustomerDisplay: React.FC = () => {
  const [isSelfOrderingEnabled, setIsSelfOrderingEnabled] = useState(true);

  // DB States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [catFilter, setCatFilter] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [step, setStep] = useState<CheckoutStep>('menu');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Checkout choices
  const [diningOption, setDiningOption] = useState<'dine_in' | 'takeaway' | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [paymentOption, setPaymentOption] = useState<'online' | 'counter' | null>(null);
  const [paymentSubMethod, setPaymentSubMethod] = useState<'card' | 'upi' | null>(null);
  
  // UPI Payment states
  const [upiRefNo, setUpiRefNo] = useState('');
  
  // Card Payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Customer details states
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');

  // Results
  const [createdOrderNumber, setCreatedOrderNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successAmount, setSuccessAmount] = useState(0);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponEmailInput, setCouponEmailInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Synchronize email inputs
  useEffect(() => {
    if (custEmail) {
      setCouponEmailInput(custEmail);
    }
  }, [custEmail]);

  useEffect(() => {
    if (couponEmailInput && couponEmailInput !== custEmail) {
      setCustEmail(couponEmailInput);
    }
  }, [couponEmailInput]);

  // Fetch initial data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [prods, cats, tbls, activeSess, config] = await Promise.all([
        productService.getAll().catch(() => productService.mockProducts as any),
        categoryService.getAll().catch(() => categoryService.mockCategories as any),
        tableService.getAll().catch(() => []),
        sessionService.getActivePublic().catch(() => null),
        selfOrderingService.getConfig().catch(() => ({ isEnabled: true }))
      ]);

      setIsSelfOrderingEnabled(!!config?.isEnabled);
      const activeProds = (prods || []).filter((p: any) => p.isActive);
      const activeCats = (cats || []).filter((c: any) => c.isActive);

      setProducts(activeProds);
      setCategories(activeCats);
      setTables(tbls || []);
      setSession(activeSess);

      // Automatically select table if tableId or table is present in URL
      const searchParams = new URLSearchParams(window.location.search);
      const tableParam = searchParams.get('tableId') || searchParams.get('table');
      if (tableParam && tbls && tbls.length > 0) {
        let found = tbls.find((t: Table) => t.id === tableParam);
        if (!found) {
          const cleanNum = tableParam.replace(/\D/g, '');
          if (cleanNum) {
            found = tbls.find((t: Table) => String(t.tableNumber) === cleanNum);
          }
        }
        if (found) {
          setSelectedTable(found);
          setDiningOption('dine_in');
        }
      }
    } catch (e) {
      console.error('Error fetching customer display data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter products
  const filtered = products.filter(p => {
    const matchCat = !catFilter || p.categoryId === catFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Cart actions
  const addToCart = (p: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === p.id);
      if (existing) {
        return prev.map(item => item.product.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product: p, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== id));
    } else {
      setCart(prev => prev.map(item => item.product.id === id ? { ...item, qty } : item));
    }
  };

  const clearCart = () => setCart([]);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const tax = parseFloat((Math.max(0, subtotal - discount) * 0.05).toFixed(2)); // 5% GST
  const total = Math.max(0, subtotal - discount + tax);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) {
      setCouponError('Please enter a coupon code.');
      return;
    }
    if (!couponEmailInput.trim() || !couponEmailInput.includes('@')) {
      setCouponError('Please enter a valid email address.');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const response = await axiosInstance.post('/coupons/validate', {
        coupon: couponCodeInput.trim().toUpperCase(),
        customerEmail: couponEmailInput.trim(),
        subtotal: subtotal
      });

      if (response.data.success || (response.data && response.data.discountAmount !== undefined)) {
        const discountAmt = response.data.discountAmount;
        const finalAmt = response.data.finalAmount;
        setAppliedCoupon({
          code: couponCodeInput.trim().toUpperCase(),
          discountAmount: discountAmt,
          finalAmount: finalAmt
        });
        setCouponError('');
      } else {
        setCouponError(response.data.message || 'Failed to validate coupon.');
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Invalid coupon code or customer is not eligible.';
      setCouponError(errMsg);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput('');
    setCouponError('');
  };

  // Re-validate coupon when subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      const revalidate = async () => {
        try {
          const response = await axiosInstance.post('/coupons/validate', {
            coupon: appliedCoupon.code,
            customerEmail: couponEmailInput.trim(),
            subtotal: subtotal
          });
          if (response.data.success || (response.data && response.data.discountAmount !== undefined)) {
            setAppliedCoupon({
              code: appliedCoupon.code,
              discountAmount: response.data.discountAmount,
              finalAmount: response.data.finalAmount
            });
          } else {
            handleRemoveCoupon();
          }
        } catch {
          handleRemoveCoupon();
        }
      };
      revalidate();
    } else if (subtotal === 0 && appliedCoupon) {
      handleRemoveCoupon();
    }
  }, [subtotal]);

  const getCartCount = () => cart.reduce((sum, item) => sum + item.qty, 0);

  // Submit Order to backend DB
  const handlePlaceOrder = async () => {
    try {
      setStep('processing');
      setErrorMsg('');

      // Fetch or confirm active session
      let activeSession = session;
      if (!activeSession) {
        activeSession = await sessionService.getActivePublic();
      }
      if (!activeSession) {
        // Fallback to finding any open session in database
        const allSessions = await sessionService.getAll().catch(() => []);
        const openSession = allSessions.find(s => s.status === 'OPEN' || s.isActive);
        if (openSession) {
          activeSession = openSession;
        }
      }

      // If still no session, create one automatically so checkout doesn't fail
      if (!activeSession) {
        // Let's call /sessions backend endpoint to start one. We can check if employee/user exists
        try {
          const sessionsRes = await axiosInstance.post('/sessions', {
            openingBalance: 1000
          });
          activeSession = sessionsRes.data.data?.session || sessionsRes.data;
        } catch {
          // If creation fails, we use a fake activeSession identifier to mock,
          // but we will try to make the real call.
        }
      }

      // Calculate totals for backend payload
      const orderSubtotal = subtotal;
      const orderTax = tax;
      const orderTotal = total;

      // Select a table. If Dine In, use selectedTable. If Takeaway or select is null, grab first table id.
      let tblId = selectedTable?.id;
      if (!tblId) {
        tblId = tables.length > 0 ? tables[0].id : undefined;
      }

      const activeSessId = activeSession?.id;
      if (!activeSessId) {
        throw new Error('No active POS session found. Please open a session in the POS console first.');
      }
      if (!tblId) {
        throw new Error('No restaurant tables found in the database. Please seed or add tables first.');
      }

      const isOnlinePay = paymentOption === 'online';

      const saveOrderToDatabase = async () => {
        // 0. Register/create customer in DB if details provided
        let customerId: string | undefined = undefined;
        if (custName.trim()) {
          try {
            const customerRes = await axiosInstance.post('/customers', {
              name: custName.trim(),
              email: custEmail.trim() || undefined,
              phone: custPhone.trim() || undefined
            });
            const customerData = customerRes.data.data?.customer || customerRes.data.data || customerRes.data;
            if (customerData?.id) {
              customerId = customerData.id;
            }
          } catch (err) {
            console.error('Failed to create customer on backend, proceeding without customer linkage:', err);
          }
        }

        const orderPaymentTag = isOnlinePay 
          ? (paymentSubMethod === 'upi' ? 'UPI Paid' : 'Card Paid') 
          : 'Pending (Counter)';

        // 1. Create order record
        const orderRes = await axiosInstance.post('/orders', {
          sessionId: activeSessId,
          tableId: tblId,
          customerId: customerId,
          subtotal: orderSubtotal,
          tax: orderTax,
          total: orderTotal,
          discount: discount,
          selfOrder: true,
          paymentTag: orderPaymentTag,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined
        });

        const orderData = orderRes.data.data?.order || orderRes.data.data || orderRes.data;
        if (!orderData?.id) {
          throw new Error('Order creation failed on backend server.');
        }

        // 2. Add Order Items
        for (const item of cart) {
          await axiosInstance.post('/order-items', {
            orderId: orderData.id,
            productId: item.product.id,
            quantity: item.qty,
            price: item.product.price
          });
        }

        // 3. Create payment record
        const payMethod = isOnlinePay 
          ? (paymentSubMethod === 'upi' ? 'UPI' : 'CARD') 
          : 'CASH';

        const paymentRes = await axiosInstance.post('/payments', {
          orderId: orderData.id,
          method: payMethod,
          amount: orderTotal
        });

        const paymentData = paymentRes.data.data?.payment || paymentRes.data;

        // 4. Update statuses if paid online
        if (isOnlinePay && paymentData?.id) {
          // Mark payment as PAID
          await axiosInstance.patch(`/payments/${paymentData.id}/status`, {
            status: 'PAID'
          }).catch(err => console.error('Failed to update payment status', err));

          // Mark order as PAID
          await axiosInstance.put(`/orders/${orderData.id}`, {
            status: 'PAID',
            paymentTag: orderPaymentTag
          }).catch(err => console.error('Failed to update order status', err));
        } else {
          // Cash at counter - set order to SENT_TO_KITCHEN so it shows on kitchen display/POS
          await axiosInstance.put(`/orders/${orderData.id}`, {
            status: 'SENT_TO_KITCHEN',
            paymentTag: orderPaymentTag
          }).catch(err => console.error('Failed to set order to kitchen status', err));
        }

        // Set results
        setSuccessAmount(orderTotal);
        setCreatedOrderNumber(orderData.orderNumber || orderData.id.slice(0, 8).toUpperCase());
        setStep('success');
        clearCart();
      };

      if (isOnlinePay) {
        // 1. Create Razorpay order on backend
        const { order: rzpOrder, key: rzpKey } = await razorpayService.createOrder(orderTotal);

        // 2. Open Razorpay popup
        const options = {
          key: rzpKey,
          amount: rzpOrder.amount,
          currency: rzpOrder.currency,
          name: 'Odoo Cafe',
          description: `Kiosk Self-Order Payment`,
          order_id: rzpOrder.id,
          prefill: {
            name: custName,
            email: custEmail || undefined,
            contact: custPhone || undefined,
            method: paymentSubMethod === 'card' ? 'card' : 'upi'
          },
          theme: { color: '#7c3aed' },
          handler: async (response: {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            try {
              setStep('processing');
              await razorpayService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              await saveOrderToDatabase();
            } catch (err: any) {
              setStep('payment_details');
              setErrorMsg('Payment verification failed. Please try again.');
            }
          },
          modal: {
            ondismiss: () => {
              setStep('payment_details');
              setErrorMsg('Payment was cancelled.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Cash at counter flow
        await saveOrderToDatabase();
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during order submission.');
      setStep('payment_details');
    }
  };

  const startCheckout = () => {
    if (cart.length === 0) return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const hasTableQuery = searchParams.get('tableId') || searchParams.get('table');
    
    if (hasTableQuery && selectedTable) {
      setDiningOption('dine_in');
      setStep('customer_info');
    } else {
      setDiningOption(null);
      setSelectedTable(null);
      setStep('dining_choice');
    }
    setPaymentOption(null);
    setPaymentSubMethod(null);
  };

  const resetAll = () => {
    setCart([]);
    setStep('menu');
    
    const searchParams = new URLSearchParams(window.location.search);
    const hasTableQuery = searchParams.get('tableId') || searchParams.get('table');
    
    if (hasTableQuery && selectedTable) {
      setDiningOption('dine_in');
    } else {
      setDiningOption(null);
      setSelectedTable(null);
    }
    setPaymentOption(null);
    setPaymentSubMethod(null);
    setUpiRefNo('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCreatedOrderNumber('');
    setErrorMsg('');
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setSuccessAmount(0);
  };

  // Render Menu View
  if (step === 'menu') {
    return (
      <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
        {/* Header */}
        <header className="bg-odoo-purple text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-script text-3xl font-bold text-white">Odoo</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-odoo-purple bg-white px-2 py-0.5 rounded shadow-sm">Cafe</span>
            </div>
            <div className="h-6 w-px bg-white/20 hidden sm:block"></div>
            <span className="text-xs text-purple-200 uppercase tracking-widest font-semibold hidden sm:inline">Self-Order Kiosk</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative max-w-xs hidden sm:block">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-56 px-4 py-1.5 text-sm bg-white/10 rounded-full text-white placeholder-purple-200 border border-white/20 focus:outline-none focus:ring-2 focus:ring-odoo-teal focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {!session && (
              <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> No active session
              </span>
            )}
          </div>
        </header>

        {/* Warning Banner if Self-Ordering is Disabled */}
        {!isSelfOrderingEnabled && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-4 flex items-center gap-3 shrink-0 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-red-800">Self Ordering is currently unavailable.</p>
              <p className="text-xs text-red-655 mt-0.5">Please place your order with our staff at the counter.</p>
            </div>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Products Sidebar Grid */}
          <main className="flex-1 flex flex-col p-4 overflow-hidden">
            {/* Search (Mobile Only) */}
            <div className="mb-3 sm:hidden">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 text-sm bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-odoo-teal"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 shrink-0 scrollbar-none">
              <button
                onClick={() => setCatFilter('')}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-250 cursor-pointer shadow-sm border ${
                  !catFilter
                    ? 'bg-odoo-teal text-white border-odoo-teal'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-odoo-teal hover:text-odoo-teal'
                }`}
              >
                All Products
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setCatFilter(c.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-250 cursor-pointer shadow-sm border ${
                    catFilter === c.id
                      ? 'text-white border-transparent'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-odoo-teal hover:text-odoo-teal'
                  }`}
                  style={catFilter === c.id ? { backgroundColor: c.color || '#00A09D' } : {}}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto mt-4 pr-1">
              {filtered.length === 0 ? (
                <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl p-6">
                  <Search className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-gray-400 font-semibold mt-2">No matching products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20 sm:pb-4">
                  {filtered.map(p => {
                    const cartItem = cart.find(item => item.product.id === p.id);
                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-odoo-teal hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="w-full h-28 bg-gray-100 overflow-hidden relative">
                          <img
                            src={p.imageUrl || getProductImage(p.name)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800 text-sm truncate">{p.name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 truncate">{p.description || 'Fresh & delicious'}</p>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                            <span className="font-extrabold text-odoo-teal text-sm">₹{p.price.toFixed(2)}</span>
                            {isSelfOrderingEnabled && (
                              cartItem ? (
                                <div className="flex items-center bg-teal-50 border border-teal-200 rounded-lg p-0.5 shadow-sm">
                                  <button
                                    onClick={() => updateQty(p.id, cartItem.qty - 1)}
                                    className="w-6 h-6 bg-white rounded text-odoo-teal hover:bg-teal-100 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    −
                                  </button>
                                  <span className="w-6 text-center text-xs font-bold text-teal-800">{cartItem.qty}</span>
                                  <button
                                    onClick={() => updateQty(p.id, cartItem.qty + 1)}
                                    className="w-6 h-6 bg-white rounded text-odoo-teal hover:bg-teal-100 text-sm font-bold flex items-center justify-center transition-colors cursor-pointer"
                                  >
                                    +
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(p)}
                                  className="px-3.5 py-1.5 bg-odoo-teal text-white rounded-lg text-xs font-bold hover:bg-odoo-teal-hover transition-colors shadow-sm cursor-pointer"
                                >
                                  + Add
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </main>

          {/* Desktop Cart Sidebar (Right) */}
          <aside className={`w-88 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-lg ${isSelfOrderingEnabled ? 'hidden sm:flex' : 'hidden'}`}>
            <div className="px-5 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
              <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-odoo-purple" /> Your Cart
              </h3>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-sm font-semibold">Your cart is empty</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">Browse the categories to add delicious drinks & food items!</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">₹{item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
                      <button
                        onClick={() => updateQty(item.product.id, item.qty - 1)}
                        className="w-5.5 h-5.5 rounded bg-white text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.qty + 1)}
                        className="w-5.5 h-5.5 rounded bg-white text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center shadow-sm cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs font-extrabold text-gray-800 w-16 text-right">
                      ₹{(item.product.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-150 p-5 space-y-4 bg-gray-50/50">
                <div className="space-y-1.5 text-xs font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-gray-800 text-sm pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-odoo-teal">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon input section */}
                <div className="border-t border-gray-150 pt-4 mt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Coupons & Promos</p>
                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Your Email Address"
                        value={couponEmailInput}
                        onChange={e => setCouponEmailInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponCodeInput}
                          onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                          className="flex-1 min-w-0 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                          className="px-3.5 py-2 bg-odoo-teal hover:bg-odoo-teal-hover text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-800 truncate">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-emerald-600 mt-0.5">Applied successfully (-₹{appliedCoupon.discountAmount.toFixed(2)})</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={startCheckout}
                  className="w-full py-3 bg-odoo-purple text-white rounded-xl font-bold shadow-md hover:bg-odoo-purple-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  Checkout Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </aside>
        </div>

        {/* Mobile Sticky Cart Summary Bar */}
        {isSelfOrderingEnabled && cart.length > 0 && (
          <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex items-center justify-between shadow-2xl z-30">
            <div onClick={() => setIsMobileCartOpen(true)} className="flex items-center gap-2.5 cursor-pointer">
              <div className="relative bg-teal-100 text-odoo-teal p-2 rounded-xl">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                  {getCartCount()}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Total Due</p>
                <p className="text-sm font-extrabold text-gray-800">₹{total.toFixed(2)}</p>
              </div>
            </div>
            <button
              onClick={startCheckout}
              className="px-6 py-2.5 bg-odoo-purple text-white rounded-xl text-xs font-bold shadow-md hover:bg-odoo-purple-hover active:scale-95 transition-all"
            >
              Checkout Now
            </button>
          </div>
        )}

        {/* Mobile Cart Slider Drawer */}
        {isSelfOrderingEnabled && isMobileCartOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 sm:hidden flex items-end">
            <div className="bg-white rounded-t-3xl w-full max-h-[80vh] flex flex-col overflow-hidden animate-slide-up shadow-2xl">
              <div className="px-5 py-4 border-b border-gray-150 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-odoo-purple" /> Your Cart ({getCartCount()})
                </h3>
                <button
                  onClick={() => setIsMobileCartOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">₹{item.product.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center bg-gray-100 p-0.5 rounded-lg">
                      <button
                        onClick={() => updateQty(item.product.id, item.qty - 1)}
                        className="w-5 h-5 rounded bg-white text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center cursor-pointer shadow-xs"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product.id, item.qty + 1)}
                        className="w-5 h-5 rounded bg-white text-gray-600 hover:bg-gray-200 text-xs font-bold flex items-center justify-center cursor-pointer shadow-xs"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs font-extrabold text-gray-800 w-16 text-right">
                      ₹{(item.product.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-150 p-5 space-y-4 bg-gray-50/50">
                <div className="space-y-1.5 text-xs font-semibold text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-extrabold text-gray-800 text-sm pt-2 border-t border-gray-200">
                    <span>Total Amount</span>
                    <span className="text-odoo-teal">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon input section */}
                <div className="border-t border-gray-150 pt-4 mt-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Coupons & Promos</p>
                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <input
                        type="email"
                        placeholder="Your Email Address"
                        value={couponEmailInput}
                        onChange={e => setCouponEmailInput(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon Code"
                          value={couponCodeInput}
                          onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                          className="flex-1 min-w-0 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon}
                          className="px-3.5 py-2 bg-odoo-teal hover:bg-odoo-teal-hover text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-emerald-800 truncate">{appliedCoupon.code}</p>
                        <p className="text-[10px] text-emerald-600 mt-0.5">Applied successfully (-₹{appliedCoupon.discountAmount.toFixed(2)})</p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsMobileCartOpen(false);
                    startCheckout();
                  }}
                  className="w-full py-3 bg-odoo-purple text-white rounded-xl font-bold shadow-md hover:bg-odoo-purple-hover"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="fixed bottom-20 left-4 right-4 sm:bottom-4 sm:right-4 sm:left-auto bg-red-50 border border-red-200 rounded-xl p-4 shadow-xl z-50 max-w-sm flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-800">Checkout Error</h4>
              <p className="text-xs text-red-650 mt-0.5 leading-relaxed">{errorMsg}</p>
            </div>
            <button onClick={() => setErrorMsg('')} className="text-red-400 hover:text-red-600 p-0.5 ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Render Multi-step Checkout screens
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col justify-between min-h-[500px]">
        {/* Checkout Header */}
        <header className="bg-odoo-purple text-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-script text-2xl font-bold text-white">Odoo</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-odoo-purple bg-white px-1.5 py-0.5 rounded shadow-sm">Cafe</span>
          </div>
          <span className="text-xs text-purple-200 uppercase tracking-widest font-semibold hidden sm:inline">Checkout Flow</span>
          {step !== 'processing' && step !== 'success' && (
            <button
              onClick={() => setStep('menu')}
              className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </header>

        {/* Checkout Steps Body */}
        <div className="flex-1 p-6 flex flex-col justify-center">
          {/* STEP 1: DINE IN vs TAKEAWAY */}
          {step === 'dining_choice' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Where will you enjoy your meal?</h2>
                <p className="text-xs text-gray-400 mt-1">Choose your preference to proceed</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setDiningOption('dine_in');
                    if (tables.length > 0) {
                      setSelectedTable(tables[0]);
                    }
                  }}
                  className={`border-2 rounded-2xl p-6 text-center hover:border-odoo-teal hover:bg-teal-50/20 transition-all duration-350 cursor-pointer flex flex-col items-center group ${
                    diningOption === 'dine_in' ? 'border-odoo-teal bg-teal-50/30' : 'border-gray-250 bg-white'
                  }`}
                >
                  <Utensils className="w-12 h-12 text-odoo-teal group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-extrabold text-sm text-gray-800 mt-3">Dine In</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Eat comfortably at one of our tables.</p>
                </button>

                <button
                  onClick={() => {
                    setDiningOption('takeaway');
                    setSelectedTable(null);
                  }}
                  className={`border-2 rounded-2xl p-6 text-center hover:border-odoo-teal hover:bg-teal-50/20 transition-all duration-350 cursor-pointer flex flex-col items-center group ${
                    diningOption === 'takeaway' ? 'border-odoo-teal bg-teal-50/30' : 'border-gray-250 bg-white'
                  }`}
                >
                  <ShoppingBag className="w-12 h-12 text-orange-500 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-extrabold text-sm text-gray-800 mt-3">Takeaway</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Pack and pick up your order to go.</p>
                </button>
              </div>

              {/* Dine In - Table Grid Selection */}
              {diningOption === 'dine_in' && (
                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-600 text-center uppercase tracking-wide">Select your Table Number</p>
                  {tables.length === 0 ? (
                    <p className="text-xs text-yellow-600 bg-yellow-50 border border-yellow-250 rounded-lg p-2 text-center">
                      No tables found in the database. A default table will be assigned automatically.
                    </p>
                  ) : (
                    <div className="flex gap-2 flex-wrap justify-center max-h-[120px] overflow-y-auto p-1">
                      {tables.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTable(t)}
                          className={`w-12 h-12 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center justify-center ${
                            selectedTable?.id === t.id
                              ? 'border-odoo-teal bg-odoo-teal text-white shadow-md shadow-teal-100'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-odoo-teal hover:text-odoo-teal'
                          }`}
                        >
                          T{t.tableNumber}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  disabled={!diningOption || (diningOption === 'dine_in' && tables.length > 0 && !selectedTable)}
                  onClick={() => setStep('customer_info')}
                  className="px-6 py-2.5 bg-odoo-teal text-white rounded-xl text-xs font-bold hover:bg-odoo-teal-hover transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP: CUSTOMER INFO */}
          {step === 'customer_info' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Your Contact Details</h2>
                <p className="text-xs text-gray-400 mt-1">Please enter your details to proceed</p>
              </div>

              <div className="space-y-4 max-w-sm mx-auto">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={custName}
                    onChange={e => setCustName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={e => setCustEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={custPhone}
                    onChange={e => setCustPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                  />
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    const searchParams = new URLSearchParams(window.location.search);
                    const hasTableQuery = searchParams.get('tableId') || searchParams.get('table');
                    if (hasTableQuery) {
                      setStep('menu');
                    } else {
                      setStep('dining_choice');
                    }
                  }}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled={!custName.trim()}
                  onClick={() => setStep('payment_choice')}
                  className="px-6 py-2.5 bg-odoo-teal text-white rounded-xl text-xs font-bold hover:bg-odoo-teal-hover transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD CHOICE */}
          {step === 'payment_choice' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Select payment method</h2>
                <p className="text-xs text-gray-400 mt-1">Total amount due: <span className="font-bold text-odoo-teal">₹{total.toFixed(2)}</span></p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setPaymentOption('online');
                    setPaymentSubMethod('upi'); // default
                  }}
                  className={`border-2 rounded-2xl p-6 text-center hover:border-odoo-teal hover:bg-teal-50/20 transition-all duration-350 cursor-pointer flex flex-col items-center group ${
                    paymentOption === 'online' ? 'border-odoo-teal bg-teal-50/30' : 'border-gray-250 bg-white'
                  }`}
                >
                  <CreditCard className="w-12 h-12 text-odoo-teal group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-extrabold text-sm text-gray-800 mt-3">Online Pay</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Pay securely here using Card or UPI.</p>
                </button>

                <button
                  onClick={() => {
                    setPaymentOption('counter');
                    setPaymentSubMethod(null);
                  }}
                  className={`border-2 rounded-2xl p-6 text-center hover:border-odoo-teal hover:bg-teal-50/20 transition-all duration-350 cursor-pointer flex flex-col items-center group ${
                    paymentOption === 'counter' ? 'border-odoo-teal bg-teal-50/30' : 'border-gray-250 bg-white'
                  }`}
                >
                  <Banknote className="w-12 h-12 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-extrabold text-sm text-gray-800 mt-3">Pay at Counter</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[200px]">Collect token and pay Cash/Card at the counter.</p>
                </button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setStep('customer_info')}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  disabled={!paymentOption}
                  onClick={() => {
                    if (paymentOption === 'online') {
                      setStep('payment_details');
                    } else {
                      handlePlaceOrder();
                    }
                  }}
                  className="px-6 py-2.5 bg-odoo-teal text-white rounded-xl text-xs font-bold hover:bg-odoo-teal-hover transition-colors shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {paymentOption === 'online' ? 'Continue' : 'Place Order'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILED PAYMENT DETAILS (UPI/Card Scanner) */}
          {step === 'payment_details' && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Complete Online Payment</h2>
                <p className="text-xs text-gray-400 mt-1">Secure transactional gateway</p>
              </div>

              {/* Coupon Section (Specific to Online Payment) */}
              <div className="border border-purple-100 rounded-2xl p-4 bg-purple-50/20 max-w-sm mx-auto space-y-3 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-bold text-odoo-purple uppercase tracking-wider">
                  <Percent className="w-4 h-4" /> Apply Coupon for Discount
                </div>
                {!appliedCoupon ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="COUPON CODE"
                        value={couponCodeInput}
                        onChange={e => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 min-w-0 px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal uppercase font-bold"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="px-4 py-2 bg-odoo-teal hover:bg-odoo-teal-hover text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-red-500 font-semibold">{couponError}</p>}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-250 rounded-xl p-3 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-800 truncate">Code: {appliedCoupon.code}</p>
                      <p className="text-[10px] text-emerald-600 mt-0.5">Discount Applied: -₹{appliedCoupon.discountAmount.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Updated total display within payment flow */}
                <div className="pt-2 border-t border-dashed border-gray-200 text-xs font-semibold text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>Payable Total:</span>
                    <span className="text-odoo-teal font-extrabold">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Tab Selector: UPI vs CARD */}
              <div className="flex border border-gray-200 rounded-xl overflow-hidden p-0.5 max-w-sm mx-auto bg-gray-50">
                <button
                  onClick={() => setPaymentSubMethod('upi')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    paymentSubMethod === 'upi' ? 'bg-white text-odoo-teal shadow-xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" /> UPI QR Code
                </button>
                <button
                  onClick={() => setPaymentSubMethod('card')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    paymentSubMethod === 'card' ? 'bg-white text-odoo-teal shadow-xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" /> Credit/Debit Card
                </button>
              </div>

              <div className="border border-gray-150 rounded-2xl p-5 bg-gray-50/50 max-w-md mx-auto">
                {/* UPI QR Display */}
                {paymentSubMethod === 'upi' ? (
                  <div className="space-y-4 text-center">
                    <div className="bg-white p-3 rounded-xl inline-block border border-gray-200 shadow-sm mx-auto">
                      {/* Interactive Simulated QR */}
                      <div className="w-36 h-36 bg-gray-100 flex flex-col items-center justify-center relative p-1">
                        <div className="absolute inset-2 border-2 border-black border-dashed opacity-20"></div>
                        {/* Fake QR blocks */}
                        <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-xs ${
                                (i % 2 === 0 && i % 3 !== 0) || i === 0 || i === 4 || i === 20 || i === 24
                                  ? 'bg-gray-800'
                                  : 'bg-transparent'
                              }`}
                            ></div>
                          ))}
                        </div>
                        {/* Middle Logo overlay */}
                        <div className="absolute inset-0 m-auto w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-[10px] font-bold text-odoo-teal shadow-sm">
                          UPI
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-gray-800">Scan QR via PhonePe / GPay / BHIM</p>
                      <p className="text-[10px] text-gray-400">Merchant UPI ID: <span className="font-mono text-gray-600">odoocafe@upi</span></p>
                      <p className="text-sm font-extrabold text-odoo-purple mt-1">Amount: ₹{total.toFixed(2)}</p>
                    </div>

                    <div className="pt-2">
                      <input
                        type="text"
                        value={upiRefNo}
                        onChange={e => setUpiRefNo(e.target.value)}
                        placeholder="Enter UPI Ref No. (Optional)"
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal text-center"
                      />
                    </div>
                  </div>
                ) : (
                  /* Card Inputs */
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        maxLength={19}
                        className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Expiry Date</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">CVV</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          placeholder="***"
                          maxLength={3}
                          className="w-full px-3 py-2 text-xs bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-odoo-teal"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setStep('payment_choice')}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  className="px-6 py-2.5 bg-odoo-teal text-white rounded-xl text-xs font-bold hover:bg-odoo-teal-hover transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" /> Confirm Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PROCESSING LOADER */}
          {step === 'processing' && (
            <div className="space-y-4 text-center py-10">
              <div className="w-16 h-16 border-4 border-odoo-teal border-t-transparent rounded-full animate-spin mx-auto"></div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">Saving your order to database...</h3>
                <p className="text-[11px] text-gray-400 mt-1">Please do not refresh or close this screen</p>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS & RECEIPT */}
          {step === 'success' && (
            <div className="space-y-6 text-center py-4">
              <div className="flex flex-col items-center">
                {/* Pulse Green Dot */}
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping scale-150"></div>
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md relative z-10">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                </div>
                <h2 className="text-xl font-extrabold text-gray-800 mt-5">Order Placed Successfully!</h2>
                <p className="text-xs text-gray-400 mt-1">Your order has been queued in the kitchen.</p>
              </div>

              {/* Summary invoice card */}
              <div className="bg-gray-50 border border-gray-150 rounded-2xl p-4 max-w-sm mx-auto text-left text-xs space-y-3 font-sans">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-400">Order Token</span>
                  <span className="font-mono font-bold text-gray-800">#{createdOrderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-400">Dining Style</span>
                  <span className="font-bold text-gray-800">
                    {diningOption === 'dine_in'
                      ? `Dine In (Table ${selectedTable?.tableNumber || 1})`
                      : 'Takeaway'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-gray-400">Payment Status</span>
                  <span className="font-bold text-green-600">
                    {paymentOption === 'online' ? 'Paid Online' : 'Pay at Counter'}
                  </span>
                </div>
                <div className="flex justify-between font-extrabold text-sm pt-1">
                  <span>Grand Total</span>
                  <span className="text-odoo-teal">₹{successAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-center">
                <button
                  onClick={resetAll}
                  className="px-6 py-2.5 bg-odoo-purple text-white rounded-xl text-xs font-bold shadow-md hover:bg-odoo-purple-hover transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Start New Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
