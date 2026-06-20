import { Prisma } from '@prisma/client';
import { KdsRepository } from '../repository/kds.repository';
import { KitchenStatus } from '@prisma/client';

export class KdsService {
  private kdsRepository = new KdsRepository();

  async getAllKitchenTickets() {
    return this.kdsRepository.getAllKitchenTickets();
  }

  async getKitchenTicketById(id: string) {
    return this.kdsRepository.getKitchenTicketById(id);
  }

  async getTicketsByStatus(status: KitchenStatus) {
    return this.kdsRepository.getTicketsByStatus(status);
  }

  async updateTicketStatus(id: string, status: KitchenStatus) {
    try {
      return await this.kdsRepository.updateTicketStatus(id, status);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteKitchenTicket(id: string) {
    try {
      return await this.kdsRepository.deleteKitchenTicket(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
