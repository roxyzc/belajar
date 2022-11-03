"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const route = (0, express_1.Router)();
route
    .route("/")
    .get(user_controller_1.findUsers)
    .post(user_controller_1.register)
    .delete(user_controller_1.deleteUsers)
    .put(user_controller_1.updateUser);
route.route("/:id").get(user_controller_1.findUser).delete(user_controller_1.deleteUser);
route.post("/login", user_controller_1.login);
exports.default = route;
