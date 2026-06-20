import prisma from '../../../shared/prisma';
import { KitchenStatus } from '@prisma/client';

export class KdsRepository {
  async getAllKitchenTickets() {
    return prisma.kitchenTicket.findMany({ 
      include: { 
        order: { 
          include: { 
            items: {
              include: { product: true }
            },
            customer: true,
            table: true
          } 
        } 
      } 
    });
  }

  async getKitchenTicketById(id: string) {
    return prisma.kitchenTicket.findUnique({ 
      where: { id }, 
      include: { 
        order: { 
          include: { 
            items: {
              include: { product: true }
            },
            customer: true,
            table: true
          } 
        } 
      } 
    });
  }

  async getTicketsByStatus(status: KitchenStatus) {
    return prisma.kitchenTicket.findMany({
      where: { status },
      include: { 
        order: { 
          include: { 
            items: {
              include: { product: true }
            },
            customer: true,
            table: true
          } 
        } 
      }
    });
  }

  async updateTicketStatus(id: string, status: KitchenStatus) {
    return prisma.kitchenTicket.update({
      where: { id },
      data: { status },
      include: { 
        order: { 
          include: { 
            items: {
              include: { product: true }
            },
            customer: true,
            table: true
          } 
        } 
      }
    });
  }
}
