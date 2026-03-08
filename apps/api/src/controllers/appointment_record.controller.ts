import type { CreateAppointmentRecordInput } from "@repo/models";
import { getAppointmentRecordService } from "../lib";
import type { APIContext } from "../types/api-context";

export class AppointmentRecordController {
  static async create(c: APIContext<{ json: CreateAppointmentRecordInput }>) {
    try {
      const service = getAppointmentRecordService(c);
      const body = c.req.valid("json") as CreateAppointmentRecordInput;

      const record = await service.createRecord(body);

      return c.json({ success: true, record }, 201);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create appointment record";
      return c.json({ error: message }, 400);
    }
  }
}
