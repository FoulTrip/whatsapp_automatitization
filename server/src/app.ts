import express from "express";
import { processors } from "./routes/proccessRoutes";
import { auth } from "./routes/authRoutes";
import cors from "cors";
import morgan from "morgan";

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(multer().array("file"));

// routes
app.use("/api", processors);
app.use("/auth", auth);

export default app;
