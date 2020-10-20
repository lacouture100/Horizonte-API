//Required node packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;

const moment = require("moment"); //include the moment package
const sunCalc = require("suncalc");

// NYC coords 
var nyclat = 40.69;
var nyclong = -73.98;

// Response in this format: 2020-03-05T09:23:03-05:00
let logTime = moment().format().toString();

//__dirname is the absolute path of the directory containing the currently executing file.
const indexPath = path.join(__dirname, 'views/index.html');

//define express inside of a variable
const app = express();

//define my static server files directory, in this case the 'public' folder
app.use(express.static(__dirname + '/public'));
//It parses incoming and outgoing requests with JSON payloads(it means it converts them into JSON-formatted text)
app.use(express.json());
//a '/' request will send you to the index.html file
app.get('/', (req, res) => res.sendFile(indexPath))


    // Get suncalc times
    var times = sunCalc.getTimes(new Date(), nyclat, nyclong);

    var sunrise              = convertToTimeFormat(times.sunrise.getHours()) + ':' + convertToTimeFormat(times.sunrise.getMinutes()) + ":00";
    var sunriseEnd           = convertToTimeFormat(times.sunriseEnd.getHours()) + ':' + convertToTimeFormat(times.sunriseEnd.getMinutes()) + ":00";
    var morningGoldenHourEnd = convertToTimeFormat(times.goldenHourEnd.getHours()) + ':' + convertToTimeFormat(times.goldenHourEnd.getMinutes()) + ":00";
    var solarNoon            = convertToTimeFormat(times.solarNoon.getHours()) + ':' + convertToTimeFormat(times.solarNoon.getMinutes()) + ":00";
    var goldenHour           = convertToTimeFormat(times.goldenHour.getHours()) + ':' + convertToTimeFormat(times.goldenHour.getMinutes()) + ":00";
    var sunsetStart          = convertToTimeFormat(times.sunsetStart.getHours()) + ':' + convertToTimeFormat(times.sunsetStart.getMinutes()) + ":00";
    var sunset               = convertToTimeFormat(times.sunset.getHours()) + ':' + convertToTimeFormat(times.sunset.getMinutes()) + ":00";
    var dusk                 = convertToTimeFormat(times.dusk.getHours()) + ':' + convertToTimeFormat(times.dusk.getMinutes()) + ":00";
    var night                = convertToTimeFormat(times.night.getHours()) + ':' + convertToTimeFormat(times.night.getMinutes()) + ":00";
    var nadir                = convertToTimeFormat(times.nadir.getHours()) + ':' + convertToTimeFormat(times.nadir.getMinutes()) + ":00";
    var nightEnd             = convertToTimeFormat(times.nightEnd.getHours()) + ':' + convertToTimeFormat(times.nightEnd.getMinutes()) + ":00";
    var nauticalDawn         = convertToTimeFormat(times.nauticalDawn.getHours()) + ':' + convertToTimeFormat(times.nauticalDawn.getMinutes()) + ":00";
    var dawn                 = convertToTimeFormat(times.dawn.getHours()) + ':' + convertToTimeFormat(times.dawn.getMinutes()) + ":00";


    function convertToTimeFormat(time){
        if(time.toString().length ==1){
            let str = "0";
            let result = str.concat(time);
            return result;
        }
        else{
            let result = time.toString();
            return result;
        }    
    }

