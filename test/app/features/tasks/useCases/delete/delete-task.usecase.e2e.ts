import { TaskBuilder } from "@test/app/shared/builders/entities/task.entity.builder";
import { app } from "@test/setup/app";
import { randomUUID } from "crypto";
import supertest from "supertest";
import { makeToken } from "../create/create-task.usecase.e2e";

describe("delete-task-usecase-e2e", () => {
  it("should return http status 200 when delete a task", async () => {
    const { token, user } = await makeToken();

    const task = await TaskBuilder.init().build(user.Id);

    const response = await supertest(app)
      .delete(`/task/delete/${task.Id}`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual({
      success: true,
      status: "Tarefa deletada com sucesso!",
      body: {
        id: task.Id,
        title: task.Title,
        description: task.Description,
        finishedDate: task.FinishedDate,
        archived: task.Archived,
        done: task.Done,
        createdAt: expect.any(String),
        userId: task.UserId,
      },
    });
  });

  it("should return http status 404 when task not found", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .delete(`/task/delete/${randomUUID()}`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      "Tarefa não encontrada para este usuário."
    );
  });

  it("should return http status 400 when id is invalid", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .delete(`/task/delete/invalid-id`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'invalid input syntax for type uuid: "invalid-id"'
    );
  });
});
