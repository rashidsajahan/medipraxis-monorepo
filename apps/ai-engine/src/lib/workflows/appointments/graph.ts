import type { ChatMessage } from "@repo/models";
import { ai } from "../../models";
import { requestContext } from "../../context";
import { resolveTools } from "./nodes";

export async function runAppointmentWorkflow(
  query: string,
  history: ChatMessage[],
  userId: string
): Promise<{ message: string }> {
  return requestContext.run({ userId }, async () => {
    // Node 1: resolve all available tools for this workflow
    const { tools, available } = resolveTools("all");

    console.log(
      "[APPOINTMENTS] Available tools:",
      available.map((t) => t.name)
    );

    // Node 2: use dotprompt with tools to let the model handle the query
    const prompt = ai.prompt("appointments/appointment-agent");
    const response = await prompt(
      {
        query,
        history:
          history.length > 0 ? JSON.stringify(history.slice(-5)) : undefined,
      },
      { tools }
    );

    const text = response.text;

    return {
      message:
        text ||
        "I couldn't process your appointment request. Could you provide more details?",
    };
  });
}
