import http from "node:http";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

import { add, div, mod, mul, sqrt, sub } from "./tools";

const tools = [add, div, mod, mul, sqrt, sub];
export async function createServer(options: { name: string; version: string }) {
  const server = new Server({
    name: options.name,
    version: options.version,
  }, {
    capabilities: { tools: {} },
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: tools.map(tool => tool.schema) };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = tools.find(tool => tool.schema.name === request.params.name);
    if (tool == null) {
      return {
        content: [{ type: "text", text: `Tool "${request.params.name}" not found` }],
        isError: true,
      };
    }

    try {
      const result = await tool.handle(request.params.arguments ?? {});
      return result;
    }
    catch (error) {
      return {
        content: [{ type: "text", text: String(error) }],
        isError: true,
      };
    }
  });

  const oldClose = server.close.bind(server);

  server.close = async () => {
    await oldClose();
  };

  return server;
}

export async function startSSEServer(options: { port: number; name: string; version: string }) {
  const sessions = new Map<string, SSEServerTransport>();
  // eslint-disable-next-line ts/no-misused-promises
  const httpServer = http.createServer(async (req, res) => {
    switch (req.method) {
      case "GET": {
        const searchParams = new URL(`http://localhost${req.url}`).searchParams;
        const sessionId = searchParams.get("sessionId");
        if (sessionId === null) {
          res.statusCode = 400;
          res.end("Missing sessionId");
          return;
        }
        const transport = sessions.get(sessionId);
        if (transport == null) {
          res.statusCode = 404;
          res.end("Session not found");
          return;
        }

        await transport.handlePostMessage(req, res);
        return;
      }
      case "POST": {
        const transport = new SSEServerTransport("/sse", res);
        sessions.set(transport.sessionId, transport);
        const server = await createServer(options);
        res.on("close", () => {
          sessions.delete(transport.sessionId);
          server.close().catch(e => console.error(e));
        });
        await server.connect(transport);
        return;
      }

      case undefined:
      default: {
        res.statusCode = 405;
        res.end("Method not allowed");
      }
    }
  });

  httpServer.listen(options.port, () => {
    const address = httpServer.address();
    if (address === null) {
      throw new Error("Could not bind server socket");
    }

    const url = (() => {
      if (typeof address === "string") {
        return address;
      }

      const resolvedPort = address.port;
      const resolvedHost = (() => {
        const host = address.family === "IPv4" ? address.address : `[${address.address}]`;
        if (host === "0.0.0.0" || host === "[::]") {
          return "localhost";
        }
        return host;
      })();

      return `http://${resolvedHost}:${resolvedPort}`;
    })();

    console.log(`Listening on ${url}`);
    console.log("Put this in your client config:");
    console.log(JSON.stringify({
      mcpServers: {
        calculator: {
          url: `${url}/sse`,
        },
      },
    }, undefined, 2));
  });
}
