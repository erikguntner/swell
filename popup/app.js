// Declare class variables
const forecast = new Forecast();
const ui = new UI();
const weather = new Weather();
const storage = new Storage();

const form = document.querySelector('form');
const submit = document.querySelector('#submit');
const forecastsList = document.getElementById('forecastsList');
const spotId = document.getElementById('spot_id');
const name = document.getElementById('name');
const locationData = JSON.parse(localStorage.getItem('locationData')) || [];
const city = 'los angeles';
const state = 'ca';



// State of display styling for toggleForecast event
let toggled = false;

//Load all event Listener
loadEventListeners(); // locationData
retrieveDataFromLS();



// weather.getWeather(city, state)
//     .then(results => {console.log(results)})
//     .catch(err => {console.log(err)});


// Add Forecast To DOM
function addForecast(e){
    // const spotId = document.getElementById('spot_id');
    // const name = document.getElementById('name');

    forecast.getSpot(spotId.value)
        .then(data => {
            //Check if error message from API
            if(data.forecast.error_response || name.value === '') {
                console.log("There was an Error");
            } else {
                // Create object to store in local storage
                const surfSpot = {
                    "spotId": spotId.value,
                    "name": name.value
                };
                // Push data in to array for LS
                locationData.push(surfSpot);
                
                // Create HTML in DOM
                populateForecastList(name.value, data);
                
                //Set the items in local storage
                localStorage.setItem('locationData', JSON.stringify(locationData));

                //Reset the form
                form.reset();
            } 
        }); 

    e.preventDefault();          
};


