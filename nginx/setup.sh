#!/bin/bash
# =============================================
# InsightMesh Nginx Setup
# Reads ports from .env files, generates nginx config, installs SSL
# Run: bash nginx/setup.sh
# =============================================
set -e

DOMAIN="insightmesh.jmd-solutions.com"
CONF_NAME="insightmesh.jmd-solutions.com"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# ── Helper: read a value from a .env file ──
read_env() {
    local file="$1" key="$2" default="$3"
    if [ ! -f "$file" ]; then
        echo "$default"
        return
    fi
    local value
    value=$(grep -E "^${key}=" "$file" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'" | xargs)
    echo "${value:-$default}"
}

# ── Read ports from .env files ──
echo "📖 Reading ports from .env files..."
FRONT_PORT=$(read_env "$ROOT_DIR/apps/front/.env" "PORT" "5000")
GATEWAY_PORT=$(read_env "$ROOT_DIR/apps/api-gateway/.env" "PORT" "5500")
METABASE_PORT=$(read_env "$ROOT_DIR/.env" "METABASE_PORT" "3000")
CLICKHOUSE_PORT=$(read_env "$ROOT_DIR/.env" "CLICKHOUSE_PORT" "8123")

echo "   Frontend:    $FRONT_PORT"
echo "   API Gateway: $GATEWAY_PORT"
echo "   Metabase:    $METABASE_PORT"
echo "   ClickHouse:  $CLICKHOUSE_PORT"
echo ""

# ── Generate nginx config from template using sed ──
echo "⚙️  Generating nginx config from template..."
sed \
    -e "s/\r$//" \
    -e "s/\${FRONT_PORT}/$FRONT_PORT/g" \
    -e "s/\${GATEWAY_PORT}/$GATEWAY_PORT/g" \
    -e "s/\${METABASE_PORT}/$METABASE_PORT/g" \
    -e "s/\${CLICKHOUSE_PORT}/$CLICKHOUSE_PORT/g" \
    "$SCRIPT_DIR/$CONF_NAME.template" > "$SCRIPT_DIR/$CONF_NAME"

# Verify the generated config has no unresolved variables
if grep -q '\${' "$SCRIPT_DIR/$CONF_NAME"; then
    echo "❌ ERROR: Generated config still has unresolved variables!"
    grep '\${' "$SCRIPT_DIR/$CONF_NAME"
    exit 1
fi

echo "✅ Generated: nginx/$CONF_NAME"
echo ""

# ── Install htpasswd tool if not present ──
if ! command -v htpasswd &>/dev/null; then
    echo "📦 Installing apache2-utils for htpasswd..."
    sudo apt-get update && sudo apt-get install -y apache2-utils
fi

# ── Create htpasswd file if it doesn't exist ──
if [ ! -f /etc/nginx/.htpasswd ]; then
    echo "🔐 Creating htpasswd file (for Metabase & ClickHouse access)..."
    sudo htpasswd -c /etc/nginx/.htpasswd admin
else
    echo "✅ /etc/nginx/.htpasswd already exists"
fi

# ── Copy nginx config ──
echo "📋 Installing nginx config..."
sudo cp "$SCRIPT_DIR/$CONF_NAME" /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/$CONF_NAME /etc/nginx/sites-enabled/

# ── Test & reload nginx ──
echo "🧪 Testing nginx config..."
sudo nginx -t

echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

# ── SSL with Certbot ──
echo ""
echo "🔒 Setting up SSL with Certbot..."
if ! command -v certbot &>/dev/null; then
    echo "📦 Installing certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

sudo certbot --nginx -d $DOMAIN

echo ""
echo "✅ Done! $DOMAIN is now live with HTTPS"
echo ""
echo "Services accessible at:"
echo "  🌐 Frontend:     https://$DOMAIN/              (port $FRONT_PORT)"
echo "  🔌 API Gateway:  https://$DOMAIN/api-gateway/  (port $GATEWAY_PORT)"
echo "  📊 Metabase:     https://$DOMAIN/metabase/     (port $METABASE_PORT, password protected)"
echo "  🗄️  ClickHouse:  https://$DOMAIN/clickhouse/   (port $CLICKHOUSE_PORT, password protected)"
