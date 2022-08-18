const { getPagination } = require('../../services/query');

const {
  getAllLaunches,
  addNewLaunch,
  abortLaunch,
  existsLaunchWithId,
} = require('../../models/launches.model');

const httpGetAllLaunches = async (req, res) => {
  const { skip, limit } = getPagination(req.query);
  return res.status(200).json(await getAllLaunches(skip, limit));
};

const httpAddNewLaunch = async (req, res) => {
  const launch = req.body;

  // Creates a JavaScript Date instance
  const createdLaunchDate = new Date(launch.launchDate);

  // Validation function for the launch date
  const dateIsValid = date => {
    return date instanceof Date && !isNaN(date);
  };

  // In case of missing required launch property
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({ error: 'Missing required launch property' });
  }
  // In case of invalid launch date
  else if (!dateIsValid(createdLaunchDate)) {
    return res.status(400).json({ error: 'Invalid launch date' });
  }
  // In case of all required launch properties are valid
  else {
    launch.launchDate = createdLaunchDate;
    await addNewLaunch(launch);
    return res.status(201).json(launch);
  }
};

const httpAbortLaunch = async (req, res) => {
  const launchId = Number(req.params.id);
  const existsLaunch = await existsLaunchWithId(launchId);

  if (!existsLaunch) {
    return res.status(404).json({ error: 'Launch not found' });
  }

  const aborted = await abortLaunch(launchId);
  if (aborted) {
    return res.status(200).json(aborted);
  }

  return res.status(404).json({ error: 'Error while aborting launch' });
};

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
};
