import { Router } from "express";
import { allSessions } from "../controllers/whatsappController";
import { messageMassiveReq } from "../types/requests";

export const wp = Router();

wp.post("/send", (req, res) => {
  const { onlySelect, image, message, idSession, zipCode }: messageMassiveReq = req.body;

  console.log(onlySelect);

  try {
    const client = allSessions[idSession];

    let lenSends = onlySelect.length;
    let succesSends = 0;

    for (let contacts of onlySelect) {
      let idChat = `${zipCode}${contacts.number}@c.us`;
      client.sendMessage(idChat, message);
      succesSends += 1;
    }

    if (succesSends < lenSends) {
      throw new Error(`${succesSends / lenSends} messages sent`);
    }

    console.log(`success send: ${succesSends}`);

    if (succesSends === lenSends) {
      res.json({ success: true });
    }
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});
