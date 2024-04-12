import { Client } from "whatsapp-web.js";

interface Session {
  [key: string]: Client;
}

export default Session;
