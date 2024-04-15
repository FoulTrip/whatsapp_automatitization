import { Router } from "express";
import SessionService from "../classes/SessionService";

export const auth = Router();

auth.post("/signin", async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      throw new Error("session_id is required");
    }

    const response = await SessionService.create({
      session_id,
    });

    console.log(response);

    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});

auth.get("/sessions", async (req, res) => {
  try {
    const response = await SessionService.all();
    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});
