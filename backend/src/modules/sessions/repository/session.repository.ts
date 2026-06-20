import prisma from '../../../shared/prisma';
import { OpenSessionDto } from '../dto/openSession.dto';

export class SessionRepository {
  async getActiveSessionPublic() {
    return prisma.session.findFirst({
      where: { status: 'OPEN' },
    });
  }

  async getCurrentSession(userId: string) {
    return prisma.session.findFirst({
      where: { userId, status: 'OPEN' },
    });
  }

  async getAllSessions() {
    return prisma.session.findMany();
  }

  async openSession(data: OpenSessionDto) {
    return prisma.session.create({ data: { userId: data.userId, status: 'OPEN' } });
  }

  async closeSession(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { status: 'CLOSED', closedAt: new Date() },
    });
  }

  async getSessionHistory(userId: string) {
    return prisma.session.findMany({ where: { userId }, orderBy: { openedAt: 'desc' } });
  }
}
