FROM node:20.9.0-alpine3.18 As development

LABEL "server"="Server-api-fenix-ventures"
LABEL maintainer="joseagraz29@gmail.com"
LABEL version="1.0"

RUN apk add nano
RUN apk add openssl

WORKDIR /app
COPY package.json /app/
WORKDIR /app/src/auths/certs/
RUN openssl genrsa -out jwt-private.key 2048 && openssl rsa -in jwt-private.key -pubout -out jwt-public.key
WORKDIR /app
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start:dev"]
