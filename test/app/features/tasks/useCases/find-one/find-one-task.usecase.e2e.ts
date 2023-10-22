import { makeToken } from "@test/app/features/tasks/useCases/create/create-task.usecase.e2e";
import { TaskBuilder } from "@test/app/shared/builders/entities/task.entity.builder";
import { app } from "@test/setup/app";
import { randomUUID } from "crypto";
import supertest from "supertest";

describe("find-one-task-usecase-e2e", () => {
  it("should return http status 200 when find a task", async () => {
    const { token, user } = await makeToken();

    const task = await TaskBuilder.init().build(user.Id);

    const response = await supertest(app)
      .get(`/task/${task.Id}`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.body).toStrictEqual({
      id: task.Id,
      title: task.Title,
      description: task.Description,
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
      .get(`/task/${randomUUID()}`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Tarefa não encontrada!");
  });

  it("should return http status 400 when id is invalid", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .get(`/task/invalid-id`)
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'invalid input syntax for type uuid: "invalid-id"'
    )
  });
});
