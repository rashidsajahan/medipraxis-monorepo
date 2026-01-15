import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:8787/api";

interface ReportField {
  id: string;
  active: boolean;
  sequence: number;
  help_text: string;
  field_type: string;
  description: string;
  display_label: string;
}

interface PendingReportDetails {
  request_report_id: string;
  created_date: string;
  client_id: string;
  client_name: string;
  user_id: string | null;
  user_name: string | null;
  requested_reports: ReportField[];
  form_id: string | null;
}

interface UploadReportProps {
  contactId: string;
  requestReportId: string;
}

interface FileUpload {
  fieldId: string;
  file: File | null;
}

export function UploadReport({
  contactId,
  requestReportId,
}: UploadReportProps) {
  const [reportDetails, setReportDetails] =
    useState<PendingReportDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileUploads, setFileUploads] = useState<FileUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportDetails();
  }, [contactId, requestReportId]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/client-reports/pending/${contactId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch report details");
      }

      const data = await response.json();
      const report = data.pending_reports.find(
        (r: PendingReportDetails) => r.request_report_id === requestReportId
      );

      if (!report) {
        throw new Error("Report not found");
      }

      setReportDetails(report);

      // Initialize file upload state for each report field
      const initialUploads = report.requested_reports.map(
        (field: ReportField) => ({
          fieldId: field.id,
          file: null,
        })
      );
      setFileUploads(initialUploads);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load report details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setFileUploads((prev) =>
      prev.map((upload) =>
        upload.fieldId === fieldId ? { ...upload, file } : upload
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that all required files are selected
    const missingFiles = fileUploads.filter((upload) => !upload.file);
    if (missingFiles.length > 0) {
      setError("Please select files for all report fields");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("request_report_id", requestReportId);
      formData.append("client_id", reportDetails!.client_id);

      fileUploads.forEach((upload, index) => {
        if (upload.file) {
          formData.append(`files[${index}]`, upload.file);
          formData.append(`field_ids[${index}]`, upload.fieldId);
        }
      });

      const response = await fetch(`${API_BASE_URL}/client-reports`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload reports");
      }

      // Navigate back to dashboard after successful upload
      navigate({
        to: "/$contactId",
        params: { contactId },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload reports");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    navigate({
      to: "/$contactId",
      params: { contactId },
    });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#666", fontSize: "18px" }}>Loading...</p>
      </div>
    );
  }

  if (error && !reportDetails) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "40px 20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{ color: "#dc2626", fontSize: "18px", marginBottom: "16px" }}
          >
            {error}
          </p>
          <button
            onClick={handleCancel}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "600",
              marginBottom: "8px",
              color: "#333",
            }}
          >
            Upload Reports
          </h1>
          <p style={{ fontSize: "16px", color: "#666" }}>
            Requested by <strong>{reportDetails?.user_name}</strong> for{" "}
            <strong>{reportDetails?.client_name}</strong>
          </p>
          <p style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
            Requested on{" "}
            {reportDetails?.created_date &&
              new Date(reportDetails.created_date).toLocaleDateString()}
          </p>
        </div>

        {/* Upload Form */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "32px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {error && (
              <div
                style={{
                  padding: "12px 16px",
                  backgroundColor: "#fee2e2",
                  border: "1px solid #fecaca",
                  borderRadius: "6px",
                  marginBottom: "24px",
                }}
              >
                <p style={{ color: "#dc2626", fontSize: "14px", margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {reportDetails?.requested_reports
                .sort((a, b) => a.sequence - b.sequence)
                .map((field) => {
                  const upload = fileUploads.find(
                    (u) => u.fieldId === field.id
                  );
                  return (
                    <div key={field.id}>
                      <label
                        style={{
                          display: "block",
                          fontSize: "16px",
                          fontWeight: "500",
                          color: "#333",
                          marginBottom: "8px",
                        }}
                      >
                        {field.display_label}
                        <span style={{ color: "#dc2626" }}>*</span>
                      </label>
                      {field.description && (
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "8px",
                          }}
                        >
                          {field.description}
                        </p>
                      )}
                      {field.help_text && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#999",
                            marginBottom: "12px",
                          }}
                        >
                          {field.help_text}
                        </p>
                      )}
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          handleFileChange(
                            field.id,
                            e.target.files?.[0] ?? null
                          )
                        }
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "10px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          backgroundColor: "white",
                        }}
                        required
                      />
                      {upload?.file && (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#059669",
                            marginTop: "8px",
                          }}
                        >
                          Selected: {upload.file.name}
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "32px",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                disabled={uploading}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "white",
                  color: "#333",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: uploading ? "not-allowed" : "pointer",
                  opacity: uploading ? 0.5 : 1,
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                style={{
                  padding: "12px 24px",
                  backgroundColor: uploading ? "#93c5fd" : "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: uploading ? "not-allowed" : "pointer",
                }}
              >
                {uploading ? "Uploading..." : "Upload Reports"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
