---
sidebar_position: 1
---

# Introduction

#### The InsightMesh Events API is REST-based and allows you to track events and interactions in your application.

## Authentication

All API requests require an `x-api-key` header. You can generate API keys from the [InsightMesh Dashboard](https://insightmesh.jmd-solutions.com/developers/keys) under **Developers → API Keys**.

## Base URLs

| Environment | URL |
|---|---|
| **Production** | `https://insightmesh.jmd-solutions.com/api-gateway` |
| **Local development** | `http://localhost:5500` |

## Quick Start

```bash
curl -X POST https://insightmesh.jmd-solutions.com/api-gateway/api/events \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "type": "user.created",
    "data": {
      "userId": "user-789",
      "email": "user@example.com"
    }
  }'
```
