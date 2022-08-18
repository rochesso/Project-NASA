const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planetsCollection = require('./planets.mongo');

function isHabitablePlanet(planet) {
  return (
    planet['koi_disposition'] === 'CONFIRMED' &&
    planet['koi_insol'] > 0.36 &&
    planet['koi_insol'] < 1.11 &&
    planet['koi_prad'] < 1.6
  );
}

// Using Promise so the function can be called with await before the server starts
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../../data/kepler_data.csv'))
      .pipe(
        parse({
          comment: '#',
          columns: true,
        })
      )
      .on('data', async data => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on('error', err => {
        console.log(err);
        reject(err);
      })
      .on('end', async () => {
        const planetsFound = (await getAllPlanets()).length;
        console.log(`Habitable exoplanets found: ${planetsFound}`);
        resolve();
      });
  });
}

const getAllPlanets = async () => {
  return await planetsCollection.find({}, { _id: 0, __v: 0 });
};

const savePlanet = async planet => {
  try {
    await planetsCollection.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Could not save planet - Error: ${error}`);
  }
};
module.exports = {
  getAllPlanets,
  loadPlanetsData,
};
