const path = require('path');
const fs = require('fs');

/**
 * Parse a .env file and return key-value pairs
 */
function parseEnvFile(envPath) {
    const env = {};
    try {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            const match = trimmed.match(/^([^=]+?)\s*=\s*(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove surrounding quotes
                if ((value.startsWith('"') && value.endsWith('"')) ||
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                env[match[1].trim()] = value;
            }
        }
    } catch (err) {
        console.warn(`Warning: Could not read ${envPath}: ${err.message}`);
    }
    return env;
}

// Base directory (where this file lives = project root)
const ROOT = __dirname;

// Load root .env (Docker service ports) and each service's .env
const rootEnv = parseEnvFile(path.join(ROOT, '.env'));
const frontEnv = parseEnvFile(path.join(ROOT, 'apps/front/.env'));
const gatewayEnv = parseEnvFile(path.join(ROOT, 'apps/api-gateway/.env'));
const docsEnv = parseEnvFile(path.join(ROOT, 'apps/docs-dev/.env'));
const accountEnv = parseEnvFile(path.join(ROOT, 'packages/grpc-account/.env'));
const eventsEnv = parseEnvFile(path.join(ROOT, 'packages/grpc-events/.env'));

// Read Node.js service ports from .env (with fallback defaults)
const FRONT_PORT = frontEnv.PORT || '5000';
const GATEWAY_PORT = gatewayEnv.PORT || '5500';
const DOCS_PORT = docsEnv.PORT || '6000';
const ACCOUNT_PORT = accountEnv.PORT || '50053';
const EVENTS_PORT = eventsEnv.PORT || '50052';

// Read Docker service ports from root .env (with fallback defaults)
const KAFKA_PORT = rootEnv.KAFKA_PORT || '29092';
const CLICKHOUSE_PORT = rootEnv.CLICKHOUSE_PORT || '8123';
const METABASE_PORT = rootEnv.METABASE_PORT || '3000';

// Auto-construct inter-service URLs from the ports above
const HOST = '0.0.0.0';
const GRPC_ACCOUNT_URL = `${HOST}:${ACCOUNT_PORT}`;
const GRPC_EVENTS_URL = `${HOST}:${EVENTS_PORT}`;

// Auto-construct Docker service URLs (internal, server-to-server)
const KAFKA_URL = `localhost:${KAFKA_PORT}`;
const CLICKHOUSE_URL = `http://localhost:${CLICKHOUSE_PORT}`;
// NEXT_PUBLIC_METABASE_DASHBOARD_URL comes from apps/front/.env (Metabase public dashboard link)

module.exports = {
    apps: [
        // =======================
        // FRONT (Next.js)
        // =======================
        {
            name: 'im-front',
            cwd: path.join(ROOT, 'apps/front'),
            script: 'npm',
            args: 'start',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
                PORT: FRONT_PORT,
                ...frontEnv,
                // Override with auto-constructed URLs
                GRPC_ACCOUNT_URL,
                // NEXT_PUBLIC_METABASE_DASHBOARD_URL comes from ...frontEnv above
            },
            max_memory_restart: '512M',
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true,
        },

        // =======================
        // API GATEWAY
        // =======================
        {
            name: 'im-gateway',
            cwd: path.join(ROOT, 'apps/api-gateway'),
            script: 'npm',
            args: 'start',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
                PORT: GATEWAY_PORT,
                ...gatewayEnv,
                // Override with auto-constructed URLs from gRPC services' PORTs
                GRPC_ACCOUNT_URL,
                GRPC_EVENTS_URL,
            },
            max_memory_restart: '512M',
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true,
        },

        // =======================
        // DEVELOPER DOCS (Docusaurus)
        // =======================
        {
            name: 'im-docs',
            cwd: path.join(ROOT, 'apps/docs-dev'),
            script: 'npm',
            args: 'run start:server',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
                PORT: DOCS_PORT,
                ...docsEnv,
            },
            max_memory_restart: '256M',
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true,
        },

        // =======================
        // gRPC ACCOUNT
        // =======================
        {
            name: 'im-account',
            cwd: path.join(ROOT, 'packages/grpc-account'),
            script: 'node',
            args: 'dist/app.js',
            env: {
                NODE_ENV: 'production',
                PORT: ACCOUNT_PORT,
                ...accountEnv,
                // Override with auto-constructed Docker service URLs
                KAFKA_URL,
                CLICKHOUSE_URL,
                // ClickHouse credentials come from the root .env (single source of truth
                // shared with docker-compose.yml) — overrides whatever is in service .env
                CLICKHOUSE_USERNAME: rootEnv.CLICKHOUSE_USER,
                CLICKHOUSE_PASSWORD: rootEnv.CLICKHOUSE_PASSWORD,
            },
            max_memory_restart: '512M',
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true,
        },

        // =======================
        // gRPC EVENTS
        // =======================
        {
            name: 'im-events',
            cwd: path.join(ROOT, 'packages/grpc-events'),
            script: 'node',
            args: 'dist/app.js',
            env: {
                NODE_ENV: 'production',
                PORT: EVENTS_PORT,
                ...eventsEnv,
                // Override with auto-constructed Docker service URL
                KAFKA_URL,
            },
            max_memory_restart: '512M',
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true,
        },
    ],
};
