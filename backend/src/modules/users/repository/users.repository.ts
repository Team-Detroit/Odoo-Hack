import prisma from '../../../shared/prisma';
import { CreateUserRequest, UpdateUserRequest } from '../dto/user.dto';

export class UsersRepository {
  async getAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserRequest & { passwordHash: string }) {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: data.role.toUpperCase() as any,
      }
    });
  }

  async update(id: string, data: any) {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.role !== undefined) updateData.role = data.role.toUpperCase() as any;
    if (data.passwordHash !== undefined) updateData.password = data.passwordHash;
    
    return prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string) {
    return prisma.user.delete({ where: { id } });
  }
}
