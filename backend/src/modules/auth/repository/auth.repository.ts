import prisma from '../../../shared/prisma';
import { SignupDto } from '../dto/signup.dto';

export class AuthRepository {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: SignupDto) {
    return prisma.user.create({ data });
  }
}
