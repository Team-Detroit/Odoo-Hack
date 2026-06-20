import { useSessionStore } from '../store/sessionStore';
import { sessionService } from '../services/sessionService';
import { useMutation } from '@tanstack/react-query';
import { CreateSessionRequest, CloseSessionRequest } from '../types/session';

export const useSession = () => {
  const { session, setSession, clearSession } = useSessionStore();
  const open = useMutation({ mutationFn: (d: CreateSessionRequest) => sessionService.create(d), onSuccess: setSession });
  const close = useMutation({ mutationFn: (d: CloseSessionRequest) => sessionService.close(d), onSuccess: clearSession });
  return { session, open, close, isOpen: !!session?.isActive };
};
