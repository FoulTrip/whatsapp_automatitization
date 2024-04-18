import { Router } from "express";
import { ScalarCollection } from "../types/collection";
import CollectionServices from "../classes/Collections";

export const collection = Router();

collection.post("/create", async (req, res) => {
  try {
    const { name, nameType, sessionId }: ScalarCollection = req.body;
    if (!name) throw new Error("name is required");
    if (!sessionId) throw new Error("sessionId is required");

    const response = await CollectionServices.create({
      name,
      sessionId,
      nameType,
    });

    if (!response.id) throw new Error("Error creating collection");

    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      res.json({ success: false, error: error.message });
    }
  }
});

collection.post("/id", async (req, res) => {
  try {
    const { collectionId }: { collectionId: string } = req.body;

    if (!collectionId) throw new Error("collectionId is required");
    const response = await CollectionServices.findById(collectionId);
    if (!response?.sessionId) throw new Error("Error getting collection");
    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});

collection.post("/session", async (req, res) => {
  try {
    const { sessionId }: { sessionId: string } = req.body;

    if (!sessionId) throw new Error("collectionId is required");
    const response = await CollectionServices.findBySession(sessionId);
    if (!response) throw new Error("Error getting collection");
    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});

collection.put("/update", async (req, res) => {
  try {
    const {
      data,
      collectionId,
    }: { data: ScalarCollection; collectionId: string } = req.body;

    if (!collectionId) throw new Error("collectionId is required");
    if (!data) throw new Error("No data to update");

    const response = await CollectionServices.updateCollection(
      collectionId,
      data
    );
    if (!response) throw new Error("Impossible to update collection");

    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});

collection.delete("/remove", async (req, res) => {
  try {
    const { collectionId }: { collectionId: string } = req.body;
    if (!collectionId) throw new Error("collectionId is required");
    const response = await CollectionServices.deleteCollection(collectionId);
    if (!response) throw new Error("Error deleting collection");
    res.json({ success: true, data: response });
  } catch (error) {
    if (error instanceof Error) {
      res.json({ success: false, error: error.message });
    }
  }
});
