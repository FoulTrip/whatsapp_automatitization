import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { Client, LocalAuth } from "whatsapp-web.js";

interface Session {
  [key: string]: Client;
}

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

server.listen(port, () => {
  console.log(`server io running in port ${port}`);
});

const allSessions: Session = {};

const createSessionWP = (id: any, socket: any) => {
  const client = new Client({
    puppeteer: {
      headless: false,
    },
    authStrategy: new LocalAuth({
      clientId: id,
    }),
  });

  client.on("qr", (qr) => {
    console.log("QR Received", qr);
    socket.emit("qr", { qr });
  });

  client.on("authenticated", () => {
    console.log("AUTHENTICATED");
  });

  client.on("ready", () => {
    console.log("Client is ready");
    allSessions[id] = client;
    socket.emit("ready", { id, message: "Client is ready" });
  });

  // client.on("message", (msg) => {
  //   if (msg.body == "ping") {
  //     msg.reply("pong");
  //   }
  // });

  client.initialize();
};

io.on("connection", (socket) => {
  console.log("a user connected", socket && socket.id);

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("connected", (data) => {
    console.log("Connected to the server", data);
    socket.emit("hello", "Hello from server");
  });

  socket.on("createSession", (data) => {
    console.log(data);
    const { id } = data;
    createSessionWP(id, socket);
  });
});
