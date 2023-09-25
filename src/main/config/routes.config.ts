import { Express } from "express";
import { taskRoutes } from "../../app/features/tasks/tasks.routes";
import { userRoutes } from "../../app/features/users/users.routes";

function createAppRoutes(app: Express) {
  app.get("/", (req, res) => {
    res.json({
      message: "Application is running!",
      doc: "https://github.com/riquelmemr/architecture-app-todo-list"
    });
  })

  app.use("/user", userRoutes);
  app.use("/task", taskRoutes);
}

export { createAppRoutes };

