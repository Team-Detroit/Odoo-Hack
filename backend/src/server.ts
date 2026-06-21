import dotenv from "dotenv";

import http from "http";

import { Server } from "socket.io";

import app from "./app";
import { setSocketServer } from "./shared/socket";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setSocketServer(io);

io.on("connection", (socket) => {
  console.log(`Socket Connected ${socket.id}`);

  socket.on("payment:request", (data) => {
    socket.broadcast.emit("payment:request", data);
  });

  socket.on("payment:response", (data) => {
    socket.broadcast.emit("payment:response", data);
  });

  socket.on("payment:cancel", (data) => {
    socket.broadcast.emit("payment:cancel", data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket Disconnected ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});