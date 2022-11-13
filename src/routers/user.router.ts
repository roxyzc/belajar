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
  cekOtp,
  verifyOtp,
  changePasswordNew,
} from "../controllers/user.controller";
const route = Router();

// route.post("/otp/:id", verifyOtp, changePasswordNew);
route.route("/otp/:id").post(verifyOtp).put(changePasswordNew);
route.get("/otp", cekOtp);
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
