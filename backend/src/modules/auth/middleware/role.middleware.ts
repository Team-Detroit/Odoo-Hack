import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

type AuthRequest = Request & { user?: { id: string; role: UserRole } };

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized', error: 'User not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden', error: 'Insufficient permissions' });
    }

    next();
  };
}
