import { processAIQuery } from "@repo/ai-lib";
import type { RouterResponse } from "@repo/models";

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async processQuery(query: string): Promise<RouterResponse> {
    if (!this.apiKey) {
      throw new Error("AI service is not available");
    }

    const response = await processAIQuery(query, this.apiKey);

    // Handle workflow actions
    if (response.shouldCallWorkflow) {
      switch (response.task) {
        case "appointment":
          // TODO: Implement appointment creation workflow
          return {
            ...response,
            message: "Creating appointment...",
          };
        case "client_management":
          // TODO: Implement client management workflow
          return {
            ...response,
            message: "Retrieving client information...",
          };
      }
    }

    // Ensure message is never undefined
    return {
      ...response,
      message: response.message || "I'm here to help! How can I assist you?",
    };
  }
}
