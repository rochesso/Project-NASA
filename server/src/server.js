const http = require("http");

// If you want to use https, uncomment the code below:
// const fs = require('fs');
// const path = require('path');
// const https = require('https');

require("dotenv-flow").config();

const app = require("./app");

const { mongoConnect } = require("./services/mongo");
const { loadPlanetsData } = require("./models/planets.model");
const { loadLaunchData } = require("./models/launches.model");

const PORT = process.env.PORT || 8000;

// If you want to use https, uncomment the code below:
// You will need to create the file key.pem and cert.pem as explained in the readme file.
// const server = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, '../../key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, '../../cert.pem')),
//   },
//   app
// );

const server = http.createServer(app);

// Async to guarantee that the data is loaded before the server starts
const startServer = async () => {
  await mongoConnect();
  await loadPlanetsData();
  await loadLaunchData();

  server.listen(PORT, () => {
    console.log(`Listening on ${PORT}...`);
  });
};

startServer();
