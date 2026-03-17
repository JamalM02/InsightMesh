#!/bin/bash
# =============================================
# InsightMesh Nginx + SSL Setup
# Reads ports from .env, generates nginx config, gets SSL cert
# Run: bash nginx/setup.sh
# =============================================
set -e

DOMAIN="insightmesh.jmd-solutions.com"
EMAIL="insightmesh@jmd-solutions.com"
CONF_NAME="insightmesh.jmd-solutions.com"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=========================================="
echo "  InsightMesh Nginx Setup"
echo "=========================================="

# -- Helper: read a value from a .env file --
read_env() {
    local file="$1" key="$2" default="$3"
    if [ ! -f "$file" ]; then
        echo "$default"
        return
    fi
    local value
    value=$(grep -E "^${key}=" "$file" 2>/dev/null | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'" | tr -d '\r' | xargs)
    echo "${value:-$default}"
}

# [1/6] Read ports from .env files
echo ""
echo "[1/6] Reading ports from .env files..."
FRONT_PORT=$(read_env "$ROOT_DIR/apps/front/.env" "PORT" "5000")
GATEWAY_PORT=$(read_env "$ROOT_DIR/apps/api-gateway/.env" "PORT" "5500")
METABASE_PORT=$(read_env "$ROOT_DIR/.env" "METABASE_PORT" "3000")
CLICKHOUSE_PORT=$(read_env "$ROOT_DIR/.env" "CLICKHOUSE_PORT" "8123")

echo "   Frontend:    $FRONT_PORT"
echo "   API Gateway: $GATEWAY_PORT"
echo "   Metabase:    $METABASE_PORT"
echo "   ClickHouse:  $CLICKHOUSE_PORT"

# [2/6] Generate nginx config from template
echo ""
echo "[2/6] Generating nginx config from template..."
sed \
    -e "s/\r$//" \
    -e "s/\${FRONT_PORT}/$FRONT_PORT/g" \
    -e "s/\${GATEWAY_PORT}/$GATEWAY_PORT/g" \
    -e "s/\${METABASE_PORT}/$METABASE_PORT/g" \
    -e "s/\${CLICKHOUSE_PORT}/$CLICKHOUSE_PORT/g" \
    "$SCRIPT_DIR/$CONF_NAME.template" > "$SCRIPT_DIR/$CONF_NAME"

if grep -q '\${' "$SCRIPT_DIR/$CONF_NAME"; then
    echo "  ERROR: Generated config has unresolved variables!"
    grep '\${' "$SCRIPT_DIR/$CONF_NAME"
    exit 1
fi
echo "  Generated: nginx/$CONF_NAME"

# [3/6] Install nginx config
echo ""
echo "[3/6] Installing Nginx configuration..."
sudo mkdir -p /var/www/certbot

# Install htpasswd if needed
if ! command -v htpasswd &>/dev/null; then
    sudo apt-get update -qq && sudo apt-get install -y -qq apache2-utils
fi

# Create htpasswd if not exists
if [ ! -f /etc/nginx/.htpasswd ]; then
    echo "  Creating htpasswd file (for Metabase & ClickHouse)..."
    sudo htpasswd -c /etc/nginx/.htpasswd admin
else
    echo "  /etc/nginx/.htpasswd already exists"
fi

sudo cp "$SCRIPT_DIR/$CONF_NAME" /etc/nginx/sites-available/$CONF_NAME
sudo ln -sf /etc/nginx/sites-available/$CONF_NAME /etc/nginx/sites-enabled/

# [4/6] SSL Certificate
echo ""
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "[4/6] No SSL cert found -- generating with certbot..."
    sudo systemctl stop nginx || true
    sudo certbot certonly --standalone \
        --non-interactive \
        --agree-tos \
        --email $EMAIL \
        -d $DOMAIN
else
    echo "[4/6] SSL cert already exists -- skipping certbot"
fi

# [5/6] Test and start nginx
echo ""
echo "[5/6] Testing Nginx configuration..."
sudo nginx -t

echo ""
echo "[6/6] Starting Nginx..."
sudo systemctl start nginx || sudo systemctl reload nginx
sudo systemctl enable nginx

# Setup SSL auto-renewal
(crontab -l 2>/dev/null | grep -v certbot; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -

echo ""
echo "=========================================="
echo "  Done! $DOMAIN is live"
echo "=========================================="
echo ""
echo "  Frontend:     https://$DOMAIN/              (port $FRONT_PORT)"
echo "  API Gateway:  https://$DOMAIN/api-gateway/  (port $GATEWAY_PORT)"
echo "  Metabase:     https://$DOMAIN/metabase/     (port $METABASE_PORT, password protected)"
echo "  ClickHouse:   https://$DOMAIN/clickhouse/   (port $CLICKHOUSE_PORT, password protected)"
echo ""
