const axios = require('axios');
const { spacexQuery } = require('../services/query');
// Launches collection inside mongodb
const launchesCollection = require('./launches.mongo');

// Will be used to verify that the target of a new launches is
// a habitable planet
const planetsCollection = require('./planets.mongo');

// Default value for the first launch flightNumber
DEFAULT_FLIGHT_NUMBER = 100;

// After the first launch this function will be used to track
// the value of the flightNumber
const getLatestFlightNumber = async () => {
  const latestLaunch = await launchesCollection.findOne().sort('-flightNumber');

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return Number(latestLaunch.flightNumber);
};

// Checks if a launch already exists
const findLaunch = async filter => {
  return await launchesCollection.findOne(filter);
};

const existsLaunchWithId = async launchId => {
  return await findLaunch({
    flightNumber: launchId,
  });
};

// CRUD operations
// Pagination uses a function inside /services/query
const getAllLaunches = async (skip, limit) => {
  return await launchesCollection
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
};

const saveLaunch = async launch => {
  await launchesCollection.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
};

const addNewLaunch = async launch => {
  // Only save the launch if the planet is habitable
  const planet = await planetsCollection.findOne({ keplerName: launch.target });
  // If the planet is not in the database, it will throw an error
  if (!planet) {
    throw new Error(`Could not find the planet: ${launch.target}`);
  }

  // If the planet exists in the database, it will be saved
  const latestFlightNumber = await getLatestFlightNumber();
  launch.flightNumber = latestFlightNumber + 1;
  await saveLaunch(launch);
};

const abortLaunch = async id => {
  const aborted = await launchesCollection
    .findOneAndUpdate(
      { flightNumber: id },
      { upcoming: false, success: false },
      { new: true }
    )
    // Remove these properties from the response
    .select({ _id: 0, __v: 0 });
  return aborted;
};

// SPACEX API ------------------------------------------
const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query';

const populateLaunches = async () => {
  console.log('Downloading launch data...');
  const response = await axios.post(SPACEX_API_URL, spacexQuery);

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap(payload => {
      return payload['customers'];
    });

    const launch = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };
    await saveLaunch(launch);
  }
};

const loadLaunchData = async () => {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat',
  });
  if (firstLaunch) {
    console.log('Launch data already loaded!');
  } else {
    await populateLaunches();
  }
};

module.exports = {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  existsLaunchWithId,
  loadLaunchData,
};
