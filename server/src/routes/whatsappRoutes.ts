import { io } from "../server";
import {
  allSessions,
  createSessionWP,
  getWhatsappSession,
} from "../controllers/whatsappController";

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

  socket.on("getSession", (data) => {
    console.log(data);
    const { id } = data;
    getWhatsappSession(id, socket)
  });

  socket.on("getAllChats", async (data) => {
    console.log(data);
    const { id } = data;
    const client = allSessions[id];
    const allChats = await client.getChats();
    socket.emit("allChats", allChats);
  });

  socket.on("remote_session_saved", (data) => {
    socket.emit("remoteSessionSaved", data)
  })
});
