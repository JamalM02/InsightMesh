module.exports = {
    apps: [
        // =======================
        // FRONT (Next.js, port 5000)
        // =======================
        {
            name: "front",
            cwd: "/home/scholarsharenet/InsightMesh/apps/front",
            // run your package's "start" script: `next start -p 5000 -H 0.0.0.0`
            script: "npm",
            args: "start -- -p 5000 -H 0.0.0.0",
            interpreter: "none",
            env: { NODE_ENV: "production", PORT: "5000" },
            max_memory_restart: "512M",
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true
        },

        // =======================
        // API GATEWAY (Node on port 5500)
        // =======================
        {
            name: "api-gateway",
            cwd: "/home/scholarsharenet/InsightMesh/packages/api-gateway",
            script: "node",
            args: "dist/app.js", // adjust if your compiled entry is different
            env: { NODE_ENV: "production", PORT: "5500" },
            max_memory_restart: "512M",
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true
        },

        // =======================
        // gRPC ACCOUNT (e.g., :50053)
        // =======================
        {
            name: "grpc-account",
            cwd: "/home/scholarsharenet/InsightMesh/packages/grpc-account",
            script: "node",
            args: "dist/app.js", // adjust if needed
            env: { NODE_ENV: "production", GRPC_PORT: "50053" },
            max_memory_restart: "512M",
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true
        },

        // =======================
        // gRPC EVENTS (e.g., :50052)
        // =======================
        {
            name: "grpc-events",
            cwd: "/home/scholarsharenet/InsightMesh/packages/grpc-events",
            script: "node",
            args: "dist/app.js", // adjust if needed
            env: { NODE_ENV: "production", GRPC_PORT: "50052" },
            max_memory_restart: "512M",
            restart_delay: 2000,
            exp_backoff_restart_delay: 200,
            autorestart: true
        }
    ]
};