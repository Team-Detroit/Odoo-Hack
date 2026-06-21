"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RazorpayController = void 0;
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const razorpay = new razorpay_1.default({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
class RazorpayController {
    /** POST /api/razorpay/create-order
     *  Body: { amount: number }  (amount in rupees)
     *  Returns Razorpay order object with id, amount, currency
     */
    async createOrder(req, res) {
        try {
            const { amount } = req.body;
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
        }
        catch (err) {
            console.error('Razorpay createOrder error:', err);
            return res.status(500).json({ success: false, message: err.message || 'Razorpay order creation failed' });
        }
    }
    /** POST /api/razorpay/verify
     *  Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
     *  Returns { success: true } if signature is valid
     */
    async verifyPayment(req, res) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
            const body = `${razorpay_order_id}|${razorpay_payment_id}`;
            const expectedSignature = crypto_1.default
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');
            if (expectedSignature !== razorpay_signature) {
                return res.status(400).json({ success: false, message: 'Invalid payment signature' });
            }
            return res.json({ success: true, paymentId: razorpay_payment_id });
        }
        catch (err) {
            console.error('Razorpay verify error:', err);
            return res.status(500).json({ success: false, message: err.message || 'Signature verification failed' });
        }
    }
}
exports.RazorpayController = RazorpayController;
