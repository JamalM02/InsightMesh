FROM node:22-alpine3.19

ARG PACKAGE_TOKEN

#ENV GITHUB_TOKEN $GITHUB_TOKEN

WORKDIR /usr/src/app

# Create the .npmrc file with the PACKAGE_TOKEN
RUN echo "//npm.pkg.github.com/:_authToken=${PACKAGE_TOKEN}" >> ~/.npmrc && \
    echo "@coinify-v2:registry=https://npm.pkg.github.com/" >> ~/.npmrc

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build
CMD [ "npm","run", "start:prod" ]