import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateTaskInput, Task } from "../types/task";

export class TaskRepository {
  constructor(private supabase: SupabaseClient) {}

  async getTaskStatusByName(statusName: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from("task_status")
      .select("task_status_id")
      .eq("task_status_name", statusName)
      .single();

    if (error || !data) {
      return null;
    }

    return data.task_status_id;
  }

  async getTaskTypeByName(typeName: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from("task_type")
      .select("task_type_id")
      .eq("task_type_name", typeName)
      .single();

    if (error || !data) {
      return null;
    }

    return data.task_type_id;
  }

  async create(taskData: CreateTaskInput): Promise<Task> {
    const data = {
      task_title: taskData.task_title,
      task_type_id: taskData.task_type_id,
      task_status_id: taskData.task_status_id,
      user_id: taskData.user_id,
      client_id: taskData.client_id || null,
      start_date: taskData.start_date || null,
      end_date: taskData.end_date || null,
      note: taskData.note || null,
      set_alarm: taskData.set_alarm || false,
      modified_date: new Date().toISOString(),
    };

    const { data: task, error } = await this.supabase
      .from("task")
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return task as Task;
  }
}
