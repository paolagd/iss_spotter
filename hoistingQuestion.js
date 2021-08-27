const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then(passTimes => printTime(passTimes)); // it wont work if i use the shorter syntax printTime

const printTime = function (times) {
  for (const pass of times) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`)
  }
}


