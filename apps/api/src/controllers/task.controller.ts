import { CreateTaskInput, UpdateTaskInput } from "@repo/models";
import { getTaskService } from "../lib";
import { APIContext } from "../types/api-context";

export class TaskController {
  static async getAllTasks(c: APIContext<null>) {
    try {
      const taskService = getTaskService(c);
      const userId = c.req.query("user_id");

      const tasks = await taskService.getAllTasks(userId);

      return c.json({ tasks, count: tasks.length });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get tasks";
      return c.json({ error: message }, 500);
    }
  }

  static async getTaskById(c: APIContext<null, "/:id">) {
    try {
      const taskService = getTaskService(c);
      const taskId = c.req.param("id");

      const task = await taskService.getTaskById(taskId);

      return c.json({ task });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get task";
      const status =
        error instanceof Error && error.message === "Task not found"
          ? 404
          : 500;
      return c.json({ error: message }, status);
    }
  }

  static async createTask(c: APIContext<CreateTaskInput>) {
    try {
      const taskService = getTaskService(c);
      const body: CreateTaskInput = c.req.valid("json");

      const task = await taskService.createTask(body);

      return c.json({ success: true, task }, 201);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create task";
      return c.json({ error: message }, 400);
    }
  }

  static async updateTask(c: APIContext<UpdateTaskInput, "/:id">) {
    try {
      const taskService = getTaskService(c);
      const taskId = c.req.param("id");
      const body: UpdateTaskInput = await c.req.json();

      const task = await taskService.updateTask(taskId, body);

      return c.json({ success: true, task });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update task";
      const status =
        error instanceof Error &&
        error.message === "Task not found or could not be updated"
          ? 404
          : 400;
      return c.json({ error: message }, status);
    }
  }
}
