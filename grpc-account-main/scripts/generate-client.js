#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const isWindows = os.platform() === 'win32';

// Get the service name from the directory name (e.g., grpc-account -> account)
function getServiceName() {
  const dirName = path.basename(process.cwd());
  if (!dirName.startsWith('grpc-')) {
    console.error('Error: Current directory must start with "grpc-"');
    process.exit(1);
  }
  return dirName.replace('grpc-', '');
}

// Create client directory if it doesn't exist
function createClientDir() {
  const clientDir = path.join(process.cwd(), 'client');
  if (!fs.existsSync(clientDir)) {
    fs.mkdirSync(clientDir);
  }
  return clientDir;
}

// Get the next version number from GitHub Packages or local file
function getNextVersion(serviceName) {
  // Default version if no previous version exists
  let version = '1.0.0';
  
  try {
    // Try to get the latest version from npm registry
    console.log(`Checking for latest version of @events-project/grpc-${serviceName}...`);
    const npmViewCommand = `npm view @events-project/grpc-${serviceName} version --registry=https://npm.pkg.github.com`;
    
    try {
      // Create a temporary .npmrc file for authentication if GITHUB_TOKEN is available
      if (process.env.GITHUB_TOKEN) {
        const tempNpmrc = path.join(process.cwd(), '.temp-npmrc');
        fs.writeFileSync(tempNpmrc, `//npm.pkg.github.com/:_authToken=${process.env.GITHUB_TOKEN}\n@events-project:registry=https://npm.pkg.github.com`);
        
        try {
          const latestVersion = execSync(`npm view @events-project/grpc-${serviceName} version --registry=https://npm.pkg.github.com --userconfig=${tempNpmrc}`, { stdio: 'pipe' }).toString().trim();
          if (latestVersion) {
            // Parse the version and increment the patch version
            const versionParts = latestVersion.split('.');
            const newPatch = parseInt(versionParts[2], 10) + 1;
            version = `${versionParts[0]}.${versionParts[1]}.${newPatch}`;
            console.log(`Found latest version ${latestVersion} on GitHub, incrementing to ${version}`);
          }
        } catch (e) {
          console.log(`Package not found on GitHub, using default version ${version}`);
        } finally {
          // Clean up temporary npmrc
          if (fs.existsSync(tempNpmrc)) {
            fs.unlinkSync(tempNpmrc);
          }
        }
      } else {
        console.log('GITHUB_TOKEN not set, cannot check GitHub Packages for latest version');
        console.log('Falling back to local version check');
        
        // Fall back to checking local package.json
        const clientPackageJsonPath = path.join(process.cwd(), 'client', 'package.json');
        if (fs.existsSync(clientPackageJsonPath)) {
          try {
            const packageJson = JSON.parse(fs.readFileSync(clientPackageJsonPath, 'utf8'));
            if (packageJson.version) {
              // Parse the version and increment the patch version
              const versionParts = packageJson.version.split('.');
              const newPatch = parseInt(versionParts[2], 10) + 1;
              version = `${versionParts[0]}.${versionParts[1]}.${newPatch}`;
              console.log(`Using local version file, incrementing to ${version}`);
            }
          } catch (error) {
            console.warn('Warning: Could not parse existing package.json version, using default version');
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Error checking npm registry: ${error.message}`);
      console.log('Falling back to local version check');
      
      // Fall back to checking local package.json
      const clientPackageJsonPath = path.join(process.cwd(), 'client', 'package.json');
      if (fs.existsSync(clientPackageJsonPath)) {
        try {
          const packageJson = JSON.parse(fs.readFileSync(clientPackageJsonPath, 'utf8'));
          if (packageJson.version) {
            // Parse the version and increment the patch version
            const versionParts = packageJson.version.split('.');
            const newPatch = parseInt(versionParts[2], 10) + 1;
            version = `${versionParts[0]}.${versionParts[1]}.${newPatch}`;
            console.log(`Using local version file, incrementing to ${version}`);
          }
        } catch (error) {
          console.warn('Warning: Could not parse existing package.json version, using default version');
        }
      }
    }
  } catch (error) {
    console.warn(`Warning: ${error.message}`);
    console.log(`Using default version ${version}`);
  }
  
  return version;
}

// Generate package.json for the client
function generatePackageJson(serviceName) {
  const version = getNextVersion(serviceName);
  
  const packageJson = {
    name: `@events-project/grpc-${serviceName}`,
    version: version,
    description: `gRPC client for ${serviceName} service`,
    main: 'dist/index.js',
    types: 'dist/index.d.ts',
    files: [
      'dist'
    ],
    scripts: {
      build: 'tsc'
    },
    dependencies: {
      'nice-grpc': '^2.1.0',
      'nice-grpc-common': '^2.0.2',
      'protobufjs': '^7.2.3',
      'dotenv': '^16.4.7',
      'long': '^5.2.3'
    },
    devDependencies: {
      '@types/node': '^20.10.0',
      'typescript': '^5.2.2'
    },
    publishConfig: {
      registry: 'https://npm.pkg.github.com'
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/events-project/grpc-clients.git'
    }
  };

  return JSON.stringify(packageJson, null, 2);
}

// Generate tsconfig.json for the client
function generateTsConfig() {
  const tsConfig = {
    compilerOptions: {
      target: 'es2020',
      module: 'commonjs',
      declaration: true,
      outDir: './dist',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist']
  };

  return JSON.stringify(tsConfig, null, 2);
}

// Generate README.md for the client
function generateReadme(serviceName) {
  return `# @events-project/grpc-${serviceName}

gRPC client for the ${serviceName} service.

## Installation

\`\`\`bash
npm install @events-project/grpc-${serviceName}
\`\`\`

## Usage

\`\`\`typescript
import { ${serviceName}RpcClient } from '@events-project/grpc-${serviceName}';

// The client is already configured with the URL from the environment variable
// GRPC_${serviceName.toUpperCase()}_URL

// Now you can use the client to make gRPC calls
// Example:
// const response = await ${serviceName}RpcClient.someMethod({ /* request data */ });
\`\`\`

## Custom Connection URL

If you need to use a custom URL instead of the environment variable:

\`\`\`typescript
import { createClient } from '@events-project/grpc-${serviceName}';

const customClient = createClient('your-custom-url');
\`\`\`
`;
}

// Generate client index.ts
function generateClientIndex(serviceName) {
  const upperServiceName = serviceName.charAt(0).toUpperCase() + serviceName.slice(1);
  const envVar = `GRPC_${serviceName.toUpperCase()}_URL`;

  return `import dotenv from 'dotenv';
import { createChannel, createClient as createNiceGrpcClient } from 'nice-grpc';
import {
  ${upperServiceName}ServiceClient,
  ${upperServiceName}ServiceDefinition
} from './service';

dotenv.config();

export * from './service';

/**
 * Creates a gRPC client for the ${upperServiceName} service.
 * 
 * @param url Optional URL to connect to. If not provided, it will use the
 * environment variable ${envVar}.
 * @returns A configured ${upperServiceName}ServiceClient
 */
export function createClient(url?: string): ${upperServiceName}ServiceClient {
  const serviceUrl = url || process.env.${envVar};
  
  if (!serviceUrl) {
    throw new Error('${envVar} environment variable is not set and no URL was provided');
  }

  const channel = createChannel(serviceUrl);
  
  return createNiceGrpcClient(
    ${upperServiceName}ServiceDefinition,
    channel,
  );
}

/**
 * Pre-configured gRPC client for the ${upperServiceName} service.
 * Uses the ${envVar} environment variable for connection.
 */
export const ${serviceName}RpcClient = createClient();
`;

}

// Main function to generate the client
async function generateClient() {
  try {
    // Ensure the proto file is compiled
    console.log('Generating TypeScript from proto file...');
    const protoCommand = isWindows ? 'npm run proto:generatewin' : 'npm run proto:generate';
    execSync(protoCommand, { stdio: 'inherit' });

    const serviceName = getServiceName();
    console.log(`Generating client for ${serviceName} service...`);

    const clientDir = createClientDir();
    const srcDir = path.join(clientDir, 'src');
    
    if (!fs.existsSync(srcDir)) {
      fs.mkdirSync(srcDir);
    }

    // Copy the generated service.ts to the client src directory
    const serviceSource = path.join(process.cwd(), 'src', 'grpc', 'service.ts');
    const serviceTarget = path.join(srcDir, 'service.ts');
    
    if (!fs.existsSync(serviceSource)) {
      console.error('Error: service.ts not found. Make sure to run proto:generate first.');
      process.exit(1);
    }
    
    fs.copyFileSync(serviceSource, serviceTarget);

    // Generate index.ts
    const indexContent = generateClientIndex(serviceName);
    fs.writeFileSync(path.join(srcDir, 'index.ts'), indexContent);

    // Generate package.json
    const packageJsonContent = generatePackageJson(serviceName);
    fs.writeFileSync(path.join(clientDir, 'package.json'), packageJsonContent);

    // Generate tsconfig.json
    const tsConfigContent = generateTsConfig();
    fs.writeFileSync(path.join(clientDir, 'tsconfig.json'), tsConfigContent);

    // Generate README.md
    const readmeContent = generateReadme(serviceName);
    fs.writeFileSync(path.join(clientDir, 'README.md'), readmeContent);

    console.log(`Client for ${serviceName} service generated successfully in ${clientDir}`);
    console.log('To build and publish the client, run: npm run client:publish');
  } catch (error) {
    console.error('Error generating client:', error);
    process.exit(1);
  }
}

generateClient();
