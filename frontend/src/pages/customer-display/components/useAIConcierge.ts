import { useState, useEffect } from 'react';
import { Product } from '../../../types/product';
import { Table } from '../../../types/table';
import { Category } from '../../../types/category';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ConciergeContext {
  table: Table | null;
  products: Product[];
  categories: Category[];
  cart: Array<{ product: Product; qty: number }>;
  appliedCoupon: { code: string; discountAmount: number; finalAmount: number } | null;
  step: string;
  orderNumber: string;
}

export const useAIConcierge = (context: ConciergeContext) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('odoo_concierge_chat');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved chat history:', e);
      }
    } else {
      // Welcome message
      const welcome: ChatMessage = {
        id: 'welcome',
        sender: 'ai',
        text: 'Hello! I am your Odoo Cafe Concierge. Ask me anything about the menu, popular items, active coupons, or your current order status.',
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
      localStorage.setItem('odoo_concierge_chat', JSON.stringify([welcome]));
    }
  }, []);

  const saveMessages = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    localStorage.setItem('odoo_concierge_chat', JSON.stringify(newMsgs));
  };

  const clearChat = () => {
    const welcome: ChatMessage = {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your Odoo Cafe Concierge. Ask me anything about the menu, popular items, active coupons, or your current order status.',
      timestamp: new Date().toISOString(),
    };
    saveMessages([welcome]);
  };

  // Compile Context into System Prompt
  const compileSystemPrompt = (): string => {
    const tableText = context.table ? `Table T${context.table.tableNumber}` : 'Takeaway';
    const productsText = context.products
      .map(p => `- ${p.name} (${p.categoryName || 'Menu Item'}): ₹${p.price}. Description: ${p.description || 'Tasty item'}`)
      .join('\n');
    const categoriesText = context.categories.map(c => c.name).join(', ');
    
    // Cart details
    const cartItems = context.cart
      .map(item => `${item.qty}x ${item.product.name} (₹${item.product.price} each)`)
      .join(', ');
    const cartTotal = context.cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
    const cartText = cartItems.length > 0 ? `${cartItems} (Total: ₹${cartTotal})` : 'Cart is empty';

    // Coupons
    const couponText = context.appliedCoupon 
      ? `Applied: ${context.appliedCoupon.code} (Discount: ₹${context.appliedCoupon.discountAmount}, Final Total: ₹${context.appliedCoupon.finalAmount})` 
      : 'No coupons applied';

    // Order tracking
    const orderStatus = context.orderNumber 
      ? `Order Number ${context.orderNumber} is placed. Step stage: ${context.step}` 
      : 'No active order placed yet.';

    return `You are Odoo Cafe Concierge.
You are an AI assistant for customers inside Odoo Cafe.
Use only the provided restaurant data.
Never hallucinate unavailable products or pricing.
Answer concisely. Do not use emoji inside your responses.
Recommend products when possible based on customer requirements.

Current Context:
- Restaurant Name: Odoo Cafe
- Table Info: ${tableText}
- Categories Available: ${categoriesText}
- Available Products:
${productsText}
- Current Cart: ${cartText}
- Active Coupons Status: ${couponText}
- Order Status / Phase: ${orderStatus}`;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    const updatedMsgs = [...messages, userMsg];
    saveMessages(updatedMsgs);
    setIsTyping(true);

    try {
      const systemPrompt = compileSystemPrompt();
      const apiKey = import.meta.env.VITE_GROQ_API_KEY || 'gsk_T31nUu5kX7gY0a1nC2oC4nF4fS5sU6uL7lO8oG9gQ0q'; 

      // Format conversation history for Groq
      const history = updatedMsgs.slice(-8).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
          ],
          temperature: 0.7,
          max_tokens: 256,
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API returned status ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content || 'Sorry, I had trouble processing that request.';

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toISOString(),
      };

      saveMessages([...updatedMsgs, aiMsg]);
    } catch (e: any) {
      console.error('Groq request failed:', e);
      const errorMsg: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        sender: 'ai',
        text: 'I am having trouble connecting to the network. Please check your connection and try again.',
        timestamp: new Date().toISOString(),
      };
      saveMessages([...updatedMsgs, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Text to Speech (TTS) speaker helper
  const triggerTextToSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // stop current reading
    
    // Clean text of markdowns/symbols for speech
    const cleanText = text.replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    triggerTextToSpeech,
  };
};
