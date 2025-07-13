# File: Dockerfile.account

FROM node:18

WORKDIR /usr/src/app

# Copy everything so node-common is available
COPY . .

# Go to the grpc-account directory
WORKDIR /usr/src/app/packages/grpc-account

RUN npm install --legacy-peer-deps

CMD ["npm", "start"]
