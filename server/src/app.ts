import express from "express";
import cors from "cors";
import morgan from "morgan";

// handlers Route
import { processors } from "./routes/proccessRoutes";
import { auth } from "./routes/authRoutes";
import { wp } from "./routes/apiWhatsapp";
import { collection } from "./routes/collectionRoutes";

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
app.use("/collections", collection);

export default app;
