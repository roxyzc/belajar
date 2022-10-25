import { Router } from "express";
import { register, deleteUsers } from "../controllers/user.controller";
const route = Router();

route.route("/").get(register).delete(deleteUsers);

export default route;
