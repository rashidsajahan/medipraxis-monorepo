import type { AIActionTools } from "./actions";

export function buildTools(): AIActionTools {
  return {
    client_management: {
      name: "manage_client",
      description: "Look up or manage client/patient records",
      parameters: {
        searchTerm: {
          type: "string",
          description: "Patient name or identifier to search",
        },
        userId: {
          type: "string",
          description: "ID of the practitioner to filter clients",
        },
      },
      execute: async (params: Record<string, unknown>) => {
        console.log("[ACTION] manage_client called with:", params);
        return {
          success: true,
          message: "Client management action logged (stub)",
        };
      },
    },
  };
}
