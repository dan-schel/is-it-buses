import { beforeAll, describe, expect, it } from "vitest";
import { agent } from "supertest";
import { createTestServer } from "@/tests/server/utils";
import { Admin } from "@/server/database/models/user";
import { ADMINS, SESSIONS } from "@/server/database/models";
import { hashSync } from "bcrypt";
import { Session } from "@/server/database/models/session";

const password = "ILikeTrains!";
const hashedPassword = hashSync(password, 10);
const superAdmin = new Admin(
  "9ccc4a4c-17d9-4157-9f25-78325c53ddab",
  "TrainConductor",
  hashedPassword,
  "super",
  null,
);
const session = new Session(
  "75fde04a-69a7-44b9-919a-d022db579793",
  new Date("2025-01-02T00:00:00Z"),
  superAdmin.id,
  superAdmin.role,
);
const cookie = `session_id=${session.id}; Path=/; Expires=Thu, 02 Jan 2025 00:00:00 GMT; HttpOnly; SameSite=Lax`;
const { server, app } = await createTestServer();

beforeAll(async () => {
  await app.database.of(ADMINS).create(superAdmin);
  await app.database.of(SESSIONS).create(session);
});

describe("/api/auth", () => {
  describe("/login", () => {
    const url = "/api/auth/login";
    describe("throws validation error when property not provided", () => {
      it("username & password not provided", async () => {
        const response = await agent(server).post(url);

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("body");
        expect(response.body.error.body).toHaveProperty("field", "");
        expect(response.body.error.body).toHaveProperty("message", "Required");
      });

      it("only password not provided", async () => {
        const response = await agent(server)
          .post(url)
          .send({ username: superAdmin.username });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("body");
        expect(response.body.error.body).toHaveProperty("field", "password");
        expect(response.body.error.body).toHaveProperty("message", "Required");
      });

      it("only username not provided", async () => {
        const response = await agent(server).post(url).send({ password });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("body");
        expect(response.body.error.body).toHaveProperty("field", "username");
        expect(response.body.error.body).toHaveProperty("message", "Required");
      });
    });

    describe("throws validation error when field is empty", () => {
      it("both fields are empty strings", async () => {
        const response = await agent(server)
          .post(url)
          .send({ username: "", password: "" });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("body");
        expect(response.body.error.body).toHaveProperty("field", "username");
        expect(response.body.error.body).toHaveProperty(
          "message",
          "This field is required",
        );
      });

      it("username field is an empty string", async () => {
        const response = await agent(server)
          .post(url)
          .send({ username: "", password });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("body");
        expect(response.body.error.body).toHaveProperty("field", "username");
        expect(response.body.error.body).toHaveProperty(
          "message",
          "This field is required",
        );
      });

      it("password field is an empty string", async () => {
        const response = await agent(server)
          .post(url)
          .send({ username: superAdmin.username, password: "" });

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toHaveProperty("body");
        expect(response.body.error.body).toHaveProperty("field", "password");
        expect(response.body.error.body).toHaveProperty(
          "message",
          "This field is required",
        );
      });
    });

    describe("throws an error on invalid credentials", () => {
      it("both username & password is incorrect", async () => {
        const response = await agent(server)
          .post(url)
          .send({ username: "TrainCommuter", password: "IHateTrains" });

        expect(response.statusCode).toEqual(403);
        expect(response.body).toHaveProperty(
          "error",
          "Username/password is incorrect",
        );
      });

      it("username is correct but password is incorrect", async () => {
        const response = await agent(server)
          .post(url)
          .send({ username: superAdmin.username, password: "IHateTrains" });

        expect(response.statusCode).toEqual(403);
        expect(response.body).toHaveProperty(
          "error",
          "Username/password is incorrect",
        );
      });
    });

    it("logs in admin with correct credentials", async () => {
      const response = await agent(server)
        .post(url)
        .send({ username: superAdmin.username, password });

      expect(response.statusCode).toEqual(302);
      expect(response.redirect).toEqual(true);
      expect(response.headers["set-cookie"]).toHaveLength(1);
      expect(response.headers["set-cookie"].at(0)).contains("session_id");
      expect(response.headers["set-cookie"].at(0)).contains(
        "Path=/; Expires=Thu, 02 Jan 2025 00:00:00 GMT; HttpOnly; SameSite=Lax",
      );
    });
  });

  describe("/logout", () => {
    const url = "/api/auth/logout";
    describe("logs out admin successfully", async () => {
      it("doesn't crash the server if the session doesn't exist", async () => {
        const response = await agent(server)
          .get(url)
          .set("Cookie", [
            "session_id=fakesessionid; Path=/; Expires=Thu, 02 Jan 2025 00:00:00 GMT; HttpOnly; SameSite=Lax",
          ]);

        expect(response.statusCode).toEqual(302);
        expect(response.redirect).toEqual(true);
        expect(response.headers["set-cookie"]).toContainEqual(
          "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        );
      });

      it("removes the session from the database", async () => {
        const existingSession = await app.database.of(SESSIONS).get(session.id);
        expect(existingSession).toEqual(session);

        const response = await agent(server).get(url).set("Cookie", [cookie]);
        expect(response.statusCode).toEqual(302);
        expect(response.redirect).toEqual(true);
        expect(response.headers["set-cookie"]).toContainEqual(
          "session_id=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        );

        const deletedSession = await app.database.of(SESSIONS).get(session.id);
        expect(deletedSession).toEqual(null);
      });
    });
  });
});
