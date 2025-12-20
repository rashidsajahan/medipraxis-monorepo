import { TaskRepository } from "../repositories/task.repository";
import type { CreateTaskInput, Task } from "../types/task";
import { TaskStatus } from "../types/task-status.enum";
import { TaskType } from "../types/task-type.enum";

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  async createTask(input: CreateTaskInput): Promise<Task> {
    if (!input.task_title || !input.user_id || !input.end_date) {
      throw new Error("Missing required fields: task_title, user_id, end_date");
    }

    if (!input.start_date) {
      input.start_date = new Date().toISOString();
    }

    if (!input.task_type_id) {
      const reminderTypeId = await this.taskRepository.getTaskTypeByName(
        TaskType.REMINDER
      );

      if (!reminderTypeId) {
        throw new Error('Default task type "REMINDER" not found in database');
      }

      input.task_type_id = reminderTypeId;
    }

    if (!input.task_status_id) {
      const notStartedStatusId = await this.taskRepository.getTaskStatusByName(
        TaskStatus.NOT_STARTED
      );

      if (!notStartedStatusId) {
        throw new Error(
          'Default task status "NOT_STARTED" not found in database'
        );
      }

      input.task_status_id = notStartedStatusId;
    }

    return await this.taskRepository.create(input);
  }
}
