import { io } from "../server";
import {
  allSessions,
  createSessionWP,
  getWhatsappSession,
} from "../controllers/whatsappController";
import CollectionServices from "../classes/CollectionServices";
import EventCollectionNotificationsService from "../classes/EventNotificationsServices";

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
    getWhatsappSession(id, socket);
  });

  socket.on("getAllChats", async (data) => {
    console.log(data);
    const { id } = data;
    const client = allSessions[id];
    const allChats = await client.getChats();
    socket.emit("allChats", allChats);
  });

  socket.on("remote_session_saved", (data) => {
    socket.emit("remote_session_saved", data);
  });

  socket.on("create_collection", async (data) => {
    try {
      // console.log("create_collection:", data);
      const response = await CollectionServices.create({
        name: data.name,
        nameType: data.nameType,
        sessionId: data.sessionId,
      });
      const updatedCollections = await CollectionServices.findBySession(
        response.sessionId
      );
      // console.log("Updated_collections:", updatedCollections);
      socket.emit("collection_update", updatedCollections);
    } catch (error) {
      console.error("Error creating collection:", error);
      socket.emit("error", { message: "Error creating collection", error });
    }
  });

  socket.on("create_event_notification", async (data) => {
    try {
      const response = await EventCollectionNotificationsService.create({
        collectionId: data.collectionId,
        name: data.name,
        type: data.type,
      });
      console.log("create:", response);
      const updateListEvent =
        await EventCollectionNotificationsService.findByCollectionId(
          response.collectionId
        );
      console.log("update:", updateListEvent);
      socket.emit("update_event_notification", updateListEvent);
    } catch (error) {
      console.error("Error creating Event Notification:", error);
      socket.emit("error", {
        message: "Error create event notification",
        error,
      });
    }
  });
});
