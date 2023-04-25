# Project Nasa
Final project from the course "Complete NodeJS Developer in 2022 (GraphQL, MongoDB, + more)".

## Initial Configuration
As this project uses the mongodb database, you need to configure the `MONGO_URL` variable using your own mongodb connection string.
It can be a local database or MongoDB Atlas.

`MONGO_URL` can be defined inside `/server/src/services/mongo.js` or using a `.env` file that you can create inside `/server/.env`.

## Installation
To install the project run the following commands:

### Inside the client folder:

- npm install

- npm run build

### Inside the server folder:

- npm install

#### To run the server:

- npm run watch

to run the tests:

- npm run test

## Additional information about https:
If you want to run the server using https follow the next steps:

### -- Creating a Self-Signed Certificate With OpenSSL --

Install https://gitforwindows.org/ and use the command inside GIT Bash
``` bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes
```
You can also add -nodes (short for "no DES") if you don't want to protect your private key with a passphrase. Otherwise it will prompt you for "at least a 4 character" password.

## Credits:
https://www.udemy.com/course/complete-nodejs-developer-zero-to-mastery/
