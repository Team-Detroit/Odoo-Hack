import dotenv from "dotenv";

import http from "http";

import { Server } from "socket.io";

import app from "./app";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`Socket Connected ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Socket Disconnected ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});