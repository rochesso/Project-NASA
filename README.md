As this project uses the mongodb database, you need to configure the MONGO_URL using your own mongodb connection string.
It can be a local database or MongoDB Atlas.

MONGO_URL can be defined inside '/server/src/services/mongo.js' or using a '.env' file that you can create inside '/server/.env'.

To install the project run the following commands from the main directory:

- npm run install
- npm run client-build

To start the server:

- npm run server

to run the tests:

- npm run test

If you want to run the server using https follow the next steps:
-- Creating a Self-Signed Certificate With OpenSSL --

Install https://gitforwindows.org/ and use the command inside GIT Bash

code: openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes

You can also add -nodes (short for "no DES") if you don't want to protect your private key with a passphrase. Otherwise it will prompt you for "at least a 4 character" password.

Credits:
https://www.udemy.com/course/complete-nodejs-developer-zero-to-mastery/
