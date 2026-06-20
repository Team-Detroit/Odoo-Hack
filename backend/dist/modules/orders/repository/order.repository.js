"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
class OrderRepository {
    async getAllOrders() {
        return prisma_1.default.order.findMany({
            include: {
                items: true,
                customer: true,
                table: true
            }
        });
    }
    async getOrderById(id) {
        return prisma_1.default.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: { product: true }
                },
                customer: true,
                table: true
            }
        });
    }
    async createOrder(data) {
        const { items, couponCode, ...orderData } = data;
        let discountVal = Number(orderData.discount || 0);
        let calculatedSubtotal = Number(orderData.subtotal || 0);
        let calculatedTax = Number(orderData.tax || 0);
        let calculatedTotal = Number(orderData.total || 0);
        if (couponCode) {
            try {
                const coupon = await prisma_1.default.coupon.findUnique({
                    where: { code: couponCode.toUpperCase() }
                });
                if (coupon && coupon.active && (!coupon.expiryDate || new Date(coupon.expiryDate) >= new Date())) {
                    if (coupon.discountType === 'percentage') {
                        discountVal = (calculatedSubtotal * coupon.discountValue) / 100;
                    }
                    else {
                        discountVal = coupon.discountValue;
                    }
                    discountVal = Math.min(discountVal, calculatedSubtotal);
                    discountVal = parseFloat(discountVal.toFixed(2));
                    calculatedTax = parseFloat(((calculatedSubtotal - discountVal) * 0.05).toFixed(2));
                    calculatedTotal = parseFloat((calculatedSubtotal - discountVal + calculatedTax).toFixed(2));
                    orderData.discount = discountVal;
                    orderData.tax = calculatedTax;
                    orderData.total = calculatedTotal;
                    console.log(`[Order Creation] Coupon ${couponCode} applied: subtotal=${calculatedSubtotal}, discount=${discountVal}, tax=${calculatedTax}, total=${calculatedTotal}`);
                }
            }
            catch (err) {
                console.error("Error validating coupon discount logic in createOrder:", err);
            }
        }
        const order = await prisma_1.default.order.create({
            data: {
                ...orderData,
                offerTag: couponCode ? couponCode.toUpperCase() : null,
                items: {
                    create: (items || []).map((i) => ({
                        productId: i.productId,
                        quantity: Number(i.quantity),
                        price: Number(i.price),
                        total: Number(i.quantity) * Number(i.price)
                    }))
                }
            },
            include: {
                items: true,
                customer: true,
                table: true
            }
        });
        if (couponCode) {
            try {
                const coupon = await prisma_1.default.coupon.findUnique({
                    where: { code: couponCode.toUpperCase() }
                });
                if (coupon) {
                    await prisma_1.default.coupon.update({
                        where: { id: coupon.id },
                        data: { usageCount: { increment: 1 } }
                    });
                    console.log(`[Redemption] Incremented usageCount for coupon ${coupon.code}`);
                    if (orderData.customerId) {
                        await prisma_1.default.couponRedemption.create({
                            data: {
                                couponId: coupon.id,
                                customerId: orderData.customerId,
                                orderId: order.id,
                                usedAt: new Date()
                            }
                        });
                        console.log(`[Redemption] Recorded coupon redemption for order ${order.id}, customer ${orderData.customerId}, coupon ${coupon.code}`);
                    }
                }
            }
            catch (err) {
                console.error("Failed to automatically record coupon redemption/usageCount:", err);
            }
        }
        if (orderData.tableId) {
            try {
                await prisma_1.default.table.update({
                    where: { id: orderData.tableId },
                    data: { status: 'OCCUPIED' }
                });
            }
            catch (err) {
                console.error("Failed to automatically set table as OCCUPIED:", err);
            }
        }
        return order;
    }
    async updateOrder(id, data) {
        const updatedOrder = await prisma_1.default.order.update({
            where: { id },
            data,
            include: {
                items: true,
                customer: true,
                table: true
            }
        });
        if (data.status === 'PAID' || data.status === 'SENT_TO_KITCHEN') {
            try {
                if (data.status === 'PAID' && updatedOrder.tableId) {
                    // If self-ordering, keep the table occupied. Otherwise free it.
                    await prisma_1.default.table.update({
                        where: { id: updatedOrder.tableId },
                        data: { status: updatedOrder.selfOrder ? 'OCCUPIED' : 'AVAILABLE' }
                    });
                }
                else if (data.status === 'SENT_TO_KITCHEN' && updatedOrder.tableId) {
                    await prisma_1.default.table.update({
                        where: { id: updatedOrder.tableId },
                        data: { status: 'OCCUPIED' }
                    });
                }
                await prisma_1.default.kitchenTicket.upsert({
                    where: { orderId: id },
                    update: { status: 'TO_COOK' },
                    create: { orderId: id, status: 'TO_COOK' }
                });
            }
            catch (err) {
                console.error("Error updating table or kitchen ticket status on order status change:", err);
            }
        }
        return updatedOrder;
    }
    async deleteOrder(id) {
        return prisma_1.default.order.delete({ where: { id } });
    }
    async sendToKitchen(id) {
        try {
            await prisma_1.default.kitchenTicket.upsert({
                where: { orderId: id },
                update: { status: 'TO_COOK' },
                create: { orderId: id, status: 'TO_COOK' }
            });
        }
        catch (err) {
            console.error("Error creating kitchen ticket on sendToKitchen:", err);
        }
        return prisma_1.default.order.update({
            where: { id },
            data: { status: 'SENT_TO_KITCHEN' },
            include: {
                items: true,
                customer: true,
                table: true
            },
        });
    }
    async cancelOrder(id) {
        return prisma_1.default.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                items: true,
                customer: true,
                table: true
            },
        });
    }
}
exports.OrderRepository = OrderRepository;
