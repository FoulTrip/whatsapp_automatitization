import { Client, RemoteAuth, Store } from "whatsapp-web.js";
import Session from "../types/Session";
import mongoose from "mongoose";
import { MongoStore } from "wwebjs-mongo";
import { Socket } from "socket.io";

const allSessions: Session = {};
let store: Store;
const uri = "mongodb://0.0.0.0:27017/session_wb";

mongoose.connect(uri).then(() => {
  store = new MongoStore({ mongoose: mongoose });
  console.log("MongoDB Connected!");

  // console.log(store);
});

const createSessionWP = (id: string, socket: Socket) => {
  const client = new Client({
    puppeteer: {
      headless: false,
    },
    authStrategy: new RemoteAuth({
      clientId: id,
      store: store,
      backupSyncIntervalMs: 300000,
    }),
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
  });

  client.on("qr", (qr) => {
    console.log("QR Received", qr);
    socket.emit("qr", { qr });
  });

  client.on("authenticated", () => {
    console.log("AUTHENTICATED");
  });

  client.on("auth_failure", (msg) => {
    // Fired if session restore was unsuccessful
    console.error("AUTHENTICATION FAILURE", msg);
  });

  client.on("ready", () => {
    console.log("Client is ready");
    allSessions[id] = client;
    socket.emit("ready", { id, message: "Client is ready" });
  });

  client.on("remote_session_saved", () => {
    console.log("remote_session_saved");
    socket.emit("remote_session_saved", {
      message: "remote session saved",
    });
  });

  client.on("message", (msg) => {
    console.log(msg.body);
    if (msg.body == "ping") {
      msg.reply("pong");
      const data = {
        author: msg.from,
        message: msg.body,
      };
      console.log(data)
      socket.emit("newMessage", data);
    }
  });

  client.initialize();
};

const getWhatsappSession = (id: string, socket: Socket) => {
  const client = new Client({
    puppeteer: {
      headless: false,
    },
    authStrategy: new RemoteAuth({
      clientId: id,
      store: store,
      backupSyncIntervalMs: 300000,
    }),
    webVersionCache: {
      type: "remote",
      remotePath:
        "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html",
    },
  });

  client.on("ready", () => {
    console.log("Client is ready");
    socket.emit("ready", {
      id,
      message: "client is ready",
    });
  });

  client.on("qr", (qr) => {
    socket.emit("qr", {
      qr,
      message: "Code QR Generate",
    });
  });

  client.initialize();
};

export { allSessions, createSessionWP, getWhatsappSession };
