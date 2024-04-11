import express from "express";
import { Client, LocalAuth } from "whatsapp-web.js";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`Server running in port ${port}`);
});

const Sessions = {};

const client = new Client({
  puppeteer: {
    headless: false,
  },
  authStrategy: new LocalAuth({
    clientId: "YOUR_CLIENT_ID",
  }),
});

client.on("qr", (qr) => {
  console.log("QR Received", qr);
});

client.on("ready", () => {
  console.log("Client is ready");
});

client.on("message", (msg) => {
  if (msg.body == "ping") {
    msg.reply("pong");
  }
});

client.initialize();
