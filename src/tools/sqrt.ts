import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import type { Tool } from "./types";

export const sqrt: Tool = {
  schema: {
    name: "sqrt",
    description: "Square root of a number",
    inputSchema: zodToJsonSchema(z.object({ a: z.number() })),
  },
  handle: async (params) => {
    const a = params.a as number;
    const result = Math.sqrt(a);
    return { content: [{ type: "text", text: `The square root of ${a} is ${result}` }] };
  },
};
