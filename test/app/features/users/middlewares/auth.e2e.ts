import { app } from "@test/setup/app";
import supertest from "supertest";

describe("auth-middleware-e2e", () => {
  it("should return http status 401 when token is empty", async () => {
    const response = await supertest(app)
      .get("/task");

    expect(response.statusCode).toBe(401);
    expect(response.body.auth).toBeFalsy();
    expect(response.body.error).toBe(
      "Você precisa estar logado para realizar está ação."
    );
  });

  it("should return http status 401 when token invalid", async () => {
    const response = await supertest(app)
      .get("/task")
      .set("Authorization", `invalid-token`);

    expect(response.statusCode).toBe(401);
    expect(response.body.auth).toBeFalsy();
    expect(response.body.error).toBe("Token expirado ou inválido.");
  });
});
