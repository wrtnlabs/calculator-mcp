import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import type { Tool } from "./types";

export const sub: Tool = {
  schema: {
    name: "sub",
    description: "Subtract two numbers",
    inputSchema: zodToJsonSchema(z.object({ a: z.number(), b: z.number() })),
  },
  handle: async (params) => {
    const a = params.a as number;
    const b = params.b as number;
    const result = a - b;
    return { content: [{ type: "text", text: `The difference of ${a} and ${b} is ${result}` }] };
  },
};
