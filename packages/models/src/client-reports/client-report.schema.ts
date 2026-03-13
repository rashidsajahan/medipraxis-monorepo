import { z } from "zod";

/* ---------------- RESPONSE SCHEMAS ---------------- */

export const clientReportSchema = z.object({
  report_id: z.string(),
  report_title: z.string().nullable(),
  file_path: z.string().nullable(),
  file_type: z.string().nullable(),
  client_id: z.string().nullable(),
  user_id: z.string().nullable(),
  request_report_id: z.string().nullable(),
  expiry_date: z.string().nullable(),
  created_date: z.string(),
});

/* ---------------- REQUEST SCHEMAS ---------------- */

export const createClientReportSchema = z
  .object({
    client_id: z.string().uuid("Invalid client ID"),
    user_id: z.string().uuid("Invalid user ID"),
    request_report_id: z.string().uuid("Invalid request report ID"),
    expiry_date: z.string().optional(),
    reports: z
      .array(
        z.object({
          report_title: z.string().min(1, "Report title is required"),
        })
      )
      .min(1, "At least one report is required"),
  })
  .strict();

/* ---------------- TYPE EXPORTS ---------------- */

export type ClientReport = z.infer<typeof clientReportSchema>;
export type CreateClientReportInput = z.infer<typeof createClientReportSchema>;

export interface GroupedClientReport {
  client_id: string;
  client_first_name: string;
  client_last_name: string;
  report_date: string;
  reports: Array<{
    report_id: string;
    report_title: string | null;
    file_path: string | null;
    file_type: string | null;
  }>;
}

export interface ReportFileUrlResponse {
  fileUrl: string;
  reportTitle: string | null;
  clientName: string;
  uploadedOn: string;
  expiresIn: string | null;
  fileType: string | null;
}
