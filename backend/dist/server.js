"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const socket_1 = require("./shared/socket");
dotenv_1.default.config();
const PORT = Number(process.env.PORT) || 5000;
const server = http_1.default.createServer(app_1.default);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
(0, socket_1.setSocketServer)(exports.io);
exports.io.on("connection", (socket) => {
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
