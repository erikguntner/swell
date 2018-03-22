// Declare class variables
const forecast = new Forecast();
const ui = new UI();
const weather = new Weather();

const header = document.querySelector('.header');
const time = document.querySelector('.timeContainer')
const content = document.querySelector('.content');
const form = document.querySelector('.form');
const questionMark = document.querySelector('.form__help');
const infoBox = document.querySelector('.info');
const triangle = document.querySelector('.triangle-down');
const weatherWidget = document.querySelector('.weather-widget');
const weatherForecast = document.querySelector('.weather-widget__forecast');
const submitWeather = document.getElementById('form__weather');
const weatherInput = document.querySelector('.form__input--weather');
const submitForecast = document.querySelector('#submit');
const forecastsList = document.getElementById('forecastsList');
const cityState = document.getElementById('weatherInput');
const spotId = document.getElementById('spot_id');
const name = document.getElementById('name');
const locationData = JSON.parse(localStorage.getItem('locationData')) || [];
const weatherData = JSON.parse(localStorage.getItem('weatherData')) || [];




// State of display styling for toggleForecast event
let toggled = false;

//Load all event Listener
startTime();
loadEventListeners(); // locationData
retrieveDataFromLS();


function getWeather(e) {
    e.preventDefault();
    const cityStateArr = cityState.value.split(', ');
    const city = cityStateArr[0];
    const state = cityStateArr[1];

    weather.getWeather(state, city)
    .then(results => {

        const wuData = {
            state,
            city
        };
        
        if(weatherData === []) {
            weatherData.push(wuData);
        } else {
            weatherData.pop();
            weatherData.push(wuData);
        }

        renderWeather(results);

        localStorage.setItem('weatherData', JSON.stringify(weatherData));

        submitWeather.reset();
    })
    .catch(err => {
        const error = createErrorMessage('Error: Could not find location. Please format as City, State')
        header.insertAdjacentHTML('afterend', error);
        setTimeout(function() {
            header.nextSibling.remove();
        }, 4000);
        
        submitWeather.reset();
    });
}


