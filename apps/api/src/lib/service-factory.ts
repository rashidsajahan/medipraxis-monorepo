import type { Context } from "hono";
import { TaskRepository } from "../repositories";
import { TaskService } from "../services";
import type { Env } from "../types";
import { createDatabaseClient } from "./database";

export function getTaskService(c: Context<{ Bindings: Env }>) {
  const db = createDatabaseClient(c.env);
  const taskRepository = new TaskRepository(db);
  return new TaskService(taskRepository);
}
