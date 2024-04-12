import { server } from "./server";
import "./routes/whatsappRoutes";

const port = 3000;

server.listen(port, () => {
  console.log(`server io running in port ${port}`);
});
