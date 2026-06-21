import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Trash2, Bot, Sparkles, Loader, ArrowLeft, ShoppingCart, Check, HelpCircle, ChevronRight } from 'lucide-react';
import { AIMessage } from './AIMessage';
import { ChatMessage } from './useAIConcierge';
import { Product } from '../../../types/product';
import { Category } from '../../../types/category';

interface AIConciergePanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onSpeak: (text: string) => void;
  products: Product[];
  categories: Category[];
  addToCart: (p: Product) => void;
}

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

export const AIConciergePanel: React.FC<AIConciergePanelProps> = ({
  messages,
  isTyping,
  onSendMessage,
  onClearChat,
  onClose,
  onMinimize,
  onSpeak,
  products,
  categories,
  addToCart,
}) => {
  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Flow State: 'menu' | 'chat' | 'order'
  const [flow, setFlow] = useState<'menu' | 'chat' | 'order'>('menu');

  // Guided Ordering Steps: 'category' | 'range' | 'choose'
  const [orderStep, setOrderStep] = useState<'category' | 'range' | 'choose'>('category');

  // Guided Ordering Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');

  // Cart Add Confirmation States
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Resize states
  const [dimensions, setDimensions] = useState(() => {
    const isMobile = window.innerWidth < 768;
    return {
      width: isMobile ? Math.floor(window.innerWidth * 0.9) : 380,
      height: isMobile ? Math.floor(window.innerHeight * 0.65) : 520,
    };
  });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = {
      x: e.clientX,
      y: e.clientY,
      w: dimensions.width,
      h: dimensions.height,
    };
    document.addEventListener('mousemove', handleResizeMouseMove);
    document.addEventListener('mouseup', handleResizeMouseUp);
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    const dx = e.clientX - resizeStart.current.x;
    const dy = e.clientY - resizeStart.current.y;
    const newW = Math.max(280, Math.min(resizeStart.current.w - dx, window.innerWidth - 32));
    const newH = Math.max(300, Math.min(resizeStart.current.h - dy, window.innerHeight - 100));
    setDimensions({ width: newW, height: newH });
  };

  const handleResizeMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);
  };

  const handleResizeTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    const touch = e.touches[0];
    resizeStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      w: dimensions.width,
      h: dimensions.height,
    };
    document.addEventListener('touchmove', handleResizeTouchMove, { passive: false });
    document.addEventListener('touchend', handleResizeTouchEnd);
  };

  const handleResizeTouchMove = (e: TouchEvent) => {
    const touch = e.touches[0];
    const dx = touch.clientX - resizeStart.current.x;
    const dy = touch.clientY - resizeStart.current.y;
    const newW = Math.max(280, Math.min(resizeStart.current.w - dx, window.innerWidth - 32));
    const newH = Math.max(300, Math.min(resizeStart.current.h - dy, window.innerHeight - 100));
    setDimensions({ width: newW, height: newH });
  };

  const handleResizeTouchEnd = () => {
    setIsResizing(false);
    document.removeEventListener('touchmove', handleResizeTouchMove);
    document.removeEventListener('touchend', handleResizeTouchEnd);
  };

  // Auto scroll to bottom in chat flow
  useEffect(() => {
    if (flow === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, flow]);

  const handleSend = () => {
    if (!inputVal.trim()) return;
    onSendMessage(inputVal);
    setInputVal('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleConfirmAddToCart = () => {
    if (pendingProduct) {
      addToCart(pendingProduct);
      setSuccessMessage(`${pendingProduct.name} added to cart!`);
      setPendingProduct(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  // Filter products for guided ordering
  const filteredProducts = products.filter(p => {
    const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
    let matchesPrice = true;
    if (selectedPriceRange === 'under100') {
      matchesPrice = p.price < 100;
    } else if (selectedPriceRange === '100to200') {
      matchesPrice = p.price >= 100 && p.price <= 200;
    } else if (selectedPriceRange === 'over200') {
      matchesPrice = p.price > 200;
    }
    return matchesCategory && matchesPrice;
  });

  return (
    <div 
      className="fixed bottom-20 right-6 z-50 bg-[#F9F9F9] border-2 border-black rounded-2xl shadow-[8px_8px_0px_#000] flex flex-col overflow-hidden animate-slide-up font-sans"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        transition: isResizing ? 'none' : 'all 0.15s ease-out',
      }}
    >
      {/* Top-Left Resize Handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        onTouchStart={handleResizeTouchStart}
        className="absolute top-0 left-0 w-5 h-5 cursor-nwse-resize z-50 flex items-center justify-center group"
        title="Drag to resize"
      >
        <div className="w-2.5 h-2.5 border-l-2 border-t-2 border-black/40 group-hover:border-black transition-colors" />
      </div>
      
      {/* Header */}
      <div className="bg-[#714B67] text-white px-4 py-3 flex items-center justify-between border-b-2 border-black shrink-0">
        <div className="flex items-center gap-2">
          {flow !== 'menu' && (
            <button
              onClick={() => {
                setFlow('menu');
                setPendingProduct(null);
                setOrderStep('category');
              }}
              className="p-1 rounded-full border border-black bg-[#875A7B] text-white hover:bg-white hover:text-black transition-colors shadow mr-1 flex items-center justify-center"
              title="Go Back to Main Menu"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <Bot className="w-5 h-5 text-[#00A09D]" />
          <div>
            <h3 className="text-sm font-black tracking-tight flex items-center gap-1.5">
              Odoo Concierge
              <Sparkles className="w-3 h-3 text-[#00A09D] animate-pulse" />
            </h3>
            <p className="text-[10px] text-gray-200 opacity-90 font-bold">
              {flow === 'order' ? 'Guided Self-Ordering' : 'Ask anything about the cafe'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          {flow === 'chat' && (
            <button
              onClick={onClearChat}
              className="p-1 rounded-full border border-black bg-[#875A7B] text-white hover:bg-white hover:text-black transition-colors shadow"
              title="Clear Chat History"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onMinimize}
            className="p-1 rounded-full border border-black bg-[#875A7B] text-white hover:bg-white hover:text-black transition-colors shadow"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 rounded-full border border-black bg-[#875A7B] text-white hover:bg-white hover:text-black transition-colors shadow"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#FCFCFC] relative flex flex-col">
        {successMessage && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-[#00A09D] text-white border-2 border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_#000] text-xs font-black flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* FLOW 1: INITIAL CHOOSE MENU */}
        {flow === 'menu' && (
          <div className="flex-1 flex flex-col justify-center items-center px-6 py-8 gap-6 text-center select-none">
            <div className="flex flex-col items-center gap-3">
              <div className="w-20 h-20 rounded-full border-4 border-black bg-white overflow-hidden shadow-[4px_4px_0px_#000]">
                <img 
                  src="/barista-cat.png" 
                  alt="Barista Cat Mascot" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as any).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h4 className="text-sm font-black text-gray-800">Hello! I am your AI Cafe Assistant</h4>
                <p className="text-[11px] text-gray-500 font-bold mt-1">Select how you would like to proceed:</p>
              </div>
            </div>

            <div className="flex flex-col w-full gap-4">
              <button
                onClick={() => setFlow('chat')}
                className="w-full py-4 px-4 bg-white border-2 border-black rounded-xl hover:bg-[#F0ECF4] text-[#714B67] font-black text-xs shadow-[4px_4px_0px_#000] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-[#714B67]" />
                  💬 Ask anything to Concierge
                </span>
                <span className="text-[10px] bg-[#714B67] text-white px-2 py-0.5 rounded border border-black font-extrabold shadow">AI CHAT</span>
              </button>

              <button
                onClick={() => {
                  setFlow('order');
                  setOrderStep('category');
                }}
                className="w-full py-4 px-4 bg-white border-2 border-black rounded-xl hover:bg-[#EBF7F7] text-[#00A09D] font-black text-xs shadow-[4px_4px_0px_#000] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#00A09D]" />
                  🛒 Order for Yourself
                </span>
                <span className="text-[10px] bg-[#00A09D] text-white px-2 py-0.5 rounded border border-black font-extrabold shadow">GUIDED</span>
              </button>
            </div>
          </div>
        )}

        {/* FLOW 2: STANDARD AI CHAT */}
        {flow === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {messages.map((msg) => (
                <AIMessage key={msg.id} message={msg} onSpeak={onSpeak} />
              ))}

              {isTyping && (
                <div className="flex gap-3 my-3 w-full items-start justify-start animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-[#714B67] border-2 border-black flex items-center justify-center text-white shrink-0 shadow">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border-2 border-black p-3 rounded-2xl rounded-tl-none shadow-[3px_3px_0px_#000] text-xs font-bold text-gray-700 flex items-center gap-2">
                    <Loader className="w-3.5 h-3.5 animate-spin text-[#714B67]" />
                    Concierge is thinking...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white border-t-2 border-black flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask Concierge..."
                className="flex-1 bg-gray-55 border-2 border-black rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#714B67]"
              />

              <button
                onClick={handleSend}
                disabled={!inputVal.trim()}
                className="p-2 rounded-full border-2 border-black bg-[#714B67] hover:bg-[#875A7B] text-white disabled:opacity-50 disabled:hover:bg-[#714B67] shadow-[2px_2px_0px_#000] hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* FLOW 3: GUIDED SELF-ORDERING (WIZARD STEPS) */}
        {flow === 'order' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* STEP 1: CATEGORY SELECTION */}
            {orderStep === 'category' && (
              <div className="flex-1 flex flex-col p-4 gap-4">
                <div className="p-3 bg-[#EBF7F7] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex gap-2">
                  <Bot className="w-6 h-6 text-[#00A09D] shrink-0" />
                  <div>
                    <h5 className="text-xs font-black text-gray-800">Step 1: Choose Category</h5>
                    <p className="text-[10px] text-gray-500 font-bold leading-tight mt-0.5">
                      Select what category of food or beverage you are looking for today.
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('');
                      setOrderStep('range');
                    }}
                    className="w-full p-3 bg-white border-2 border-black rounded-xl hover:bg-[#EBF7F7] font-black text-xs text-left shadow-[3px_3px_0px_#000] flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span>🍔 All Categories</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>

                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setOrderStep('range');
                      }}
                      className="w-full p-3 bg-white border-2 border-black rounded-xl hover:bg-[#EBF7F7] font-black text-xs text-left shadow-[3px_3px_0px_#000] flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span>☕ {cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: COST RANGE SELECTION */}
            {orderStep === 'range' && (
              <div className="flex-1 flex flex-col p-4 gap-4">
                <div className="p-3 bg-[#EBF7F7] border-2 border-black rounded-xl shadow-[3px_3px_0px_#000] flex gap-2">
                  <Bot className="w-6 h-6 text-[#00A09D] shrink-0" />
                  <div>
                    <h5 className="text-xs font-black text-gray-800">Step 2: Cost Range</h5>
                    <p className="text-[10px] text-gray-500 font-bold leading-tight mt-0.5">
                      Choose your budget/price range preference for items.
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                  {[
                    { id: 'all', label: '💸 Any Price' },
                    { id: 'under100', label: '🪙 Under ₹100' },
                    { id: '100to200', label: '💵 ₹100 - ₹200' },
                    { id: 'over200', label: '💎 Over ₹200' },
                  ].map(range => (
                    <button
                      key={range.id}
                      onClick={() => {
                        setSelectedPriceRange(range.id);
                        setOrderStep('choose');
                      }}
                      className="w-full p-3.5 bg-white border-2 border-black rounded-xl hover:bg-[#EBF7F7] font-black text-xs text-left shadow-[3px_3px_0px_#000] flex items-center justify-between transition-all cursor-pointer"
                    >
                      <span>{range.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setOrderStep('category')}
                  className="py-2.5 bg-white border-2 border-black rounded-xl hover:bg-gray-100 font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Categories
                </button>
              </div>
            )}

            {/* STEP 3: PRODUCT CHOICE */}
            {orderStep === 'choose' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-3 bg-[#EBF7F7] border-b-2 border-black flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-1.5">
                    <Bot className="w-5 h-5 text-[#00A09D]" />
                    <span className="text-[10px] font-black text-gray-800">
                      Step 3: Select Items to Add
                    </span>
                  </div>
                  <span className="text-[9px] font-black bg-white border border-black px-1.5 py-0.5 rounded shadow">
                    {selectedPriceRange === 'all' ? 'Any Price' : selectedPriceRange === 'under100' ? '< ₹100' : selectedPriceRange === '100to200' ? '₹100-200' : '> ₹200'}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FCFCFC]">
                  {filteredProducts.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center gap-2">
                      <HelpCircle className="w-10 h-10 text-gray-350" />
                      <p className="text-[11px] font-black text-gray-500">No matching items found</p>
                      <p className="text-[9px] text-gray-450">Try going back to price ranges or categories</p>
                    </div>
                  ) : (
                    filteredProducts.map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => setPendingProduct(prod)}
                        className="flex gap-3 bg-white border-2 border-black p-2.5 rounded-xl shadow-[3px_3px_0px_#000] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group"
                      >
                        <div className="w-14 h-14 rounded-lg border-2 border-black overflow-hidden bg-gray-50 shrink-0">
                          <img 
                            src={getProductImage(prod.name)} 
                            alt={prod.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h5 className="text-[11px] font-black text-gray-800 truncate group-hover:text-[#00A09D] transition-colors">{prod.name}</h5>
                              <span className="text-[10px] font-black text-gray-905 shrink-0">₹{prod.price}</span>
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 line-clamp-2 mt-0.5 leading-tight">{prod.description || 'Delectable cafe selection.'}</p>
                          </div>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-[8px] font-extrabold uppercase bg-gray-100 text-gray-500 px-1 py-0.5 rounded border border-gray-250">
                              {prod.categoryName || 'Menu Item'}
                            </span>
                            <span className="text-[9px] font-black text-[#00A09D] group-hover:underline flex items-center gap-0.5">
                              Add +
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 bg-white border-t-2 border-black shrink-0">
                  <button
                    onClick={() => setOrderStep('range')}
                    className="w-full py-2.5 bg-white border-2 border-black rounded-xl hover:bg-gray-100 font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Price Range
                  </button>
                </div>
              </div>
            )}

            {/* Pending Add to Cart Confirmation Overlay */}
            {pendingProduct && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-[280px] bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_#000] p-4 flex flex-col gap-4 animate-scale-up">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 rounded-full border-2 border-black bg-[#EBF7F7] flex items-center justify-center mx-auto text-[#00A09D] mb-1">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <h4 className="text-xs font-black text-gray-800">Add to Cart?</h4>
                    <p className="text-[10px] text-gray-500 font-bold leading-tight">
                      Would you like to place <span className="font-extrabold text-gray-700">"{pendingProduct.name}"</span> into your ordering cart?
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPendingProduct(null)}
                      className="flex-1 py-2 text-[10px] font-black rounded-xl border-2 border-black bg-white hover:bg-gray-100 text-gray-800 shadow-[2px_2px_0px_#000] active:scale-[0.97] transition-all cursor-pointer text-center"
                    >
                      No, Cancel
                    </button>
                    <button
                      onClick={handleConfirmAddToCart}
                      className="flex-1 py-2 text-[10px] font-black rounded-xl border-2 border-black bg-[#00A09D] hover:bg-[#00b0ad] text-white shadow-[2px_2px_0px_#000] active:scale-[0.97] transition-all cursor-pointer text-center"
                    >
                      Yes, Add
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
