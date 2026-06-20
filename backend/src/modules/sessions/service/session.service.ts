import { Prisma } from '@prisma/client';
import { SessionRepository } from '../repository/session.repository';
import { OpenSessionDto } from '../dto/openSession.dto';

export class SessionService {
  private sessionRepository = new SessionRepository();

  async getActiveSessionPublic() {
    return this.sessionRepository.getActiveSessionPublic();
  }

  async getCurrentSession(userId: string) {
    return this.sessionRepository.getCurrentSession(userId);
  }

  async getAllSessions() {
    return this.sessionRepository.getAllSessions();
  }

  async openSession(data: OpenSessionDto) {
    return this.sessionRepository.openSession(data);
  }

  async closeSession(sessionId: string) {
    try {
      return await this.sessionRepository.closeSession(sessionId);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        return null;
      }
      throw error;
    }
  }

  async getSessionHistory(userId: string) {
    return this.sessionRepository.getSessionHistory(userId);
  }
}
