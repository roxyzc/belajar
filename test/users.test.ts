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
    expect(2 + 2).toBe(4);
  });
});
