import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import prisma from '../../../shared/prisma';
import { AuthRepository } from '../repository/auth.repository';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/changePassword.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export class AuthService {
  private authRepository = new AuthRepository();

  async signup(data: SignupDto) {
    const existingUser = await this.authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, Number(process.env.BCRYPT_ROUNDS || 10));
    return this.authRepository.createUser({
      ...data,
      password: hashedPassword,
    });
  }

  async login(data: LoginDto) {
    const user = await this.authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE as unknown as number }
    );

    return { user, token };
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const user = await this.authRepository.findUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const currentMatches = await bcrypt.compare(data.currentPassword, user.password);
    if (!currentMatches) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, Number(process.env.BCRYPT_ROUNDS || 10));
    return prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }
}
