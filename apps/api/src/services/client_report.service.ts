import type {
  ClientReport,
  CreateClientReportInput,
  PendingReport,
} from "@repo/models";
import { ClientReportRepository } from "../repositories";
import type { ClientRepository } from "../repositories/client.repository";
import type { RequestReportRepository } from "../repositories/request_report.repository";

export class ClientReportService {
  private clientReportRepository: ClientReportRepository;
  private clientRepository: ClientRepository;
  private requestReportRepository: RequestReportRepository;

  constructor(
    clientReportRepository: ClientReportRepository,
    clientRepository: ClientRepository,
    requestReportRepository: RequestReportRepository
  ) {
    this.clientReportRepository = clientReportRepository;
    this.clientRepository = clientRepository;
    this.requestReportRepository = requestReportRepository;
  }

  async createReport(
    input: CreateClientReportInput,
    file: File
  ): Promise<ClientReport> {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "Invalid file type. Only PDF and image files (JPEG, PNG, JPG) are allowed"
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit");
    }

    // Upload file to storage
    const filePath = await this.clientReportRepository.uploadFile(
      file,
      input.user_id,
      input.client_id
    );

    // Create database record
    const report = await this.clientReportRepository.create(input, filePath);

    return report;
  }

  async getAllReports(
    userId?: string,
    clientId?: string
  ): Promise<ClientReport[]> {
    return await this.clientReportRepository.findAll(userId, clientId);
  }

  async getReportById(reportId: string): Promise<ClientReport> {
    const report = await this.clientReportRepository.findById(reportId);

    if (!report) {
      throw new Error("Report not found");
    }

    return report;
  }

  async getReportFileUrl(reportId: string): Promise<string> {
    const report = await this.clientReportRepository.findById(reportId);

    if (!report) {
      throw new Error("Report not found");
    }

    if (!report.file_path) {
      throw new Error("Report has no associated file");
    }

    return await this.clientReportRepository.getFileUrl(report.file_path);
  }

  async deleteReport(reportId: string): Promise<boolean> {
    const deleted = await this.clientReportRepository.delete(reportId);

    if (!deleted) {
      throw new Error("Report not found or could not be deleted");
    }

    return deleted;
  }

  async getPendingReportsByContactId(
    contactId: string
  ): Promise<PendingReport[]> {
    // Get all clients with contact_id
    const clients = await this.clientRepository.findByContactId(contactId);

    if (!clients || clients.length === 0) {
      return [];
    }

    const clientIds = clients.map((client) => client.client_id);

    // Get all request_reports for these clients (not expired, not deleted)
    const requestReports =
      await this.requestReportRepository.findPendingByClientIds(clientIds);

    if (requestReports.length === 0) {
      return [];
    }

    const requestReportIds = requestReports.map((rr) => rr.request_report_id);

    // Check which request_reports already have uploaded reports
    const uploadedRequestReportIds =
      await this.clientReportRepository.findByRequestReportIds(
        requestReportIds
      );

    // Filter to only pending (not uploaded) reports
    const pendingReports: PendingReport[] = requestReports
      .filter((rr) => !uploadedRequestReportIds.has(rr.request_report_id))
      .map((rr) => {
        const client = clients.find((c) => c.client_id === rr.client_id);
        return {
          request_report_id: rr.request_report_id,
          created_date: rr.created_date,
          client_id: rr.client_id!,
          client_name: client
            ? `${client.first_name} ${client.last_name}`
            : "Unknown",
          requested_reports: rr.requested_reports,
          form_id: rr.form_id,
        };
      });

    return pendingReports;
  }
}
