import type { AIActionTools } from "./workflows/router/actions";
import { buildTools as buildRouterTools } from "./workflows/router/tools";

export function buildTools(): AIActionTools {
  return {
    ...buildRouterTools(),
  };
}
