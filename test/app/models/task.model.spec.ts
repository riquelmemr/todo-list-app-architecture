import Task from "@app/models/task.model";

describe("task-model", () => {
  it("should create an instance", () => {
    const createdAt = new Date();
    const finishedDate = new Date();

    const task = new Task(
      "any_id",
      "any_title",
      "any_description",
      "any_user_id",
      false,
      false,
      createdAt,
      finishedDate
    );

    expect(task).toEqual({
      id: task.Id,
      title: task.Title,
      description: task.Description,
      userId: task.UserId,
      archived: task.Archived,
      done: task.Done,
      createdAt: task.CreatedAt,
      finishedDate: task.FinishedDate,
    });
  });
});
