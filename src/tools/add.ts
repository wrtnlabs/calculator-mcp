import { z } from "zod";

import type { Tool } from "./types";

export const add: Tool = {
  schema: {
    name: "add",
    description: "Add two numbers",
    inputSchema: z.object({ a: z.number(), b: z.number() }),
  },
  handle: async (params) => {
    const a = params.a as number;
    const b = params.b as number;
    const result = a + b;
    return { content: [{ type: "text", text: `The sum of ${a} and ${b} is ${result}` }] };
  },
};
