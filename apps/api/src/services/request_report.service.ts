import type { RequestReport } from "@repo/models";
import type { RequestReportRepository } from "../repositories";

export class RequestReportService {
  constructor(private requestReportRepository: RequestReportRepository) {}

  async getRequestReportById(
    requestReportId: string
  ): Promise<RequestReport | null> {
    return await this.requestReportRepository.findById(requestReportId);
  }
}
