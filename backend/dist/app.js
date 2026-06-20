"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Route imports
const auth_routes_1 = __importDefault(require("./modules/auth/routes/auth.routes"));
const product_routes_1 = __importDefault(require("./modules/products/routes/product.routes"));
const category_routes_1 = __importDefault(require("./modules/categories/routes/category.routes"));
const floor_routes_1 = __importDefault(require("./modules/floors/routes/floor.routes"));
const table_routes_1 = __importDefault(require("./modules/tables/routes/table.routes"));
const customer_routes_1 = __importDefault(require("./modules/customers/routes/customer.routes"));
const session_routes_1 = __importDefault(require("./modules/sessions/routes/session.routes"));
const order_routes_1 = __importDefault(require("./modules/orders/routes/order.routes"));
const orderItem_routes_1 = __importDefault(require("./modules/orderItems/routes/orderItem.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/routes/payment.routes"));
const coupon_routes_1 = __importDefault(require("./modules/coupons/routes/coupon.routes"));
const promotion_routes_1 = __importDefault(require("./modules/promotions/routes/promotion.routes"));
const kds_routes_1 = __importDefault(require("./modules/kds/routes/kds.routes"));
const selfOrder_routes_1 = __importDefault(require("./modules/selfOrder/routes/selfOrder.routes"));
const reports_routes_1 = __importDefault(require("./modules/reports/routes/reports.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Register all routes under /api prefix
app.use('/api', auth_routes_1.default);
app.use('/api', product_routes_1.default);
app.use('/api', category_routes_1.default);
app.use('/api', floor_routes_1.default);
app.use('/api', table_routes_1.default);
app.use('/api', customer_routes_1.default);
app.use('/api', session_routes_1.default);
app.use('/api', order_routes_1.default);
app.use('/api', orderItem_routes_1.default);
app.use('/api', payment_routes_1.default);
app.use('/api', coupon_routes_1.default);
app.use('/api', promotion_routes_1.default);
app.use('/api', kds_routes_1.default);
app.use('/api', selfOrder_routes_1.default);
app.use('/api', reports_routes_1.default);
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "Odoo Cafe Backend Running 🚀",
    });
});
exports.default = app;
