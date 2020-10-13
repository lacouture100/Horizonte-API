//My API endpoint
const url = '/sun'


// NYC coords 
var lat = 40.69;
var long = -73.98;

var sunrise;
var sunriseEnd;
var morningGoldenHourEnd;
var solarNoon;
var goldenHour;
var sunsetStart;
var sunset;
var dusk;
var night;
var nadir;
var nightEnd;
var nauticalDawn;
var dawn;

var times = [sunrise, sunriseEnd, morningGoldenHourEnd, solarNoon, goldenHour, sunsetStart, sunset, dusk, night, nadir, nightEnd, nauticalDawn, dawn]

let fromColor;
let toColor;

  let topPicker;
  let bottomPicker;

async function fetchData() {
  await fetch(url)
    .then(response => {
      return response.json()
    })
    .then(result => {

      sunrise = result.sunrise;
      sunriseEnd = result.sunriseEnd;
      morningGoldenHourEnd = result.morningGoldenHourEnd;
      solarNoon = result.solarNoon;
      goldenHour = result.goldenHour;
      sunsetStart = result.sunsetStart;
      sunset = result.sunset;
      dusk = result.dusk;
      night = result.night;
      nadir = result.nadir;
      nightEnd = result.nightEnd;
      nauticalDawn = result.nauticalDawn;
      dawn = result.dawn;

      console.log(sunrise.time);
    })

}



async function setup() {
  createCanvas(windowWidth, windowHeight);
  await fetchData();


  let initialX = 20;
  let initialY = 300;
  timeColorSelector(0,"Night ", nightEnd, 0, 0) 

  text(`Night ends at ${nightEnd.time.format}`, initialX, initialY + 20 * 10);
  text(`Nautical Dawn is at ${nauticalDawn.time.format}`, initialX, initialY + 20 * 11);
  text(`Dawn is at ${dawn.time.format}`, initialX, initialY + 20 * 12);
  text(`Sunrise is at ${sunrise.time.format}`, initialX, initialY);
  text(`Sunrise ends at ${sunriseEnd.time.format}`, initialX, initialY + 20 * 1);
  text(`Morning Golden Hour ends at ${morningGoldenHourEnd.time.format}`, initialX, initialY + 20 * 2);
  text(`Solar Noon is at ${solarNoon.time.format}`, initialX, initialY + 20 * 3);
  text(`Golden Hour is at ${goldenHour.time.format}`, initialX, initialY + 20 * 4);
  text(`Sunset Starts at ${sunsetStart.time.format}`, initialX, initialY + 20 * 5);
  text(`Sunset is at ${sunset.time.format}`, initialX, initialY + 20 * 6);
  text(`Dusk is at ${dusk.time.format}`, initialX, initialY + 20 * 7);
  text(`Nightime is at ${night.time.format}`, initialX, initialY + 20 * 8);
  text(`Nadir is at ${nadir.time.format}`, initialX, initialY + 20 * 9);


  /*
      sunrise = result.sunrise;
      sunriseEnd = result.sunriseEnd;
      morningGoldenHourEnd = result.morningGoldenHourEnd;
      solarNoon = result.solarNoon;
      goldenHour = result.goldenHour;
      sunsetStart = result.sunsetStart;
      sunset = result.sunset;
      dusk = result.dusk;
      night = result.night;
      nadir = result.nadir;
      nightEnd = result.nightEnd;
      nauticalDawn = result.nauticalDawn;
      dawn = result.dawn;
*/
}


function timeColorSelector(index,timeName, time, initialX, initialY, leftOffset = 20) {
  text(`${timeName} is at ${time.time.format}`, initialX+leftOffset, initialY + 20 * 10);

  topPicker = createColorPicker(color(255, 0, 0));
  bottomPicker = createColorPicker(color(0, 255, 0));
  topPicker.position(initialX+leftOffset, initialY );
  bottomPicker.position(initialX+leftOffset, initialY  + 25);
  let commonShade = lerpColor(topPicker.color(), bottomPicker.color(), 0.5);
  fill(commonShade);
  //rect(initialX+leftOffset, initialY+leftOffset, 60, 60);
  setGradient(topPicker.color(), bottomPicker.color(),200, 200, 200, 200, 200) 

}

function setGradient(c1, c2, yOffset, leftOffset, bandWidth = width/20 ) {
  // noprotect
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height/3, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(leftOffset, y+yOffset, leftOffset + bandWidth , y+yOffset);
  }
}
function draw() {
}

