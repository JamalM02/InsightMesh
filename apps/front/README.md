# InsightMesh Frontend (`apps/front`)

This is the frontend for the **InsightMesh** analytics platform.
It allows users to:

* Sign up and sign in using Clerk
* Create and manage organizations
* View real-time analytics and dashboards powered by Metabase

---

## 🚀 Technologies Used

* **Next.js**: React-based framework with SSR support
* **TypeScript**: Strong typing across the entire frontend codebase
* **Clerk**: Handles authentication and organization context
* **Tailwind CSS**: For responsive UI styling
* **Metabase**: Embedded dashboards showing analytics from ClickHouse

---

## 📦 Features

* 🔐 Secure Clerk-authenticated login
* 🏢 Organization context resolution via Clerk + backend
* 📊 Displays analytics per organization and user events
* 🌐 Dynamic routing for dashboards
* 📁 Configurable via `.env`

---

## 📁 Environment Setup

Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port for the Next.js server (default: `5000`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `GRPC_ACCOUNT_URL` | gRPC Account service URL (auto-injected by `ecosystem.config.js` in production) |
| `NEXT_PUBLIC_METABASE_DASHBOARD_URL` | Metabase dashboard URL |

---

## 🛠 Development

Install dependencies:

```bash
npm install --legacy-peer-deps
```

Run the app:

```bash
npm run dev --workspace=apps/front
```

---

## 🚀 Production

You can serve the production build on port 5000 like this:

```bash
npm run build --workspace=apps/front
npm run start --workspace=apps/front
```

`start` is configured as:

```json
"start": "next start -p ${PORT:-5000} -H 0.0.0.0"
```

> The port is read from the `PORT` environment variable (defaults to 5000).

---

## 🔐 Authentication Flow

* Uses Clerk's multi-tenant org features
* After login, the frontend fetches the active organization
* All dashboard views are scoped by the org ID

---

## 📊 Dashboards

Metabase is embedded via iframe or reverse proxy to present analytics such as:

* Top event types
* Daily usage trends
* Active org metrics

---

## 📬 Maintainer

Built and maintained by **Jamal Majadle**.
