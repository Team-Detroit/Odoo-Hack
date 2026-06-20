import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/changePassword.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

import { UserRole } from '@prisma/client';

type AuthRequest = Request & { user?: { id: string; role: UserRole } };

export class AuthController {
  private authService = new AuthService();

  async signup(req: Request, res: Response) {
    try {
      const data = req.body as SignupDto;
      if (!data.name || !data.email || !data.password || !data.role) {
        return res.status(400).json(errorResponse('Missing required fields', 'name, email, password and role are required'));
      }

      const user = await this.authService.signup(data);
      res.status(201).json(successResponse('User created successfully', { user }));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error.message));
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = req.body as LoginDto;
      if (!data.email || !data.password) {
        return res.status(400).json(errorResponse('Missing required fields', 'email and password are required'));
      }

      const result = await this.authService.login(data);
      res.status(200).json(successResponse('Login successful', result));
    } catch (error: any) {
      res.status(401).json(errorResponse(error.message, error.message));
    }
  }

  async me(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(errorResponse('Unauthorized', 'User not authenticated'));
      }

      res.status(200).json(successResponse('User details fetched', { user: req.user }));
    } catch (error: any) {
      res.status(500).json(errorResponse(error.message, error.message));
    }
  }

  async logout(req: Request, res: Response) {
    try {
      res.status(200).json(successResponse('Logout successful', {}));
    } catch (error: any) {
      res.status(500).json(errorResponse(error.message, error.message));
    }
  }

  async changePassword(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(errorResponse('Unauthorized', 'User not authenticated'));
      }

      const data = req.body as ChangePasswordDto;
      if (!data.currentPassword || !data.newPassword) {
        return res.status(400).json(errorResponse('Missing required fields', 'currentPassword and newPassword are required'));
      }

      await this.authService.changePassword(req.user.id, data);
      res.status(200).json(successResponse('Password changed successfully', {}));
    } catch (error: any) {
      res.status(400).json(errorResponse(error.message, error.message));
    }
  }
}
