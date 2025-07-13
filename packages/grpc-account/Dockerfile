
# Use Node.js as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Compile proto files (assumes scripts.generate exists in package.json)
RUN npm run build || true
RUN npm run generate || true

# Expose gRPC port
EXPOSE 50053

# Run the gRPC server
CMD [ "npm", "start" ]
