import { Request, Response } from 'express';
import { UsersService } from '../service/users.service';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

export class UsersController {
  private usersService = new UsersService();

  async getAll(req: Request, res: Response) {
    try {
      const users = await this.usersService.getAll();
      res.status(200).json(successResponse('Users fetched successfully', users));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch users', error.message));
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await this.usersService.getById(req.params.id as string);
      res.status(200).json(successResponse('User fetched successfully', user));
    } catch (error: any) {
      res.status(404).json(errorResponse('User not found', error.message));
    }
  }

  async create(req: Request, res: Response) {
    try {
      const user = await this.usersService.create(req.body);
      res.status(201).json(successResponse('User created successfully', user));
    } catch (error: any) {
      res.status(400).json(errorResponse('Failed to create user', error.message));
    }
  }

  async update(req: Request, res: Response) {
    try {
      const user = await this.usersService.update(req.params.id as string, req.body);
      res.status(200).json(successResponse('User updated successfully', user));
    } catch (error: any) {
      res.status(400).json(errorResponse('Failed to update user', error.message));
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = await this.usersService.delete(req.params.id as string);
      res.status(200).json(successResponse('User deleted successfully', user));
    } catch (error: any) {
      res.status(400).json(errorResponse('Failed to delete user', error.message));
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { userId, oldPassword, newPassword } = req.body;
      await this.usersService.changePassword(userId, oldPassword, newPassword);
      res.status(200).json(successResponse('Password updated successfully', true));
    } catch (error: any) {
      res.status(400).json(errorResponse('Failed to update password', error.message));
    }
  }
}
