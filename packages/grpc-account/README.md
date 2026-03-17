# InsightMesh Account Service (`packages/grpc-account`)

This service handles user accounts, organization registration, API key management, credit usage tracking, and billing via Stripe. It also acts as a Temporal client for automated billing workflows.

---

## 🚀 Technologies Used

* **Node.js + TypeScript**
* **nice-grpc** for gRPC server/client
* **Prisma ORM** (PostgreSQL via Neon)
* **Stripe** for billing and subscriptions
* **Temporal.io** for workflow orchestration
* **dotenv** for environment variable management

---

## 📦 Features

* Organization and user registration
* API key generation, encryption, and validation
* Usage tracking per organization (linked to events)
* Billing automation (via Temporal workflows)
* Integration with Clerk for identity + org sync
* Integration with Stripe for charging + metering

---

## 📁 Project Structure

```
packages/grpc-account/
├── src/
│   ├── grpc/             # gRPC proto-generated types
│   ├── methods/          # gRPC RPC implementations
│   ├── libs/             # Prisma, Stripe, encryption, usage logic
│   ├── workflows/        # Temporal workflow client utils
│   ├── app.ts            # gRPC server bootstrap
│   └── client.ts         # Optional gRPC client
├── service.proto         # gRPC service definition
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📁 Environment Setup

Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `SERVICE_NAME` | Service identifier (default: `account-service`) |
| `HOST` | Bind address (default: `0.0.0.0`) |
| `PORT` | gRPC server port (default: `50053`) |
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `CLICKHOUSE_URL` | ClickHouse HTTP endpoint |
| `CLICKHOUSE_USERNAME` | ClickHouse username |
| `CLICKHOUSE_PASSWORD` | ClickHouse password |
| `SECRET_ENCRYPT_KEY` | 64-char hex key for API key encryption |
| `KAFKA_URL` | Kafka broker URL |
| `KAFKA_CLIENT_ID` | Kafka client ID |
| `KAFKA_TOPIC` | Kafka topic for events |
| `KAFKA_GROUP_ID` | Kafka consumer group ID |
| `STRIPE_SECRET_KEY` | Stripe secret key for billing |

---

## 🛠 Development

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Generate Prisma client:

```bash
npx prisma generate
```

Start development server:

```bash
PORT=50053 npm run dev --workspace=packages/grpc-account
```

---

## 🛰 gRPC Methods

### `CreateAccount`

Registers a new organization and associates it with a Stripe customer, org ID, secret, and API key.

### `ValidateApiKey`

Validates if the provided API key belongs to a valid organization.

### `RevealApiKey`

Returns a decrypted version of a previously encrypted API key (requires `appId` and `secretId`).

### `MonthlyBilling`

Summarizes the monthly usage of an application and prepares data for Stripe charging.

### `UpdateBillingStatus`

Marks a billing cycle as complete after charging the Stripe customer.

### `GetAccount`

Fetches account and organization metadata using app ID.

### `GetSecret`

## Retrieves encrypted/decrypted secret information used for API key handling.

## 🔐 API Key Management

* Format: `sk_xxxxxxxxxxx`
* Encrypted using AES and stored in the `Secret` table
* Decrypted at runtime for comparison

```ts
const apiKey = decrypt({
  secretKey: env('SECRET_ENCRYPT_KEY'),
  iv,
  ciphertext,
});
```

---

---

## ✅ Production

Build the service:

```bash
npm run build
npm run prisma:generate
npm run prisma:push
npm run proto:generate
```

Start server:

```bash
npm start --workspace=packages/grpc-account
```

---

## 📬 Maintainer

Built and maintained by **Jamal Majadle**.
