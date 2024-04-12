import http from "http";
import { Server } from "socket.io";
import app from "./app";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

export { server, io };
