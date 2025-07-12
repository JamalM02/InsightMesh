# Dockerfile for grpc-events
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy service code
COPY . .

# Set environment if needed
ENV NODE_ENV=production

# Start the service
CMD ["node", "dist/main.js"]