function populateForecastList(name, data) {
    //Loop through object containing forecasts
    for(item in data.forecast) {
        const spot = data.forecast[item],
              date = new Date(spot.localTimestamp*1000),
              hrs = checkHour(date.getHours()),
              day = date.getDate(),
              month = date.getMonth() + 1,
              fadedStarRating = spot.fadedRating,
              solidStarRating = spot.solidRating, 
              stars = ui.createStarRating(solidStarRating, fadedStarRating);

        // Load first forecast to the DOM including a container with forecast and spot information
        if(item ==='0') {
            let forecast = ``;
            if(spot.swell.components.secondary){
                forecast = `
                <div class="forecast" id="forecasts">
                    <div class="forecast__container">
                        <div class="forecast__title">
                            <div class="forecast__title--name">${name}</div>
                        </div>
                        <div class="forecast__heading">
                            <div class="forecast__heading--surf">Surf</div>
                            <div class="forecast__heading--rating">Rating</div>
                            <div class="forecast__heading--pswell">Primary Swell</div>
                            <div class="forecast__heading--sswell">Secondary Swell</div>
                            <div class="forecast__heading--wind">Wind</div>
                            <div class="forecast__heading--weather">Weather</div>
                        </div>
                        <div class="forecast__info">
                            <div class="date">${hrs} ${month}/${day}</div>
                            <div class="swell-size">${spot.swell.minBreakingHeight}-${spot.swell.maxBreakingHeight}${spot.swell.unit}</div>
                            <div class="rating">${stars}</div>
                            <div class="pswell-size">${spot.swell.components.primary.height}ft</div>
                            <div class="pswell-period">${spot.swell.components.primary.period}s</div>
                            <div class="pswell-direction">
                                <div class="icon msw-swa msw-swa-${round5(spot.swell.components.primary.direction)}"></div>
                            </div>
                            <div class="secswell-size">${spot.swell.components.secondary.height}ft</div>
                            <div class="secswell-period">${spot.swell.components.secondary.period}s</div>
                            <div class="secswell-direction">
                                <div class="icon msw-swa msw-swa-${round5(spot.swell.components.secondary.direction)}"></div>
                            </div>
                            <div class="wind">${spot.wind.speed}<span>mph</span></div>
                            <div class="wind-direction">
                                <div class="icon msw-ssa msw-ssa-${round5(spot.wind.direction)}"></div>
                            </div>
                            <div class="weather-symbol">
                                <img src="http://cdnimages.magicseaweed.com/30x30/${spot.condition.weather}.png" class="weather-icon">
                            </div>
                            <div class="weather-condition">${spot.condition.temperature}${spot.condition.unit}</div>
                        </div>
                        <div class="forecast__expand">
                            &or; View More &or;
                        </div>
                    </div>
                    <div class="forecast__extended" id="extended">
                    </div>
                </div>
                `;
            } else {
                forecast = `
                <div class="forecast" id="forecasts">
                    <div class="forecast__container">
                        <div class="forecast__title">
                            <div class="forecast__title--name">${name}</div>
                        </div>
                        <div class="forecast__heading">
                            <div class="forecast__heading--surf">Surf</div>
                            <div class="forecast__heading--rating">Rating</div>
                            <div class="forecast__heading--pswell">Primary Swell</div>
                            <div class="forecast__heading--sswell">Secondary Swell</div>
                            <div class="forecast__heading--wind">Wind</div>
                            <div class="forecast__heading--weather">Weather</div>
                        </div>
                        <div class="forecast__info">
                            <div class="date">${hrs} ${month}/${day}</div>
                            <div class="swell-size">${spot.swell.minBreakingHeight}-${spot.swell.maxBreakingHeight}${spot.swell.unit}</div>
                            <div class="rating">${stars}</div>
                            <div class="pswell-size">${spot.swell.components.primary.height}ft</div>
                            <div class="pswell-period">${spot.swell.components.primary.period}s</div>
                            <div class="pswell-direction">
                                <div class="icon msw-swa msw-swa-${round5(spot.swell.components.primary.direction)}"></div>
                            </div>
                            <div class="secswell-size"></div>
                            <div class="secswell-period"></div>
                            <div class="secswell-direction">
                            </div>
                            <div class="wind">${spot.wind.speed}<span>mph</span></div>
                            <div class="wind-direction">
                                <div class="icon msw-ssa msw-ssa-${round5(spot.wind.direction)}"></div>
                            </div>
                            <div class="weather-symbol">
                                <img src="http://cdnimages.magicseaweed.com/30x30/${spot.condition.weather}.png" class="weather-icon">
                            </div>
                            <div class="weather-condition">${spot.condition.temperature}${spot.condition.unit}</div>
                        </div>
                        <div class="forecast__expand">
                            &or; View More &or;
                        </div>
                    </div>
                    <div class="forecast__extended" id="extended">
                    </div>
                </div>
                `;
            }
            
            // Add to the list if the list is empty
            if(forecastsList.innerHTML === '') {
                forecastsList.insertAdjacentHTML('afterbegin', forecast);
            } else {
                // If the list is not empty add the forecast element to below existing elements
                forecastsList.insertAdjacentHTML('beforeend', forecast);                            
            }

        } else {
            // Create an empty forecast variable
            let forecast = ``;
            //Check to see if there is a secondary swell and if there is add this chunk of html
            if(spot.swell.components.secondary){
                forecast = `<div class="forecast__info">
                                <div class="date">${hrs} ${month}/${day}</div>
                                <div class="swell-size">${spot.swell.minBreakingHeight}-${spot.swell.maxBreakingHeight}${spot.swell.unit}</div>
                                <div class="rating">${stars}</div>
                                <div class="pswell-size">${spot.swell.components.primary.height}ft</div>
                                <div class="pswell-period">${spot.swell.components.primary.period}s</div>
                                <div class="pswell-direction">
                                    <div class="icon msw-swa msw-swa-${round5(spot.swell.components.primary.direction)}"></div>
                                </div>
                                <div class="secswell-size">${spot.swell.components.secondary.height}ft</div>
                                <div class="secswell-period">${spot.swell.components.secondary.period}s</div>
                                <div class="secswell-direction">
                                    <div class="icon msw-swa msw-swa-${round5(spot.swell.components.secondary.direction)}"></div>
                                </div>
                                <div class="wind">${spot.wind.speed}<span>mph</span></div>
                                <div class="wind-direction">
                                    <div class="icon msw-ssa msw-ssa-${round5(spot.wind.direction)}"></div>
                                </div>
                                <div class="weather-symbol">
                                    <img src="http://cdnimages.magicseaweed.com/30x30/${spot.condition.weather}.png" class="weather-icon">
                                </div>
                                <div class="weather-condition">${spot.condition.temperature}${spot.condition.unit}</div>
                            </div>`
            } else {
                // If there is no secondary swell leaves areas empty to avoid an error
                forecast = `<div class="forecast__info">
                                <div class="date">${hrs} ${month}/${day}</div>
                                <div class="swell-size">${spot.swell.minBreakingHeight}-${spot.swell.maxBreakingHeight}${spot.swell.unit}</div>
                                <div class="rating">${stars}</div>
                                <div class="pswell-size">${spot.swell.components.primary.height}ft</div>
                                <div class="pswell-period">${spot.swell.components.primary.period}s</div>
                                <div class="pswell-direction">
                                    <div class="icon msw-swa msw-swa-${round5(spot.swell.components.primary.direction)}"></div>
                                </div>
                                <div class="secswell-size"></div>
                                <div class="secswell-period"></div>
                                <div class="secswell-direction">
                                </div>
                                <div class="wind">${spot.wind.speed}<span>mph</span></div>
                                <div class="wind-direction">
                                    <div class="icon msw-ssa msw-ssa-${round5(spot.wind.direction)}"></div>
                                </div>
                                <div class="weather-symbol">
                                    <img src="http://cdnimages.magicseaweed.com/30x30/${spot.condition.weather}.png" class="weather-icon">
                                </div>
                                <div class="weather-condition">${spot.condition.temperature}${spot.condition.unit}</div>
                            </div>`
            }
            
            // Select all forecast elements in the forecast list
            let forecasts = forecastsList.querySelectorAll('.forecast');
            // Create an array of exisitng forecast elements
            let forecastsArr = Array.from(forecasts);
            //Add the forecast to the last array item's forecast__extended element
            forecastsArr[forecastsArr.length - 1].lastElementChild.innerHTML += forecast;
        }
        
        // Change the background color of the wind icons
        let windSpeeds = document.querySelectorAll('.wind');
        windSpeeds.forEach(windSpeed => ui.windSpeedColor(windSpeed));
    }
}

