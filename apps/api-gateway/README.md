# InsightMesh API Gateway (`apps/api-gateway`)

This service acts as the HTTP interface for InsightMesh. It handles incoming REST requests from clients, validates API keys via gRPC, and forwards valid event data to the gRPC Events service.

---

## 🚀 Technologies Used

* **Express.js + TypeScript**
* **gRPC Client** for communication with internal microservices
* **Zod** for input validation
* **Custom Middleware** (API key, logger, error handler)

---

## 📁 Project Structure

```
apps/api-gateway/
├── src/
│   ├── controllers/
│   │   └── events.ts            # Controller logic for event routing
│   ├── libs/
│   │   └── env/                 # Env validation with zod
│   │       ├── env.ts
│   │       └── index.ts
│   ├── middleware/
│   │   ├── api-key.ts           # API key validation logic
│   │   ├── errors.ts            # Error handling middleware
│   │   ├── logger.ts            # Logging middleware
│   │   └── index.ts
│   ├── routes/
│   │   ├── event.routes.ts      # Routes configuration
│   │   └── index.ts
│   └── app.ts                  # Main app entry
├── tsconfig.json
├── package.json
└── README.md
```

---

## 📦 Features

* Accepts REST POST requests at `/api/events`
* Validates API key by calling `grpc-account.ValidateApiKey`
* Forwards valid event payload to `grpc-events.CreateEvent`
* Uses centralized logger and error formatter middleware

---

## 🧪 API Endpoint

### `POST /api/events`

Track any event from your platform. All events flow through Kafka into ClickHouse for real-time analytics.

#### Headers

| Header | Required | Description |
|---|---|---|
| `Content-Type` | Yes | `application/json` |
| `x-api-key` | Yes | Your secret API key (starts with `sk_`) |

#### Request Body

```json
{
  "type": "string (required) — event category name",
  "data": { "...any key-value pairs (required) — event payload" }
}
```

#### Response (201 Created)

```json
{
  "id": "evt_2abc3def4ghi5jkl",
  "appId": "org_abc123",
  "type": "page.view",
  "data": { "page": "/pricing", "referrer": "google.com" }
}
```

---

### 📋 Examples

#### 1. Basic event — cURL

```bash
curl -X POST https://insightmesh.jmd-solutions.com/api-gateway/api/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_YOUR_API_KEY_HERE" \
  -d '{
    "type": "page.view",
    "data": {
      "page": "/pricing",
      "referrer": "google.com",
      "userAgent": "Mozilla/5.0"
    }
  }'
```

#### 2. User action tracking

```bash
curl -X POST https://insightmesh.jmd-solutions.com/api-gateway/api/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_YOUR_API_KEY_HERE" \
  -d '{
    "type": "button.click",
    "data": {
      "buttonId": "signup-cta",
      "page": "/landing",
      "userId": "user_12345"
    }
  }'
```

#### 3. Purchase event

```bash
curl -X POST https://insightmesh.jmd-solutions.com/api-gateway/api/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_YOUR_API_KEY_HERE" \
  -d '{
    "type": "purchase.completed",
    "data": {
      "orderId": "ORD-98765",
      "amount": 49.99,
      "currency": "USD",
      "items": 3
    }
  }'
```

#### 4. External feed (e.g., Reddit RSS via Make.com/n8n)

```bash
curl -X POST https://insightmesh.jmd-solutions.com/api-gateway/api/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk_YOUR_API_KEY_HERE" \
  -d '{
    "type": "reddit.post",
    "data": {
      "id": "1k2abc",
      "author": "u/satoshi",
      "title": "Bitcoin hits new all-time high",
      "link": "https://reddit.com/r/CryptoCurrency/comments/1k2abc",
      "timestamp": "2026-03-17T19:00:00Z"
    }
  }'
```

#### 5. JavaScript / Node.js

```javascript
const response = await fetch('https://insightmesh.jmd-solutions.com/api-gateway/api/events', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk_YOUR_API_KEY_HERE',
  },
  body: JSON.stringify({
    type: 'page.view',
    data: {
      page: '/dashboard',
      userId: 'user_42',
      sessionId: 'sess_abc123',
    },
  }),
});

const result = await response.json();
console.log(result);
// { id: "evt_...", appId: "org_...", type: "page.view", data: { ... } }
```

#### 6. Python

```python
import requests

response = requests.post(
    "https://insightmesh.jmd-solutions.com/api-gateway/api/events",
    headers={
        "Content-Type": "application/json",
        "x-api-key": "sk_YOUR_API_KEY_HERE",
    },
    json={
        "type": "api.call",
        "data": {
            "endpoint": "/users",
            "method": "GET",
            "status": 200,
            "duration_ms": 45,
        },
    },
)

print(response.json())
```

#### Error Responses

| Status | Meaning | Example |
|---|---|---|
| `400` | Invalid JSON body | `{"message": "Expected ',' or '}' ..."}` |
| `401` | Missing or invalid API key | `{"message": "Unauthorized"}` |
| `500` | Internal server error | `{"message": "Internal Server Error"}` |

---

## 📁 Environment Setup

Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default: `5500`) |
| `GRPC_EVENTS_URL` | gRPC Events service URL (auto-injected by `ecosystem.config.js` in production) |
| `GRPC_ACCOUNT_URL` | gRPC Account service URL (auto-injected by `ecosystem.config.js` in production) |

> **Note:** `GRPC_EVENTS_URL` and `GRPC_ACCOUNT_URL` are automatically injected by PM2 in production based on the `PORT` values in each gRPC service's `.env`. The `.env` values here are only used for local development.

---

## 🛠 Development

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Start dev server:

```bash
npm run dev --workspace=apps/api-gateway
```

---

## ✅ Production

Build the service:

```bash
npm run build
```

Run with PM2 or Node:

```bash
npm start --workspace=apps/api-gateway
```

---

## 📬 Maintainer

Built and maintained by **Jamal Majadle**.
