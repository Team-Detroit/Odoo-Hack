import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import prisma from '../../../shared/prisma';

type AuthRequest = Request & { user?: { id: string; role: UserRole } };

const JWT_SECRET: Secret = process.env.JWT_SECRET || 'secret';

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized', error: 'Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };

    // Check if the user still exists in the database
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id }
    });

    if (!dbUser) {
      return res.status(401).json({ success: false, message: 'Unauthorized', error: 'User session has expired or user does not exist' });
    }

    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Unauthorized', error: error.message });
  }
}
