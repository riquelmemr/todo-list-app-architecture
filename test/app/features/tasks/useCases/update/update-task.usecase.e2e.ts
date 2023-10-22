import { TaskBuilder } from "@test/app/shared/builders/entities/task.entity.builder";
import { app } from "@test/setup/app";
import { randomUUID } from "crypto";
import supertest from "supertest";
import { makeToken } from "../create/create-task.usecase.e2e";

describe("update-task-usecase-e2e", () => {
  it("should return http status 200 when update task", async () => {
    const { token, user } = await makeToken();

    const task = await TaskBuilder.init().build(user.Id);

    const response = await supertest(app)
      .put(`/task/update/${task.Id}`)
      .set("Authorization", `${token}`)
      .send({
        title: "any_title_updated",
        description: "any_description_updated",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefa editada com sucesso!");
    expect(response.body.body).toStrictEqual({
      id: task.Id,
      title: "any_title_updated",
      description: "any_description_updated",
      finishedDate: task.FinishedDate,
      archived: task.Archived,
      done: task.Done,
      createdAt: expect.any(String),
      userId: user.Id,
    });
  });

  it("should return http status 400 when task not found", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .put(`/task/update/${randomUUID()}`)
      .set("Authorization", `${token}`)
      .send({
        title: "any_title_updated",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Tarefa não encontrada para este usuário."
    );
  });

  it("should return http status 400 when fields empty for update", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .put(`/task/update/${randomUUID()}`)
      .set("Authorization", `${token}`)
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "É necessário informar ao menos um campo para atualizar."
    );
  });

  it("should return http status 400 when done is invalid", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .put(`/task/update/${randomUUID()}`)
      .set("Authorization", `${token}`)
      .send({
        done: "invalid",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("O campo 'done' está inválido.");
  });

  it("should return http status 400 when archived is invalid", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .put(`/task/update/${randomUUID()}`)
      .set("Authorization", `${token}`)
      .send({
        archived: "invalid",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("O campo 'archived' está inválido.");
  });

  it("should return http status 400 when id is invalid", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .put(`/task/update/invalid-id`)
      .set("Authorization", `${token}`)
      .send({
        title: "any_title_updated",
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'invalid input syntax for type uuid: "invalid-id"'
    );
  });
});
