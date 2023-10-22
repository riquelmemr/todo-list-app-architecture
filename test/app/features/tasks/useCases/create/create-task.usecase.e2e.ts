import { JWTProvider } from "@app/shared/helpers";
import { UserBuilder } from "@test/app/shared/builders/entities/user.entity.builder";
import { app } from "@test/setup/app";
import supertest from "supertest";

export async function makeToken() {
  const user = await UserBuilder.init().build();
  const token = JWTProvider.generateToken({
    id: user.Id,
    name: user.Name,
    email: user.Email,
  });

  return {
    token,
    user
  };
}

describe("create-task-usecase-e2e", () => {
  it("should return http status 201 when create a task", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .post("/task/create")
      .set("Authorization", `${token}`)
      .send({
        title: "any_title",
        description: "any_description",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual({
      success: true,
      status: "Tarefa criada com sucesso!",
      body: {
        id: expect.any(String),
        title: "any_title",
        description: "any_description",
        finishedDate: null,
        archived: false,
        done: false,
        createdAt: expect.any(String),
        userId: expect.any(String),
      },
    });
  });

  it("should return http status 201 when create a task with finished date", async () => {
    const { token, user } = await makeToken();

    const response = await supertest(app)
      .post("/task/create")
      .set("Authorization", `${token}`)
      .send({
        title: "any_title",
        description: "any_description",
        finishedDate: new Date(),
      });

    const body = response.body.body;

    expect(response.statusCode).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body.title).toBe("any_title");
    expect(body.description).toBe("any_description");
    expect(body.finishedDate).toStrictEqual(expect.any(String));
    expect(body.archived).toBeFalsy();
    expect(body.done).toBeFalsy();
    expect(body.createdAt).toStrictEqual(expect.any(String));
    expect(body).toHaveProperty("userId", user.Id);
  });

  it("should return http status 400 when create a task without title", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .post("/task/create")
      .set("Authorization", `${token}`)
      .send({
        description: "any_description",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("O campo 'title' é obrigatório.");
  });

  it("should return http status 400 when create a task without description", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .post("/task/create")
      .set("Authorization", `${token}`)
      .send({
        title: "any_title",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "O campo 'description' está vazio ou inválido."
    );
  });
});
