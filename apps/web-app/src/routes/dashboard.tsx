import { createFileRoute } from "@tanstack/react-router";
import { ContactDashboard } from "../pages/ContactDashboard";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const contactId = sessionStorage.getItem("contact_id") || "";
  return <ContactDashboard contactId={contactId} />;
}
