process.env.NODE_ENV = "test";
process.env.JWT_SECRET_KEY = "test-jwt-secret-key-for-jest-only";

const request = require("supertest");
const app = require("../app");

describe("Health", () => {
  it("GET /health returns 200", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