function getTimes(lat, long) {
    //Read our sunEvents in order to update the data on each request.
    const sunEventsJSON = fs.readFileSync(path.join(__dirname, '/data/sunTimesData.json'));
    //parse our JSON
    const sunEvents = JSON.parse(sunEventsJSON);
    // Set the updated values
    sunEvents.dawn.time.format = dawn;
    sunEvents.sunrise.time.format = sunriseEnd;
    sunEvents.sunriseEnd.time.format = sunriseEnd;
    sunEvents.morningGoldenHourEnd.time.format = morningGoldenHourEnd;
    sunEvents.solarNoon.time.format = solarNoon;
    sunEvents.goldenHour.time.format = goldenHour;
    sunEvents.sunsetStart.time.format = sunsetStart;
    sunEvents.sunset.time.format = sunset;
    sunEvents.dusk.time.format = dusk;
    sunEvents.night.time.format = night;
    sunEvents.nadir.time.format = nadir;
    sunEvents.nightEnd.time.format = nightEnd;
    sunEvents.nauticalDawn.time.format = nauticalDawn;


     // Set the updated values
     sunEvents.dawn.time.ms = stringToMillis(dawn);
     sunEvents.sunrise.time.ms = stringToMillis(sunriseEnd);
     sunEvents.sunriseEnd.time.ms = stringToMillis(sunriseEnd);
     sunEvents.morningGoldenHourEnd.time.ms = stringToMillis(morningGoldenHourEnd);
     sunEvents.solarNoon.time.ms = stringToMillis(solarNoon);
     sunEvents.goldenHour.time.ms = stringToMillis(goldenHour);
     sunEvents.sunsetStart.time.ms = stringToMillis(sunsetStart);
     sunEvents.sunset.time.ms = stringToMillis(sunset);
     sunEvents.dusk.time.ms = stringToMillis(dusk);
     sunEvents.night.time.ms = stringToMillis(night);
     sunEvents.nadir.time.ms = stringToMillis(nadir);
     sunEvents.nightEnd.time.ms = stringToMillis(nightEnd);
     sunEvents.nauticalDawn.time.ms = stringToMillis(nauticalDawn);

  
    
    writeToJSON(sunEvents)

    return sunEvents;
}

function writeToJSON(data) {
    fs.writeFileSync(path.join(__dirname, '/data/sunTimesData.json'), JSON.stringify(data));
}

//Express GET request
app.get("/sun", (req, res) => {
    //read from the toppings json
    const sunEvents = getTimes(40,-73);
    console.log(`Received request for Sun times: ${req}`);
    // Updated list will be returned by API
    res.json(sunEvents);
});


//Express GET request
app.get("/now", (req, res) => {
    //read from the toppings json

    console.log(`Received request for what time it is: ${req}`);
    // Updated list will be returned by API
    res.json(currentTimeOfDayInMillis());
    timePixelRatio();
});


function stringToMillis(time){
    // Time enters in a HH:MM:SS format, and exits as amount of milliseconds which have passed since midnight, or 00:00:00
    let hours = parseInt(time.slice(0,2))
    //console.log(`Hours: ${hours}`)
    let minutes = parseInt(time.slice(3,5))
    //console.log(`Minutes: ${minutes}`)
    let seconds = parseInt(time.slice(6,8))
    //console.log(`Seconds: ${seconds}`)
    // Current hour * 60 minutes per hour * 60 seconds per minute * 1000 milliseconds per minute.
    let hoursInMillis = hours * 60 * 60 * 1000;
    // Current hour * 60 seconds per minute * 1000 milliseconds per minute.
    let minutesInMillis = minutes * 60 * 1000;
    // Current hour * 1000 milliseconds per minute.
    let secondsInMillis = seconds * 1000;
    let TimeInMillis = hoursInMillis + minutesInMillis + secondsInMillis;
    return TimeInMillis;
}
//2020-10-11T00:16:21.603Z

function currentTimeGMT(GMT = 0){
    const utcTime = new Date(Date.now()).toUTCString();
    //let cleanTime = utcDate.slice(17,25);
    //let cleanTime = "19:37:00";
    console.log(`UTC Date              : ${utcTime}`);
    let GMTchangeInMillis = GMT * 60 * 60 * 1000;
    let currentTimeInMillis = stringToMillis(utcTime) + GMTchangeInMillis;
    console.log(`CurrentTime           : ${utcTime} | ${currentTimeOfDayInMillis()}`);

    return currentTimeInMillis;
    
}

