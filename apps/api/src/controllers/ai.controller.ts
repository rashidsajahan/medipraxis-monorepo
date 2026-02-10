import { ControllerResponse, type AIQueryInput } from "@repo/models";
import { getAIService } from "../lib";
import type { APIContext } from "../types/api-context";

export class AIController {
  static async handleAIRequest(c: APIContext<{ json: AIQueryInput }>) {
    try {
      const aiService = getAIService(c);
      const body = c.req.valid("json") as AIQueryInput;

      const response = await aiService.query(body.query, body.history ?? []);

      return c.json(ControllerResponse.success(response));
    } catch (error) {
      console.error("AIController error:", error);
      return c.json(ControllerResponse.failure("AI request failed"), 500);
    }
  }
}
