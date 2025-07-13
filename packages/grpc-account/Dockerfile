# Base Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only grpc-account and node-common
COPY ./packages/grpc-account ./packages/grpc-account
COPY ./packages/node-common ./packages/node-common

# Set working directory to grpc-account
WORKDIR /app/packages/grpc-account

# Install dependencies
RUN npm install --legacy-peer-deps

# Build TypeScript
RUN npm run build

# Expose gRPC port (adjust if needed)
EXPOSE 50053

# Start the service
CMD ["node", "dist/server.js"]
