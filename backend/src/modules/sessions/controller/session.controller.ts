import { Request, Response } from 'express';
import { SessionService } from '../service/session.service';
import { OpenSessionDto } from '../dto/openSession.dto';
import { successResponse, errorResponse } from '../../../shared/utils/response.util';

type AuthRequest = Request & { user?: { id: string } };

export class SessionController {
  private sessionService = new SessionService();

  async getCurrentSession(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(errorResponse('Unauthorized', 'User not authenticated'));
      }

      const session = await this.sessionService.getCurrentSession(req.user.id);
      if (session) {
        res.status(200).json(successResponse('Current session fetched', session));
      } else {
        res.status(200).json(successResponse('No active session found', null));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch session', error.message));
    }
  }

  async openSession(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(errorResponse('Unauthorized', 'User not authenticated'));
      }

      const session = await this.sessionService.openSession({ userId: req.user.id });
      res.status(201).json(successResponse('Session opened successfully', session));
    } catch (error: any) {
      console.error("Error opening session:", error);
      res.status(500).json(errorResponse('Failed to open session', error.message));
    }
  }

  async closeSession(req: AuthRequest, res: Response) {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json(errorResponse('Missing required fields', 'sessionId is required'));
      }

      const session = await this.sessionService.closeSession(sessionId);
      if (session) {
        res.status(200).json(successResponse('Session closed successfully', session));
      } else {
        res.status(404).json(errorResponse('Session not found', 'Session not found'));
      }
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to close session', error.message));
    }
  }

  async getSessionHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json(errorResponse('Unauthorized', 'User not authenticated'));
      }

      const history = await this.sessionService.getSessionHistory(req.user.id);
      res.status(200).json(successResponse('Session history fetched', history));
    } catch (error: any) {
      res.status(500).json(errorResponse('Failed to fetch session history', error.message));
    }
  }
}
