const fs = require('fs');
const path = require('path');
const http = require('http');

require('dotenv-flow').config();

const app = require('./app');

const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, '../../key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '../../cert.pem')),
  },
  app
);

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
