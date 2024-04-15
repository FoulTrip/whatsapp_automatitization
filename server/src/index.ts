import { server } from "./server";
import "./routes/whatsappRoutes";
import dotenv from "dotenv";

dotenv.config();
const port = 3000;

server.listen(port, () => {
  console.log(`server io running in port ${port}`);
});
