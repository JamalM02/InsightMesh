#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Determine service name from directory (e.g., grpc-account → account)
function getServiceName() {
  const dirName = path.basename(process.cwd());
  if (!dirName.startsWith("grpc-")) {
    console.error('Directory must start with "grpc-"');
    process.exit(1);
  }
  return dirName.replace("grpc-", "");
}

// Create /client and /client/src directories
function createClientDirs() {
  const clientDir = path.join(process.cwd(), "client");
  const srcDir = path.join(clientDir, "src");
  if (!fs.existsSync(clientDir)) fs.mkdirSync(clientDir);
  if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);
  return { clientDir, srcDir };
}

// Increment patch version if previous version exists
function getNextVersion(clientPackagePath) {
  if (fs.existsSync(clientPackagePath)) {
    try {
      const current = JSON.parse(fs.readFileSync(clientPackagePath, "utf8"));
      const parts = current.version.split(".");
      parts[2] = String(Number(parts[2]) + 1);
      return parts.join(".");
    } catch {
      return "1.0.0";
    }
  }
  return "1.0.0";
}

function generatePackageJson(serviceName, version) {
  return JSON.stringify({
    name: `@insightmesh/grpc-${serviceName}`,
    version,
    description: `gRPC client for ${serviceName}`,
    main: "dist/index.js",
    types: "dist/index.d.ts",
    files: ["dist"],
    scripts: {
      build: "tsc"
    },
    dependencies: {
      "nice-grpc": "^2.1.0",
      "nice-grpc-common": "^2.0.2",
      "protobufjs": "^7.2.3",
      "dotenv": "^16.4.7",
      "long": "^5.2.3"
    },
    devDependencies: {
      "@types/node": "^20.10.0",
      "typescript": "^5.2.2"
    }
  }, null, 2);
}

function generateTsConfig() {
  return JSON.stringify({
    compilerOptions: {
      target: "es2020",
      module: "commonjs",
      declaration: true,
      outDir: "./dist",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: ["src/**/*"],
    exclude: ["node_modules", "dist"]
  }, null, 2);
}

function generateReadme(serviceName) {
  return `# @insightmesh/grpc-${serviceName}

Generated gRPC client for the \`${serviceName}\` service.

## Usage

\`\`\`ts
import { ${serviceName}RpcClient } from '@insightmesh/grpc-${serviceName}';

const response = await ${serviceName}RpcClient.someMethod({ ... });
\`\`\`
`;
}

function generateClientIndex(serviceName) {
  const Upper = serviceName[0].toUpperCase() + serviceName.slice(1);
  const envVar = `GRPC_${serviceName.toUpperCase()}_URL`;

  return `import dotenv from 'dotenv';
import { createChannel, createClient as createNiceGrpcClient } from 'nice-grpc';
import {
  ${Upper}ServiceClient,
  ${Upper}ServiceDefinition
} from './service';

dotenv.config();

export * from './service';

export function createClient(url?: string): ${Upper}ServiceClient {
  const serviceUrl = url || process.env.${envVar};
  if (!serviceUrl) throw new Error('${envVar} is not set and no URL was provided');
  const channel = createChannel(serviceUrl);
  return createNiceGrpcClient(${Upper}ServiceDefinition, channel);
}

export const ${serviceName}RpcClient = createClient();
`;
}

function main() {
  try {
    // Generate proto output
    console.log("Running proto:generate...");
    execSync("npm run proto:generate", { stdio: "inherit" });

    const serviceName = getServiceName();
    console.log(`Generating client for service: "${serviceName}"`);

    const { clientDir, srcDir } = createClientDirs();

    // Validate service.ts output
    const serviceSource = path.join(process.cwd(), "src", "grpc", "service.ts");
    const serviceTarget = path.join(srcDir, "service.ts");
    if (!fs.existsSync(serviceSource)) {
      console.error("Missing 'src/grpc/service.ts'. Did you run proto:generate?");
      process.exit(1);
    }

    fs.copyFileSync(serviceSource, serviceTarget);
    const structSource = path.join(process.cwd(), "src", "grpc", "google", "protobuf", "struct.ts");
    if (fs.existsSync(structSource)) {
      const structTargetDir = path.join(srcDir, "google", "protobuf");
      fs.mkdirSync(structTargetDir, { recursive: true });
      fs.copyFileSync(structSource, path.join(structTargetDir, "struct.ts"));
    }
    fs.writeFileSync(path.join(srcDir, "index.ts"), generateClientIndex(serviceName));

    const version = getNextVersion(path.join(clientDir, "package.json"));
    fs.writeFileSync(path.join(clientDir, "package.json"), generatePackageJson(serviceName, version));
    fs.writeFileSync(path.join(clientDir, "tsconfig.base.json"), generateTsConfig());
    fs.writeFileSync(path.join(clientDir, "README.md"), generateReadme(serviceName));

    console.log(`Client for "${serviceName}" generated at ${clientDir}`);
  } catch (e) {
    console.error("Error generating client:", e.message);
    process.exit(1);
  }
}

main();
