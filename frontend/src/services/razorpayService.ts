import axiosInstance from '../lib/axios';

export interface RazorpayOrderResponse {
  order: { id: string; amount: number; currency: string };
  key: string;
}

const razorpayService = {
  /** Creates a Razorpay order on the backend. amount is in rupees. */
  createOrder: async (amount: number): Promise<RazorpayOrderResponse> => {
    const res = await axiosInstance.post('/razorpay/create-order', { amount });
    return res.data;
  },

  /** Verifies Razorpay signature on the backend after payment success. */
  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean; paymentId: string }> => {
    const res = await axiosInstance.post('/razorpay/verify', data);
    return res.data;
  },
};

export default razorpayService;
