import express from "express";
import { processors } from "./routes/proccessRoutes";
import { auth } from "./routes/authRoutes";
import cors from "cors";
import morgan from "morgan";
import { wp } from "./routes/apiWhatsapp";

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
app.use("/wp", wp);

export default app;
