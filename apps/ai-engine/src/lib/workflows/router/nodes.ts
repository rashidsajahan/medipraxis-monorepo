import type { AIActionType, ChatMessage } from "@repo/models";
import type { ActionTool } from "./actions";
import { ai } from "../../models";

export const VALID_TASKS = [
  "greeting",
  "appointment",
  "client_management",
  "general",
  "unknown",
] as const;

export async function guardRailCheck(
  message: string
): Promise<{ isValid: boolean; violation?: string }> {
  const prompt = ai.prompt("router/guard-rail-check");
  const result = await prompt({ message });
  return result.output as { isValid: boolean; violation?: string };
}

export async function identifyTask(
  message: string,
  history: ChatMessage[] = []
): Promise<{ task: AIActionType }> {
  const prompt = ai.prompt("router/task-identification");
  const result = await prompt({
    message,
    history: history.length > 0 ? JSON.stringify(history.slice(-5)) : undefined,
  });
  const output = result.output as { task: string };
  const taskType = output.task.trim().toLowerCase().replace(/-/g, "_");

  return {
    task: VALID_TASKS.includes(taskType as AIActionType)
      ? (taskType as AIActionType)
      : "unknown",
  };
}

export async function generateResponse(
  message: string,
  task: AIActionType
): Promise<{ message: string }> {
  const promptNameMap: Record<string, string | null> = {
    greeting: "router/greeting-response",
    appointment: null,
    client_management: null,
    general: "router/general-response",
    unknown: "router/unknown-response",
  };

  const promptName = promptNameMap[task];
  if (!promptName) {
    return { message: "" };
  }

  const prompt = ai.prompt(promptName);
  const result = await prompt({ message });
  return result.output as { message: string };
}

export async function runActionChain(
  query: string,
  task: AIActionType,
  history: ChatMessage[],
  tool: ActionTool,
  userId: string
): Promise<{ message: string }> {
  console.log("[ACTION CHAIN] userId:", userId);
  const prompt = ai.prompt("router/action-chain");
  const result = await prompt({
    query,
    task,
    history: JSON.stringify(history),
    toolDescription: tool.description,
    toolParameters: JSON.stringify(tool.parameters),
  });

  const output = result.output as {
    message?: string;
    shouldExecute: boolean;
    extractedParams?: string;
  };

  if (output.shouldExecute && output.extractedParams) {
    const params = JSON.parse(output.extractedParams) as Record<
      string,
      unknown
    >;
    const executionResult = await tool.execute(params);
    return generateActionResponse(task, executionResult);
  }

  return { message: output.message ?? "Could you provide more details?" };
}

export async function generateActionResponse(
  task: AIActionType,
  executionResult: unknown
): Promise<{ message: string }> {
  const prompt = ai.prompt("router/action-response");
  const result = await prompt({
    task,
    result: JSON.stringify(executionResult),
  });
  return result.output as { message: string };
}
