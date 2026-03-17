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

// Load each service's .env
const frontEnv = parseEnvFile(path.join(ROOT, 'apps/front/.env'));
const gatewayEnv = parseEnvFile(path.join(ROOT, 'apps/api-gateway/.env'));
const accountEnv = parseEnvFile(path.join(ROOT, 'packages/grpc-account/.env'));
const eventsEnv = parseEnvFile(path.join(ROOT, 'packages/grpc-events/.env'));

// Read ports from .env (with fallback defaults)
const FRONT_PORT = frontEnv.PORT || '5000';
const GATEWAY_PORT = gatewayEnv.PORT || '5500';
const ACCOUNT_PORT = accountEnv.PORT || '50053';
const EVENTS_PORT = eventsEnv.PORT || '50052';

// Auto-construct inter-service URLs from the ports above
const HOST = '0.0.0.0';
const GRPC_ACCOUNT_URL = `${HOST}:${ACCOUNT_PORT}`;
const GRPC_EVENTS_URL = `${HOST}:${EVENTS_PORT}`;

module.exports = {
    apps: [
        // =======================
        // FRONT (Next.js)
        // =======================
        {
            name: 'front',
            cwd: path.join(ROOT, 'apps/front'),
            script: 'npm',
            args: 'start',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
                PORT: FRONT_PORT,
                ...frontEnv,
                // Override with auto-constructed URL from grpc-account's PORT
                GRPC_ACCOUNT_URL,
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
            name: 'api-gateway',
            cwd: path.join(ROOT, 'apps/api-gateway'),
            script: 'node',
            args: 'dist/app.js',
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
        // gRPC ACCOUNT
        // =======================
        {
            name: 'grpc-account',
            cwd: path.join(ROOT, 'packages/grpc-account'),
            script: 'node',
            args: 'dist/app.js',
            env: {
                NODE_ENV: 'production',
                PORT: ACCOUNT_PORT,
                ...accountEnv,
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
            name: 'grpc-events',
            cwd: path.join(ROOT, 'packages/grpc-events'),
            script: 'node',
            args: 'dist/app.js',
            env: {
                NODE_ENV: 'production',
                PORT: EVENTS_PORT,
                ...eventsEnv,
            },
            max_memory_restart: '512M',
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true,
        },
    ],
};
