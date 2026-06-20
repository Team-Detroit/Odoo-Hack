import { Server } from 'socket.io';

export let io: Server | null = null;

export function setSocketServer(server: Server) {
  io = server;
}
