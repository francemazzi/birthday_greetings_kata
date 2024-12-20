import express, { Express } from "express";
import routes from "./routes";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/", routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server in esecuzione su http://localhost:${port}`);
});
