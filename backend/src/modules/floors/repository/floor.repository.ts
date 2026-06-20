import prisma from '../../../shared/prisma';
import { CreateFloorDto } from '../dto/createFloor.dto';
import { UpdateFloorDto } from '../dto/updateFloor.dto';

export class FloorRepository {
  async getAllFloors() {
    return prisma.floor.findMany();
  }

  async getFloorById(id: string) {
    return prisma.floor.findUnique({ where: { id } });
  }

  async createFloor(data: CreateFloorDto) {
    return prisma.floor.create({ data });
  }

  async updateFloor(id: string, data: UpdateFloorDto) {
    return prisma.floor.update({ where: { id }, data });
  }

  async deleteFloor(id: string) {
    return prisma.floor.delete({ where: { id } });
  }
}