//Receive GMT from cellphone const utcDate1 = new Date(Date.now());
function timePixelRatio( ){

  //currentTime in milliseconds
  let currentTimeInMillis = currentTimeGMT(0);
  

  // totalDayTime in milliseconds
  // startTime
  let dawnTime = dawn;
  // Endtime
  let nightTime = night;
  let totalDayTime = stringToMillis(nightTime) - stringToMillis(dawnTime);

  let timeLeft = stringToMillis(nightTime) - currentTimeOfDayInMillis();

  console.log(`Dawn Time          : ${dawnTime} | ${stringToMillis(dawnTime)}`);
  console.log(`Night Time            : ${nightTime} | ${stringToMillis(nightTime)}`);

  console.log(`Total Day Time        : ${totalDayTime}`);
  console.log(`Time until night      : ${timeLeft}`)

  var numberOfPixels = 144;
  var millisPerPixel = Math.floor(totalDayTime/numberOfPixels);
  var currentPixel = Math.floor((currentTimeOfDayInMillis()- stringToMillis(dawnTime))/millisPerPixel);

  
  console.log(`Time per pixel        : ${millisPerPixel}`);
  console.log(`Current Pixel         : ${currentPixel}`);

  console.log(`Night End             : ${nightEnd} | ${stringToMillis(nightEnd)}  `)
  console.log(`Nautical Dawn         : ${nauticalDawn} | ${stringToMillis(nauticalDawn)} `)
  console.log(`Dawn                  : ${dawn} | ${stringToMillis(dawn)} | Pixel No. ${Math.floor((stringToMillis(dawn)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Sunrise               : ${sunrise} | ${stringToMillis(sunrise)} | Pixel No. ${Math.floor((stringToMillis(sunrise)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Sunrise End           : ${sunriseEnd} | ${stringToMillis(sunriseEnd)} | Pixel No. ${Math.floor((stringToMillis(sunriseEnd)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Golden Hour End       : ${morningGoldenHourEnd} | ${stringToMillis(morningGoldenHourEnd)} | Pixel No. ${Math.floor((stringToMillis(morningGoldenHourEnd)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Solar Noon            : ${solarNoon} | ${stringToMillis(solarNoon)} | Pixel No. ${Math.floor((stringToMillis(solarNoon)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Golden Hour           : ${goldenHour} | ${stringToMillis(goldenHour)} | Pixel No. ${Math.floor((stringToMillis(goldenHour)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Sunset Start          : ${sunsetStart} | ${stringToMillis(sunsetStart)} | Pixel No. ${Math.floor((stringToMillis(sunsetStart)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Sunset                : ${sunset} | ${stringToMillis(sunset)} | Pixel No. ${Math.floor((stringToMillis(sunset)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Dusk                  : ${dusk} | ${stringToMillis(dusk)} | Pixel No. ${Math.floor((stringToMillis(dusk)- stringToMillis(dawnTime))/millisPerPixel)}`)
  console.log(`Night                 : ${night} | ${stringToMillis(night)} | Pixel No. ${Math.floor((stringToMillis(night)- stringToMillis(dawnTime))/millisPerPixel)}`)
  //console.log(`Nadir                 : ${nadir} | ${stringToMillis(nadir)} `)


}

function currentGMTTimeInMillis(){
    const utcDate = new Date(Date.now());
    const utcDateInMillis = Date.now();
    const timezoneOffset = utcDate.getTimezoneOffset();
    const GMTchangeInMillis = (timezoneOffset * -1) * 60 * 1000;
    const currentTimeInMillis = utcDateInMillis + GMTchangeInMillis;
    return currentTimeInMillis;
}

/*https://stackoverflow.com/questions/10944396/how-to-calculate-ms-since-midnight-in-javascript*/
function currentTimeOfDayInMillis(){
    var now = new Date(),
    then = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,0,0),
    diff = now.getTime() - then.getTime();
    return diff;
}


timePixelRatio();
//Open the PORT
app.listen(PORT, () => console.log(`Server app listening on PORT ${PORT}!`))
getTimes()


