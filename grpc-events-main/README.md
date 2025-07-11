# TypeScript gRPC Service with nice-grpc

A modern TypeScript implementation of a gRPC service using the nice-grpc library.

## Project Structure

```
/
├── service.proto         # gRPC service definition
├── src/
│   ├── grpc/            # Generated TypeScript types from protobuf
│   ├── methods/         # Each RPC method implementation as a separate file
│   ├── libs/            # Internal logic and utilities
│   ├── app.ts           # Main server application
│   └── client.ts        # Example client implementation
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Generate TypeScript types from protobuf
npm run proto:generate
```

### Development

```bash
# Run the server in development mode
npm run dev

# Run the client example
ts-node src/client.ts
```

### Building and Running

```bash
# Build the project
npm run build

# Run the server
npm start
```

## Features

This gRPC service demonstrates all four types of RPC methods:

1. **Unary RPC**: Simple request-response (`SayHello`)
2. **Server Streaming RPC**: Server sends multiple responses (`SayHelloStream`)
3. **Client Streaming RPC**: Client sends multiple requests (`SayHellosFromClient`)
4. **Bidirectional Streaming RPC**: Both client and server stream data (`SayHellosBidirectional`)

## Implementation Details

- Uses `nice-grpc` for a modern, Promise-based API
- Implements middleware for logging and validation
- Handles graceful shutdown
- Demonstrates proper error handling
- Uses TypeScript for type safety

## License

MIT
