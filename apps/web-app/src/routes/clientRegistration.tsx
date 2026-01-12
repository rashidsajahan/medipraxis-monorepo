import ClientRegistrationForm from "@/pages/ClientRegistrationForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/clientRegistration")({
  component: ClientRouteComponent,
});

function ClientRouteComponent() {
  return <ClientRegistrationForm onClose={() => {}} />;
}
