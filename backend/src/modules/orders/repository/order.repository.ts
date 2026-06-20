import prisma from '../../../shared/prisma';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';

export class OrderRepository {
  async getAllOrders() {
    return prisma.order.findMany({ 
      include: { 
        items: true,
        customer: true,
        table: true
      } 
    });
  }

  async getOrderById(id: string) {
    return prisma.order.findUnique({ 
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

  async createOrder(data: any) {
    const { items, couponCode, ...orderData } = data;

    let discountVal = Number(orderData.discount || 0);
    let calculatedSubtotal = Number(orderData.subtotal || 0);
    let calculatedTax = Number(orderData.tax || 0);
    let calculatedTotal = Number(orderData.total || 0);

    if (couponCode) {
      try {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() }
        });
        if (coupon && coupon.active && (!coupon.expiryDate || new Date(coupon.expiryDate) >= new Date())) {
          if (coupon.discountType === 'percentage') {
            discountVal = (calculatedSubtotal * coupon.discountValue) / 100;
          } else {
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
      } catch (err) {
        console.error("Error validating coupon discount logic in createOrder:", err);
      }
    }

    const order = await prisma.order.create({
      data: {
        ...orderData,
        offerTag: couponCode ? couponCode.toUpperCase() : null,
        items: {
          create: (items || []).map((i: any) => ({
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
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode.toUpperCase() }
        });
        if (coupon) {
          await prisma.coupon.update({
            where: { id: coupon.id },
            data: { usageCount: { increment: 1 } }
          });
          console.log(`[Redemption] Incremented usageCount for coupon ${coupon.code}`);

          if (orderData.customerId) {
            await prisma.couponRedemption.create({
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
      } catch (err) {
        console.error("Failed to automatically record coupon redemption/usageCount:", err);
      }
    }

    if (orderData.tableId) {
      try {
        await prisma.table.update({
          where: { id: orderData.tableId },
          data: { status: 'OCCUPIED' }
        });
      } catch (err) {
        console.error("Failed to automatically set table as OCCUPIED:", err);
      }
    }

    return order;
  }

  async updateOrder(id: string, data: UpdateOrderDto) {
    const updatedOrder = await prisma.order.update({ 
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
          await prisma.table.update({
            where: { id: updatedOrder.tableId },
            data: { status: updatedOrder.selfOrder ? 'OCCUPIED' : 'AVAILABLE' }
          });
        } else if (data.status === 'SENT_TO_KITCHEN' && updatedOrder.tableId) {
          await prisma.table.update({
            where: { id: updatedOrder.tableId },
            data: { status: 'OCCUPIED' }
          });
        }
        await prisma.kitchenTicket.upsert({
          where: { orderId: id },
          update: { status: 'TO_COOK' },
          create: { orderId: id, status: 'TO_COOK' }
        });
      } catch (err) {
        console.error("Error updating table or kitchen ticket status on order status change:", err);
      }
    }

    return updatedOrder;
  }

  async deleteOrder(id: string) {
    return prisma.order.delete({ where: { id } });
  }

  async sendToKitchen(id: string) {
    try {
      await prisma.kitchenTicket.upsert({
        where: { orderId: id },
        update: { status: 'TO_COOK' },
        create: { orderId: id, status: 'TO_COOK' }
      });
    } catch (err) {
      console.error("Error creating kitchen ticket on sendToKitchen:", err);
    }

    return prisma.order.update({
      where: { id },
      data: { status: 'SENT_TO_KITCHEN' },
      include: { 
        items: true,
        customer: true,
        table: true
      },
    });
  }

  async cancelOrder(id: string) {
    return prisma.order.update({
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
