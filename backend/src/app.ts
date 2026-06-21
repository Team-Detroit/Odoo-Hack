import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Route imports
import authRoutes from './modules/auth/routes/auth.routes';
import productRoutes from './modules/products/routes/product.routes';
import categoryRoutes from './modules/categories/routes/category.routes';
import floorRoutes from './modules/floors/routes/floor.routes';
import tableRoutes from './modules/tables/routes/table.routes';
import customerRoutes from './modules/customers/routes/customer.routes';
import sessionRoutes from './modules/sessions/routes/session.routes';
import orderRoutes from './modules/orders/routes/order.routes';
import orderItemRoutes from './modules/orderItems/routes/orderItem.routes';
import paymentRoutes from './modules/payments/routes/payment.routes';
import couponRoutes from './modules/coupons/routes/coupon.routes';
import promotionRoutes from './modules/promotions/routes/promotion.routes';
import kdsRoutes from './modules/kds/routes/kds.routes';
import selfOrderRoutes from './modules/selfOrder/routes/selfOrder.routes';
import reportsRoutes from './modules/reports/routes/reports.routes';
import userRoutes from './modules/users';
import razorpayRoutes from './modules/razorpay/razorpay.routes';
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register all routes under /api prefix
app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);
app.use('/api', floorRoutes);
app.use('/api', tableRoutes);
app.use('/api', customerRoutes);
app.use('/api', sessionRoutes);
app.use('/api', orderRoutes);
app.use('/api', orderItemRoutes);
app.use('/api', paymentRoutes);
app.use('/api', couponRoutes);
app.use('/api', promotionRoutes);
app.use('/api', kdsRoutes);
app.use('/api', selfOrderRoutes);
app.use('/api', reportsRoutes);
app.use('/api', userRoutes);
app.use('/api', razorpayRoutes);

app.get("/", (_, res) => {
  res.json({
    success: true,
    message: "Odoo Cafe Backend Running 🚀",
  });
});
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend running",
  });
});
export default app;