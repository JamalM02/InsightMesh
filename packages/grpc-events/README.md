# InsightMesh Events Service (`packages/grpc-events`)

This service ingests incoming events via gRPC, validates them, and publishes them to a Kafka stream for further processing and analytics. It plays a central role in real-time event tracking within the InsightMesh system.

---

## 🚀 Technologies Used

* **Node.js + TypeScript**
* **nice-grpc** for gRPC server
* **KafkaJS** for Kafka producer
* **Prisma ORM** (for internal logging if needed)
* **dotenv** for environment variable management

---

## 📦 Features

* Accepts external events from API Gateway via gRPC
* Publishes events to Kafka topic `events`
* Validates events using schema logic
* Designed to support scaling and batching

---

## 📁 Project Structure

```
packages/grpc-events/
├── src/
│   ├── grpc/             # gRPC proto-generated types
│   ├── methods/          # gRPC method handlers
│   ├── libs/
│   │   ├── database/     # Prisma DB logic (optional internal logging)
│   │   ├── env/          # Env config and validation (zod)
│   │   └── kafka/        # Kafka producer client
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
| `HOST` | Bind address (default: `0.0.0.0`) |
| `PORT` | gRPC server port (default: `50052`) |
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `KAFKA_URL` | Kafka broker URL |
| `KAFKA_CLIENT_ID` | Kafka client ID (default: `events-service`) |

---

## 🛠 Development

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Generate Prisma client (optional):

```bash
npx prisma generate
```

Start development server:

```bash
PORT=50052 npm run dev --workspace=packages/grpc-events
```

---

## 🛰 gRPC Methods

### `CreateEvent`

Receives a structured event from the API Gateway or external app and publishes it to Kafka.

* **Request**: `CreateEventRequest` (includes `appId`, `type`, and structured `data`)
* **Response**: `CreateEventResponse` with status confirmation

---

## ✅ Production

Build the service:

```bash
npm run build
npm run prisma:generate
npm run proto:generate
```

Start server:

```bash
npm start --workspace=packages/grpc-events
```

---

## 📬 Maintainer

Built and maintained by **Jamal Majadle**.
