import express, { Application } from "express";
import route from "./routers/user.router";
import "dotenv/config";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(route);

app.listen(5000, () => {
  console.log(`Listen at port 5000 as ${process.env.NODE_ENV}`);
});

export { app };
