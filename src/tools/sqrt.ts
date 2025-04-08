import { z } from "zod";

import type { Tool } from "./types";

export const sqrt: Tool = {
  schema: {
    name: "sqrt",
    description: "Square root of a number",
    inputSchema: z.object({ a: z.number() }),
  },
  handle: async (params) => {
    const a = params.a as number;
    const result = Math.sqrt(a);
    return { content: [{ type: "text", text: `The square root of ${a} is ${result}` }] };
  },
};
