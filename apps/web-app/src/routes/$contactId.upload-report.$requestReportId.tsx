import { createFileRoute } from "@tanstack/react-router";
import { UploadReport } from "../pages/UploadReport";

export const Route = createFileRoute(
  "/$contactId/upload-report/$requestReportId"
)({
  component: () => {
    const { contactId, requestReportId } = Route.useParams();
    return (
      <UploadReport contactId={contactId} requestReportId={requestReportId} />
    );
  },
});
