import { TaskBuilder } from "@test/app/shared/builders/entities/task.entity.builder";
import { app } from "@test/setup/app";
import supertest from "supertest";
import { makeToken } from "../create/create-task.usecase.e2e";

async function createTasks(userId: string, quantity: number) {
  for (let i = 0; i < quantity; i++) {
    await TaskBuilder.init().build(userId);
  }
}

describe("find-all-tasks-usecase-e2e", () => {
  it("should return http status 200 when find all tasks", async () => {
    const { token, user } = await makeToken();
    await createTasks(user.Id, 3);

    const response = await supertest(app)
      .get("/task")
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toHaveLength(3);
  });

  it("should return http status 200 when find all tasks in cache", async () => {
    const { token, user } = await makeToken();
    await createTasks(user.Id, 3);

    await supertest(app).get("/task").set("Authorization", `${token}`);

    const response = await supertest(app)
      .get("/task")
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toHaveLength(3);
  });

  it("should return http status 200 when find all tasks in cache with filter done", async () => {
    const { token, user } = await makeToken();

    await TaskBuilder.init().build(user.Id);
    await TaskBuilder.init().build(user.Id, { done: true });
    await TaskBuilder.init().build(user.Id, { done: true });

    await supertest(app).get("/task").set("Authorization", `${token}`);

    const response = await supertest(app)
      .get("/task")
      .query({ done: "true" })
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toHaveLength(2);
  });

  it("should return http status 200 when find all tasks in cache with filter archived", async () => {
    const { token, user } = await makeToken();

    await TaskBuilder.init().build(user.Id);
    await TaskBuilder.init().build(user.Id, { archived: true });
    await TaskBuilder.init().build(user.Id, { archived: true });

    await supertest(app).get("/task").set("Authorization", `${token}`);

    const response = await supertest(app)
      .get("/task")
      .query({
        archived: "true",
      })
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toHaveLength(2);
  });

  it("should return http status 200 when find all tasks in cache with filter title", async () => {
    const { token, user } = await makeToken();

    await TaskBuilder.init().build(user.Id);
    await TaskBuilder.init().build(user.Id, { title: "any_title_filtered" });

    await supertest(app).get("/task").set("Authorization", `${token}`);

    const response = await supertest(app)
      .get("/task")
      .query({
        title: "filtered",
      })
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Tarefas encontradas com sucesso!");
    expect(response.body.body).toHaveLength(1);
  });

  it("should return http status 200 when not found any tasks", async () => {
    const { token } = await makeToken();

    const response = await supertest(app)
      .get("/task")
      .set("Authorization", `${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("Nenhuma tarefa cadastrada ou encontrada.");
    expect(response.body.body).toHaveLength(0);
  });
});