function retrieveDataFromLS(){
    locationData.forEach(location => {
        forecast.getSpot(location.spotId)
            .then(data => {
                populateForecastList(location.name, data);
            }) ;
    });
}

// function to round wind and swell arrows to the nearest 5
function round5(x)
{
    return Math.ceil(x/5)*5;
}

// Check whether it is am or pm
function checkHour(hour) {
    let hh = hour - 1;
    if(hh > 12) {
        hh = hh - 12
        return `${hh}pm`;
    }
    if(hh == 0) {
        hh = 12;
        return `${hh}am`;
    }
     else {
         return `${hh}am`;
     }
}


function loadEventListeners() {
    forecastsList.addEventListener('click', toggleForecast);
}


//Remove each forecast from the forecast list
function removeSpot(e) {
    if(e.target.classList.contains('forecast__delete')) {
        //select the parent element with class of forecast
        e.target.parentNode.parentNode.parentNode.parentNode.remove();

        // selest the name submitted for the spot to locate index in local storage
        removeFromLocalStorage(e.target.parentElement.previousSibling.previousSibling.textContent);
    }
}

// Toggle the extended forecast open and closed
function toggleForecast(e) {
    if(e.target.classList.contains('forecast__expand')){
        if(toggled === false) {
            e.target.parentNode.nextElementSibling.style.display = "inline";
            e.target.innerHTML = "&and; View Less &and;"
            toggled = true;
        }
        else if(toggled === true) {
            e.target.parentNode.nextElementSibling.style.display = "none";
            e.target.innerHTML = "&or; View More &or;"            
            toggled = false;
        }
    }
}

function removeFromLocalStorage(name) {
    locationData.forEach((location, i) => {
        if(location.name === name) {
            locationData.splice(i, 1);
        }
    });

    localStorage.setItem('locationData', JSON.stringify(locationData));
}