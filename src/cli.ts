import process from "node:process";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { program } from "commander";

import packageJSON from "../package.json";

import { createServer, startSSEServer } from "./server";

/**
 * The version of the Agentica CLI
 * in production, it will be replaced by unbuild
 */

const VERSION = (process.env.SERVER_VERSION) ?? "0.0.0";

program
  .version(VERSION)
  .name(packageJSON.name)
  .option("--port <port>", "Port to listen on for SSE transport.")
  .action(async (options) => {
    if ("port" in options) {
      // eslint-disable-next-line ts/no-unsafe-member-access
      console.log(`This server is running on SSE (http://localhost:${options.port}/sse?sessionId=<sessionId>)`);
      await startSSEServer({
        // eslint-disable-next-line ts/no-unsafe-member-access
        port: +options.port,
        name: packageJSON.name,
        version: VERSION,
      });
    }
    else {
      console.log("This server is running on stdio");
      const server = await createServer({
        name: packageJSON.name,
        version: VERSION,
      });
      const transport = new StdioServerTransport();
      await server.connect(transport);
    }
  });

export function run() {
  program.parse(process.argv);
}

export { program };
