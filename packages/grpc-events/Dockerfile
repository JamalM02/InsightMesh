# Use a lightweight Node.js image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy dependency declarations and install them
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Compile TypeScript
RUN npm run build


# Start the service
CMD ["node", "dist/main.js"]
