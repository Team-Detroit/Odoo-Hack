import bcrypt from 'bcryptjs';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserRequest, UpdateUserRequest } from '../dto/user.dto';

export class UsersService {
  private usersRepository = new UsersRepository();

  async getAll() {
    const users = await this.usersRepository.getAll();
    return users.map(u => {
      const { password, ...userWithoutPassword } = u;
      return { ...userWithoutPassword, isActive: true }; // Add isActive to match frontend mockup expectation
    });
  }

  async getById(id: string) {
    const user = await this.usersRepository.getById(id);
    if (!user) throw new Error('User not found');
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, isActive: true };
  }

  async create(data: CreateUserRequest) {
    const existing = await this.usersRepository.getByEmail(data.email);
    if (existing) throw new Error('Email already registered');
    
    const plainPassword = data.password || 'password123';
    const passwordHash = await bcrypt.hash(plainPassword, 10);
    const user = await this.usersRepository.create({ ...data, passwordHash });
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, isActive: true };
  }

  async update(id: string, data: UpdateUserRequest) {
    let passwordHash: string | undefined;
    if (data.password) {
      passwordHash = await bcrypt.hash(data.password, 10);
    }
    const user = await this.usersRepository.update(id, { ...data, passwordHash });
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, isActive: true };
  }

  async delete(id: string) {
    await this.usersRepository.delete(id);
  }

  async changePassword(userId: string, oldPw: string, newPw: string) {
    const user = await this.usersRepository.getById(userId);
    if (!user) throw new Error('User not found');
    
    const matches = await bcrypt.compare(oldPw, user.password);
    if (!matches) throw new Error('Invalid old password');
    
    const passwordHash = await bcrypt.hash(newPw, 10);
    await this.usersRepository.update(userId, { passwordHash });
  }
}
