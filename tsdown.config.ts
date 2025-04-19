import { defineConfig } from "tsdown";

import pkgJson from "./package.json";

const config: ReturnType<typeof defineConfig> = defineConfig({
  outDir: "dist",
  entry: [
    "src/index.ts",
    "src/cli.ts",
  ],
  fixedExtension: true,
  format: ["esm", "cjs"],
  target: "es2022", // support for Node.js 18
  sourcemap: true,
  dts: true,
  define: {
    "process.env.SERVER_VERSION": JSON.stringify(pkgJson.version), // replace version from package.json on build
  },
  outputOptions: {
    banner: (chunk) => {
      if (chunk.name === "cli") {
        return "#!/usr/bin/env node\n";
      }
      return "";
    },
  },
  clean: true,
  publint: true,
  unused: { level: "error" },
});

export default config;
