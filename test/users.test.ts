import request from "supertest";
import { app } from "../src/server";

describe("coba1", () => {
  it("test", async () => {
    const res = await request(app).get("/otp");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ success: true, users: [] });
  });

  it("test1", async () => {
    const res = await request(app)
      .post("/login")
      .send({ email: "admin@admin.com", password: "coba1234567" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ success: false, message: "Password not match" });
  });
});

describe("coba2", () => {
  it("test", () => {
    const coba: String = "10023900";
    let array: Number[] = [];
    for (let i = 0; i < coba.length; i++) {
      array[i] = Number(coba.charAt(i));
    }

    array.sort(() => 0.5 - Math.random());
    console.log(array);
  });
});
