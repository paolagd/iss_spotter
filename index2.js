const { nextISSTimesForMyLocation } = require('./iss_promised');

//Prints pass times
const printTime = function (times) {
  for (const pass of times) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`)
  }
}

nextISSTimesForMyLocation()
  .then(printTime)  
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });
 