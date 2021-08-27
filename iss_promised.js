const request = require('request-promise-native');

const fetchMyIP = function () {
  return request("https://api.ipify.org/?format=json");
}

const fetchCoordsByIP = function (body) {

  const IP = JSON.parse(body).ip; 
  const URL = `https://freegeoip.app/json/${IP}`;
  return request(URL);
};


const fetchISSFlyOverTimes = function (coords) {
  const { latitude, longitude } = JSON.parse(coords);
  const url = `https://iss-ass.herokuapp.com/?lat=${latitude}&lon=${longitude}`;

  return request(url);
};



const nextISSTimesForMyLocation = function () {

  return fetchMyIP()
    .then(fetchCoordsByIP) //will resolve always return info?
    //does then automatically receive the resolve part? will reject only execute ina catch?
    .then(fetchISSFlyOverTimes) //when a call is done without arguments it automatically sends the body as a parametter
    .then(data => {
      const { response } = JSON.parse(data);
      return response;
    });
}


// function question(prompt) {
//   return new Promise((resolve, reject) => {
//     const timeout = setTimeout(() => {
//       reject("Took too long to answer")
//     }, 5000)
//     rl.question(prompt, (input) => {
//       clearTimeout(timeout)
//       resolve(input)
//     })
//   })
// }



module.exports = { nextISSTimesForMyLocation };
