//Required node packages
const express = require("express");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 3000;

const moment = require("moment"); //include the moment package
const sunCalc = require("suncalc");

// NYC coords 
var lat = 40.69;
var long = -73.98;

// Response in this format: 2020-03-05T09:23:03-05:00
let logTime = moment().format().toString();

// Get suncalc times
var times = sunCalc.getTimes(new Date(), lat, long);

var sunrise = times.sunrise.getHours() + ':' + times.sunrise.getMinutes();
var sunriseEnd = times.sunriseEnd.getHours() + ':' + times.sunriseEnd.getMinutes();
var morningGoldenHourEnd = times.goldenHourEnd.getHours() + ':' + times.goldenHourEnd.getMinutes();
var solarNoon = times.solarNoon.getHours() + ':' + times.solarNoon.getMinutes();
var goldenHour = times.goldenHour.getHours() + ':' + times.goldenHour.getMinutes();
var sunsetStart = times.goldenHour.getHours() + ':' + times.goldenHour.getMinutes();
var sunset = times.sunset.getHours() + ':' + times.sunset.getMinutes();
var dusk = times.dusk.getHours() + ':' + times.dusk.getMinutes();
var night = times.night.getHours() + ':' + times.night.getMinutes();
var nadir = times.nadir.getHours() + ':' + times.nadir.getMinutes();
var nightEnd = times.nightEnd.getHours() + ':' + times.nightEnd.getMinutes();
var nauticalDawn = times.nauticalDawn.getHours() + ':' + times.nauticalDawn.getMinutes();
var dawn = times.dawn.getHours() + ':' + times.dawn.getMinutes();
var sunPos = sunCalc.getPosition(new Date(), /*Number*/ lat, /*Number*/ long);

console.log(sunPos)


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


function getTimes() {

    //Read our sunEvents in order to update the data on each request.
    const sunEventsJSON = fs.readFileSync(path.join(__dirname, '/data/suncalcData.json'));
    //parse our JSON
    const sunEvents = JSON.parse(sunEventsJSON);
    // Set the updated values
    sunEvents.sunrise.time = sunriseEnd;
    sunEvents.sunriseEnd.time = sunriseEnd;
    sunEvents.morningGoldenHourEnd.time = morningGoldenHourEnd;
    sunEvents.solarNoon.time = solarNoon;
    sunEvents.goldenHour.time = goldenHour;
    sunEvents.sunsetStart.time = sunsetStart;
    sunEvents.sunset.time = sunset;
    sunEvents.dusk.time = dusk;
    sunEvents.night.time = night;
    sunEvents.nadir.time = nadir;
    sunEvents.nightEnd.time = nightEnd;
    sunEvents.nauticalDawn.time = nauticalDawn;
    sunEvents.dawn.time = dawn;

    fs.writeFileSync(path.join(__dirname, '/data/suncalcData.json'), JSON.stringify(sunEvents));
    return sunEvents;
}

//Express GET request
app.get("/sun", (req, res) => {
    //read from the toppings json
    const sunEvents = getTimes();
    console.log(`Received request: ${req}`);
    // Updated list will be returned by API
    res.json(sunEvents);
});

//Open the PORT
app.listen(PORT, () => console.log(`Server app listening on PORT ${PORT}!`))
getTimes()