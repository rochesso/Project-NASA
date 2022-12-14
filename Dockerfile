FROM node:lts-alpine

WORKDIR /app

COPY package.json ./

COPY client/package.json client/
RUN npm run install-client --only=production

COPY server/package.json server/
RUN npm run install-server --only=production

COPY client/ client/
RUN npm run client-build

COPY server/ server/

COPY cert.pem ./
COPY key.pem ./

USER node

CMD ["npm", "start","--prefix", "server"]

EXPOSE 443