import type { ChatMessage } from "@repo/models";
import { requestContext } from "../../context";
import { ai } from "../../models";
import { runAgent } from "./nodes";

async function _processAppointments(
  query: string,
  history: ChatMessage[],
  userId: string
): Promise<{ message: string }> {
  return requestContext.run({ userId }, () => runAgent(query, history));
}

export const processAppointments = ai.defineFlow(
  { name: "processAppointmentsFlow" },
  ({
    query,
    history = [],
    userId,
  }: {
    query: string;
    history?: ChatMessage[];
    userId: string;
  }) => _processAppointments(query, history, userId)
);
