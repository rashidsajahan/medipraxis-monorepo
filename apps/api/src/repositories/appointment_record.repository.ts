import type {
  AppointmentRecord,
  CreateAppointmentRecordInput,
} from "@repo/models";
import type { SupabaseClient } from "@supabase/supabase-js";

export class AppointmentRecordRepository {
  private db: SupabaseClient;

  constructor(db: SupabaseClient) {
    this.db = db;
  }

  async create(
    input: CreateAppointmentRecordInput
  ): Promise<AppointmentRecord> {
    const { data, error } = await this.db
      .from("appointment_record")
      .insert({
        user_id: input.user_id,
        client_id: input.client_id,
        appointment_id: input.appointment_id,
        form_id: input.form_id,
        appointment_data: input.appointment_data || null,
        note: input.note || null,
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Failed to create appointment record");
    }

    return data as AppointmentRecord;
  }
}
