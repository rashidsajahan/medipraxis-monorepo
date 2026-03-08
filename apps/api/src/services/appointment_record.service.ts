import type {
  AppointmentRecord,
  CreateAppointmentRecordInput,
} from "@repo/models";
import type { AppointmentRecordRepository } from "../repositories";

export class AppointmentRecordService {
  private appointmentRecordRepository: AppointmentRecordRepository;

  constructor(appointmentRecordRepository: AppointmentRecordRepository) {
    this.appointmentRecordRepository = appointmentRecordRepository;
  }

  async createRecord(
    input: CreateAppointmentRecordInput
  ): Promise<AppointmentRecord> {
    return await this.appointmentRecordRepository.create(input);
  }
}
