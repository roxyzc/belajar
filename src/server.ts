import express, { Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";
const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (_req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany({});
    res.status(200).json({ success: true, user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.listen(5000, () => {
  console.log(`Listen at port 5000 as ${process.env.NODE_ENV}`);
});
