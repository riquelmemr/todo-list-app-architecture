import { TypeORMProvider } from "@main/database";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";
import { app } from "@test/setup/app";
import supertest from "supertest";

describe("login-user-usecase-e2e", () => {
  const email = "any_email@example.com";

  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http status 200 when login a user", async () => {
    await UserBuilder.init().build(email);

    const response = await supertest(app).post("/user/login").send({
      email,
      password: "any_password",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      status: "Usuário logado com sucesso!",
      token: expect.any(String),
      body: {
        id: expect.any(String),
        name: "any_name",
        email: "any_email@example.com",
      },
    });
  });

  it("should return http status 400 when password is less than 6 characters", async () => {
    const response = await supertest(app).post("/user/login").send({
      email,
      password: "inv",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "O campo 'password' está vazio ou tem menos de 6 caracteres."
    );
  });

  it("should return http status 400 when email is invalid", async () => {
    const response = await supertest(app).post("/user/login").send({
      email: "invalid_email",
      password: "any_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("O campo 'email' está vazio ou inválido.");
  });

  it("should return http status 400 when user not found", async () => {
    const response = await supertest(app).post("/user/login").send({
      email,
      password: "any_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Utilize um email válido ou cadastre-se.");
  });

  it("should return http status 400 when not match password", async () => {
    await UserBuilder.init().build(email);

    const response = await supertest(app).post("/user/login").send({
      email,
      password: "invalid_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Email e/ou senha inválidos!"
    );
  });
});