// Add Forecast To DOM
function addForecast(e){
    forecast.getSpot(spotId.value)
        .then(data => {
            //Check if error message from API
            if(data.forecast.error_response || name.value === '') {
                const error = createErrorMessage('We could not find the location you entered. Please make sure you entered the correct Spot ID and all fields are filled out.')
                content.insertAdjacentHTML('afterbegin', error);
                form.reset();
                setTimeout(function() {
                    content.firstElementChild.remove();
                }, 4000);
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
}


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
            let forecast = `
                <div class="forecast" id="forecasts">
                    <div class="forecast__container">
                        <div class="forecast__title">
                            <div class="forecast__title--name">${name}</div>
                            <div class="forecast__title--remove"><span class="forecast__delete">&#10005;</span></div>
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
                            <div class="pswell-size">${spot.swell.components.primary.height}${spot.swell.unit}</div>
                            <div class="pswell-period">${spot.swell.components.primary.period}s</div>
                            <div class="pswell-direction font-small">
                                <div class="icon msw-swa msw-swa-${round5(spot.swell.components.primary.direction)}"></div>
                                <span class="ml-small">${spot.swell.components.primary.compassDirection}</span>
                            </div>
                            <div class="secswell-size">${spot.swell.components.secondary ? spot.swell.components.secondary.height + `${spot.swell.unit}` : ''}</div>
                            <div class="secswell-period">${spot.swell.components.secondary ? spot.swell.components.secondary.period + 's' : ''}</div>
                            <div class="secswell-direction font-small">
                                <div class="icon msw-swa msw-swa-${spot.swell.components.secondary ? round5(spot.swell.components.secondary.direction) : ''}"></div>
                                <span class="ml-small">${spot.swell.components.secondary ? spot.swell.components.secondary.compassDirection : ''}</span>
                            </div>
                            <div class="wind">${spot.wind.speed}${spot.wind.unit}</div>
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
            
            // Add to the list if the list is empty
            if(forecastsList.innerHTML === '') {
                forecastsList.insertAdjacentHTML('afterbegin', forecast);
            } else {
                // If the list is not empty add the forecast element to below existing elements
                forecastsList.insertAdjacentHTML('beforeend', forecast);                            
            }

        } else {
            let forecast = 
                `<div class="forecast__info">
                    <div class="date">${hrs} ${month}/${day}</div>
                    <div class="swell-size">${spot.swell.minBreakingHeight}-${spot.swell.maxBreakingHeight}${spot.swell.unit}</div>
                    <div class="rating">${stars}</div>
                    <div class="pswell-size">${spot.swell.components.primary.height}${spot.swell.unit}</div>
                    <div class="pswell-period">${spot.swell.components.primary.period}s</div>
                    <div class="pswell-direction font-small">
                        <div class="icon msw-swa msw-swa-${round5(spot.swell.components.primary.direction)}"></div>
                        <span class="ml-small">${spot.swell.components.primary.compassDirection}</span>
                    </div>
                    <div class="secswell-size">${spot.swell.components.secondary ? spot.swell.components.secondary.height + `${spot.swell.unit}` : ''}</div>
                    <div class="secswell-period">${spot.swell.components.secondary ? spot.swell.components.secondary.period + 's' : ''}</div>
                    <div class="secswell-direction font-small">
                        <div class="icon msw-swa msw-swa-${spot.swell.components.secondary ? round5(spot.swell.components.secondary.direction) : ''}"></div>
                        <span class="ml-small">${spot.swell.components.secondary ? spot.swell.components.secondary.compassDirection : ''}</span>
                    </div>
                    <div class="wind">${spot.wind.speed}${spot.wind.unit}</div>
                    <div class="wind-direction">
                        <div class="icon msw-ssa msw-ssa-${round5(spot.wind.direction)}"></div>
                    </div>
                    <div class="weather-symbol">
                        <img src="http://cdnimages.magicseaweed.com/30x30/${spot.condition.weather}.png" class="weather-icon">
                    </div>
                    <div class="weather-condition">${spot.condition.temperature}${spot.condition.unit}</div>
                </div>`
            
            // Select all forecast elements in the forecast list
            let forecasts = forecastsList.querySelectorAll('.forecast');
            // Create an array of exisitng forecast elements
            let forecastsArr = Array.from(forecasts);
            //Add the forecast to the last array item's forecast__extended element
            forecastsArr[forecastsArr.length - 1].lastElementChild.innerHTML += forecast;
        }
        
        // Change the background color of the wind icons
        let windSpeeds = document.querySelectorAll('.wind');
        windSpeeds.forEach(windSpeed => {
            ui.windSpeedColor(windSpeed)
        });
    }
}

function renderWeather(data) {
    const iconName = data.icon,
          iconURL = data.icon_url,
          tempF = data.temp_f,
          tempC = data.temp_c,
          location = data.display_location.city;

    currentConditions = `
        <div class="weather-widget__weather">
            <img src="${iconURL}" alt="weather icon"><img>
            <div class="weather-widget__weather--info">
                <div class="weather-widget__weather--info-temp temp-f">${tempF}f</div>
                <div class="weather-widget__weather--info-temp temp-c display-none">${tempC}c</div>
                <div class="weather-widget__weather--info-location">${location}</div>
            </div>
            <i class="material-icons" style="font-size: 15px;">mode_edit</i>
        </div>
    `;
    if(weatherWidget.firstElementChild.innerHTML === '') {
        weatherWidget.firstElementChild.innerHTML = currentConditions; 
    } else {
        weatherWidget.firstElementChild.innerHTML = '';
        weatherWidget.firstElementChild.innerHTML = currentConditions; 
    }
    
    submitWeather.classList.toggle('display-none');
    weatherInput.placeholder = "Change Location";
}

function retrieveDataFromLS(){
    weatherData.forEach(cityState => {
        weather.getWeather(cityState.state, cityState.city)
            .then(results => {
                renderWeather(results);
            });
    });

    locationData.forEach(location => {
        forecast.getSpot(location.spotId)
            .then(data => {
                populateForecastList(location.name, data);
            }) ;
    });
}


// Functions for starting the time 
function startTime() {
    let today = new Date(),
        hrs = today.getHours(),
        mins = today.getMinutes(),
        secs = today.getSeconds(),
        hh = hrs;

    if (hrs > 12) {
        hrs = hh - 12;
    }
    if (hrs == 0) {
        hrs = 12;
    }
    
    mins = checkTime(mins);
    document.getElementById('time').innerHTML = `${hrs}:${mins}`;

    var t = setTimeout(startTime, 500);
}

// function to round wind and swell arrows to the nearest 5
function round5(x)
{
    return Math.ceil(x/5)*5;
}

//Add 0 in front of minutes
function checkTime(i) {
    if (i < 10) {i = `0${i}`};  // add zero in front of numbers < 10
    return i;
}

// Check whether it is am or pm
function checkHour(hour) {
    var hour = hour - 1;
    var amPM = (hour > 11) ? "am" : "pm";
    if(hour > 12) {
      hour -= 12;
    } else if(hour == 0) {
      hour = "12";
    }
    return hour + amPM;
}


function loadEventListeners() {
    submitWeather.addEventListener('submit', getWeather);
    weatherForecast.addEventListener('click', changeUnits);
    weatherForecast.addEventListener('click', toggleChangelocation);    
    submitForecast.addEventListener('click', addForecast);
    forecastsList.addEventListener('click', removeSpot);
    forecastsList.addEventListener('click', toggleForecast);
    questionMark.addEventListener('click', showInformation);
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

// Remove forecast from local storage
function removeFromLocalStorage(name) {
    locationData.forEach((location, i) => {
        if(location.name === name) {
            locationData.splice(i, 1);
        }
    });

    localStorage.setItem('locationData', JSON.stringify(locationData));
}

function showInformation(e) {
    infoBox.classList.toggle('visible');
    triangle.classList.toggle('visible');
}

function changeUnits(e) {
    const tempF = document.querySelector('.temp-f');
    const tempC = document.querySelector('.temp-c');

    if(e.target.classList.contains('weather-widget__weather--info-temp')) {
        tempF.classList.toggle('display-none');
        tempC.classList.toggle('display-none');
    }
}

function toggleChangelocation(e) {
    if(e.target.classList.contains('material-icons')) {
        submitWeather.classList.toggle('display-none');
    }
}

function createErrorMessage(msg) {
    msg =  `<div class="error-message">${msg}</div>`;
    return msg;
}