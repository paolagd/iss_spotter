//It will contain most of the logic for fetching the data from each API endpoint.
const request = require('request');
/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function (callback) {
  // use request to fetch IP address from JSON API
  request("https://api.ipify.org/?format=json", function (error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body);
    callback(null, data.ip); 
  });
}

// It should take in two arguments: ip (string) and callback
// Add the function to the object properties being exported from iss.js
// For now, it can have an empty body and do nothing

const fetchCoordsByIP = function (ipAddress, callback) {

  const URL = `https://freegeoip.app/json/${ipAddress}`;
  request(URL, function (error, response, body) {

    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }
    
    
    const { latitude, longitude } = JSON.parse(body);
    const exampleCoords = { latitude: '49.27670', longitude: '-123.13000' }; //using the following coordinates since the server is down
    callback(null,exampleCoords) 
   
  });
}


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
 const fetchISSFlyOverTimes = function(coords, callback) {
  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  // console.log(url)

  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    //COMMENTED CODE SINCE SERVER IS DOWN
    // if (response.statusCode !== 200) {
    //   callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
    //   return;
    // }

    //const passes = JSON.parse(body).response;
    const dummyPasses =  [
      { duration: 488, risetime: 1630061667 },
      { duration: 644, risetime: 1630067356 },
      { duration: 658, risetime: 1630073156 },
      { duration: 658, risetime: 1630078980 },
      { duration: 651, risetime: 1630084794 }
    ];    
    //using dummyPasses since server is down
    callback(null, dummyPasses);
  });
};
 

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
}


module.exports = { nextISSTimesForMyLocation };