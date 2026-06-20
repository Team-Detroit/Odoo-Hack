import { Prisma } from '@prisma/client';
import { FloorRepository } from '../repository/floor.repository';
import { CreateFloorDto } from '../dto/createFloor.dto';
import { UpdateFloorDto } from '../dto/updateFloor.dto';

export class FloorService {
  private floorRepository = new FloorRepository();

  async getAllFloors() {
    return this.floorRepository.getAllFloors();
  }

  async getFloorById(id: string) {
    return this.floorRepository.getFloorById(id);
  }

  async createFloor(data: CreateFloorDto) {
    return this.floorRepository.createFloor(data);
  }

  async updateFloor(id: string, data: UpdateFloorDto) {
    try {
      return await this.floorRepository.updateFloor(id, data);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async deleteFloor(id: string) {
    try {
      return await this.floorRepository.deleteFloor(id);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }
}
