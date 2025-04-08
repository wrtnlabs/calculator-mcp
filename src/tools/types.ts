import type { TextContent } from "@modelcontextprotocol/sdk/types.js";
import type { JsonSchema7Type } from "zod-to-json-schema";

export interface ToolSchema {
  name: string;
  description: string;
  inputSchema: JsonSchema7Type;
}

export interface ToolResult {
  content: TextContent[];
  isError?: boolean;
}

export interface Tool {
  schema: ToolSchema;
  handle: (params: Record<string, unknown>) => Promise<ToolResult>;
}
