import express from "express";
import { processors } from "./routes/proccessRoutes";
import cors from "cors";
import morgan from "morgan";
import multer from "multer";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(multer().array("file"));

// routes
app.use("/api", processors);

export default app;
