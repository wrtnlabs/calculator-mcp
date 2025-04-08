import { isCI } from "std-env";
import { defineBuildConfig } from "unbuild";

import pkgJson from "./package.json";

export default defineBuildConfig({
  outDir: "dist",
  entries: ["src/index.ts"],
  declaration: false,
  clean: true,
  replace: {
    "process.env.SERVER_VERSION": JSON.stringify(pkgJson.version), // replace version from package.json on build
  },
  rollup: {
    inlineDependencies: [
      "commander",

      "@modelcontextprotocol/sdk",
      "raw-body",
      "zod",
      "content-type",
      "bytes",
      "http-errors",
      "iconv-lite",
      "unpipe",
      "safer-buffer",
      "depd",
      "setprototypeof",
      "statuses",
      "inherits",
      "toidentifier",
    ],
    esbuild: {
      minify: isCI, // minify only in CI and publish
      target: "es2022", // support for Node.js 18
    },
  },
  sourcemap: !isCI, // sourcemap only in CI and publish
});
