import type { ToolAction } from "genkit";
import { appointmentTools } from "./tools";

interface ToolInfo {
  name: string;
  description: string;
}

/**
 * Resolves which tools are available for a given intent.
 * Tools are defined at module level and read userId from AsyncLocalStorage context.
 */
export function resolveTools(
  intent: "get" | "check" | "all"
): { tools: ToolAction[]; available: ToolInfo[] } {
  const intentMap: Record<string, string[]> = {
    get: ["getAllAppointments"],
    check: ["checkDateTime"],
    all: appointmentTools.map((t) => t.__action.name),
  };

  const names = intentMap[intent] ?? [];

  const matched = appointmentTools.filter((t) =>
    names.includes(t.__action.name)
  );

  return {
    tools: matched,
    available: matched.map((t) => ({
      name: t.__action.name,
      description: t.__action.description ?? "",
    })),
  };
}
