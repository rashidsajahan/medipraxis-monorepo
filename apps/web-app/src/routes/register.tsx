import ClientRegistration from "@/pages/ClientRegistration";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: ClientRouteComponent,
});

function ClientRouteComponent() {
  return <ClientRegistration />;
}
