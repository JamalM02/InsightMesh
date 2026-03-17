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

```json
{
  "type": "string",
  "data": { ... },
  "x-api-Key": "sk_abc123"
}
```

* **Validates** `apiKey` via `grpc-account`
* If valid, calls `grpc-events.CreateEvent`

---

## 📁 Environment Setup

Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port for the Express server (default: `5500`) |
| `GRPC_ACCOUNT_URL` | gRPC Account service URL (auto-injected by `ecosystem.config.js` in production) |

> **Note:** `GRPC_ACCOUNT_URL` is automatically injected by PM2 in production based on the `PORT` value in `packages/grpc-account/.env`. The `.env` value is only used for local development.

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
