import { zValidator } from "@hono/zod-validator";
import {
  createTaskSchema,
  taskDetailsSchema,
  updateTaskSchema,
} from "@repo/models";
import { Hono } from "hono";
import { TaskController } from "../controllers";

const tasks = new Hono()
  .get("/", TaskController.getAllTasks)
  .get(
    "/:id",
    zValidator("json", taskDetailsSchema),
    TaskController.getTaskById
  )
  .post("/", zValidator("json", createTaskSchema), TaskController.createTask)
  .put("/:id", zValidator("json", updateTaskSchema), TaskController.updateTask);

export default tasks;
