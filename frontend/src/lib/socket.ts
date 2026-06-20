import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const sock = getSocket();
  if (!sock.connected) {
    sock.connect();
  }
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const emitSocketEvent = (eventName: string, data?: unknown) => {
  const sock = getSocket();
  if (sock.connected) {
    sock.emit(eventName, data);
  }
};

export const onSocketEvent = (eventName: string, callback: (data: unknown) => void) => {
  const sock = getSocket();
  sock.on(eventName, callback);
};

export const offSocketEvent = (eventName: string, callback?: (data: unknown) => void) => {
  const sock = getSocket();
  if (callback) {
    sock.off(eventName, callback);
  } else {
    sock.off(eventName);
  }
};
