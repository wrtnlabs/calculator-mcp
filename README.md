## Calculate MCP

A Model Context Protocol (MCP) server that provides browser automation capabilities using basic calculator feature.
This server enables LLMs to interact with calculator.
(I actually made it for a test program)

### Use Cases

- The test code for to connect MCP feature.
- The toy projects

### Example config

<!-- eslint-skip -->

```js
{
  "mcpServers": {
    "calculate": {
      "command": "npx",
      "args": [
        "-y",
        "@wrtnlabs/calculator-mcp@latest"
      ]
    }
  }
}
```

#### Installation in VS Code

Alternatively, you can install the Playwright MCP server using the VS Code CLI:

```bash
# For VS Code
code --add-mcp '{"name":"calculator","command":"npx","args":["-y", "@wrtnlabs/calculator-mcp@latest"]}'
```

```bash
# For VS Code Insiders
code-insiders --add-mcp '{"name":"calculator","command":"npx","args":["-y", "@wrtnlabs/calculator-mcp@latest"]}'
```

After installation, the Calculator MCP server will be available for use with your GitHub Copilot agent in VS Code.

### CLI Options

The Calculator MCP server supports the following command-line options:

- `--port <port>`: Port to listen on for SSE transport

### Running headed browser on Linux w/o DISPLAY

When running headed browser on system w/o display or from worker processes of the IDEs,
run the MCP server from environment with the DISPLAY and pass the `--port` flag to enable SSE transport.

```bash
npx @wrtnlabs/calculator-mcp@latest --port 8931
```

And then in MCP client config, set the `url` to the SSE endpoint:

<!-- eslint-skip -->

```js
{
  "mcpServers": {
    "calculator": {
      "url": "http://localhost:8931/sse"
    }
  }
}
```

### Programmatic usage with custom transports

```js
import { createServer } from "@wrtnlabs/calculator-mcp";
// ... other import statement

const client = new Client({
  name: "test client",
  version: "0.1.0",
});

const server = createServer({
  name: "calculator",
  version: "1.0.0"
});

const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

await Promise.all([
  client.connect(clientTransport),
  server.connect(serverTransport),
]);
```

### Tools

- **add**
- **sub**
- **mul**
- **div**
- **mod**
- **sqrt**
