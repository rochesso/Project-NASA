As this project uses the mongodb database, you need to configure the MONGO_URL using your own connection string.

MONGO_URL can be defined inside /src/services/mongo.js or using the .env file.

You can create a server/.env file with an MONGO_URL property set to your own mongodb database connection string.

Inside the server/.env you can define a PORT property as well to be used by the server.
