import { Router } from "express";
import {
  register,
  deleteUsers,
  login,
  updateUser,
  deleteUser,
  findUser,
  findUsers,
  changePassword,
} from "../controllers/user.controller";
const route = Router();

route
  .route("/")
  .get(findUsers)
  .post(register)
  .delete(deleteUsers)
  .put(updateUser);
route.route("/:id").get(findUser).delete(deleteUser);
route.post("/login", login);
route.post("/changePassword", changePassword);

export default route;
