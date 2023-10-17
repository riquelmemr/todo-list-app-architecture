import { createServerApplication } from "@main/config";
import { TypeORMProvider } from "@main/database";
import supertest from "supertest";

describe("create-user-usecase-e2e", () => {
  let app: Express.Application;

  beforeAll(async () => {
    app = createServerApplication({
      listenBefore: true,
    });
  });

  afterEach(async () => {
    await TypeORMProvider.client.query("TRUNCATE tasks, users;");
  });

  it("should return http status 201 when create a user", async () => {
    const response = await supertest(app).post("/user/create").send({
      name: "any_name",
      email: "any_email@example.com",
      password: "any_password",
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "status",
      "Usuário criado com sucesso!"
    );
    expect(response.body.body).toHaveProperty("id");
    expect(response.body.body).toHaveProperty("name", "any_name");
    expect(response.body.body).toHaveProperty("email", "any_email@example.com");
  });

  it("should return http status 400 when user already exists", async () => {
    await supertest(app).post("/user/create").send({
      name: "any_name",
      email: "any_email@example.com",
      password: "any_password",
    });

    const response = await supertest(app).post("/user/create").send({
      name: "any_name",
      email: "any_email@example.com",
      password: "any_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Já existe um usuário com esse email! Tente outro."
    );
  });

  it("should return http status 400 when password is invalid", async () => {
    const response = await supertest(app).post("/user/create").send({
      name: "any_name",
      email: "any_email@example.com",
      password: "pass",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "A senha está vazia ou tem menos de 6 caracteres."
    );
  });

  it("should return http status 400 when email is invalid", async () => {
    const response = await supertest(app).post("/user/create").send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "O e-mail está vazio ou inválido."
    );
  });

  it("should return http status 400 when name is invalid", async () => {
    const response = await supertest(app).post("/user/create").send({
      name: "",
      email: "any_email",
      password: "any_password",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("error", "O nome é obrigatório.");
  });
});
