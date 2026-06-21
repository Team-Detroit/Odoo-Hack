import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class RazorpayController {
  /** POST /api/razorpay/create-order
   *  Body: { amount: number }  (amount in rupees)
   *  Returns Razorpay order object with id, amount, currency
   */
  async createOrder(req: Request, res: Response) {
    try {
      const { amount } = req.body as { amount: number };
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
      }

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // convert rupees → paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      });

      return res.json({
        success: true,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
        },
        key: process.env.RAZORPAY_KEY_ID,
      });
    } catch (err: any) {
      console.error('Razorpay createOrder error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Razorpay order creation failed' });
    }
  }

  /** POST /api/razorpay/verify
   *  Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   *  Returns { success: true } if signature is valid
   */
  async verifyPayment(req: Request, res: Response) {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      };

      const body = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }

      return res.json({ success: true, paymentId: razorpay_payment_id });
    } catch (err: any) {
      console.error('Razorpay verify error:', err);
      return res.status(500).json({ success: false, message: err.message || 'Signature verification failed' });
    }
  }
}
