import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase";
import { TaskRepository } from "../repositories/task.repository";
import { TaskService } from "../services/task.service";
import type { Env } from "../types/env.type";
import type { CreateTaskInput } from "../types/task";

const tasks = new Hono<{ Bindings: Env }>();

tasks.post("/", async (c) => {
  try {
    const supabase = createSupabaseClient(c.env);
    const taskRepository = new TaskRepository(supabase);
    const taskService = new TaskService(taskRepository);
    const body: CreateTaskInput = await c.req.json();

    const task = await taskService.createTask(body);

    return c.json({ success: true, task }, 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create task";
    return c.json({ error: message }, 400);
  }
});

export default tasks;
