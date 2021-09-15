var apiKey = "9d967b939b0daea559d9c5678e1a233e";

var cityInfo = document.getElementById('city-info');
var forecastInfo = document.getElementById('forecast-info');

// add timezone plugin to day.js library
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function getLocalStorage() {
    var storage = localStorage.getItem("searchHistory") || "[]";
    // console.log(storage);
    var parsedStorage = JSON.parse(storage)
        // console.log(parsedStorage)
    return parsedStorage
}

function setLocalStorage(newCityName) {
    var storedlocalStorage = getLocalStorage()
        // console.log(storedlocalStorage)

    storedlocalStorage.push(newCityName)
        // console.log(storedlocalStorage)
    var stringifiedLocalStorage = JSON.stringify(storedlocalStorage)
        // console.log(stringifiedLocalStorage);
    localStorage.setItem("searchHistory", stringifiedLocalStorage);
}

function loadSearchHistory() {
    $("ul").empty();
    var localStorage = getLocalStorage();
    if (localStorage.length > 0) {
        for (let index = 0; index < localStorage.length; index++) {
            const cityName = localStorage[index];

            $('#search-history').append("<button class='btn btn-sm history-btn' data-name='" + cityName + "'>" + cityName + "</button>")
        }
    }
}

function renderCurrentWeather(city, data, timezone) {
    var date = dayjs().tz(timezone).format('M/D/YYYY');

    console.log(date);

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var title = document.createElement('h2');
    var icon = document.createElement('img');
    var temp = document.createElement('p');
    var wind = document.createElement('p');
    var hum = document.createElement('p');
    var uv = document.createElement('p');
    var uvBadge = document.createElement('button');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    title.setAttribute('class', 'h3 card-title');
    temp.setAttribute('class', 'card-text');
    wind.setAttribute('class', 'card-text');
    hum.setAttribute('class', 'card-text');

    title.textContent = city + "(" + date + ")";
    icon.setAttribute('src', 'https://openweathermap.org/img/w/' + data.weather[0].icon + '.png');
    icon.setAttribute('alt', data.weather[0].description || data[0].main);
    icon.setAttribute('class', 'weather-img');

    title.append(icon);

    temp.textContent = "Temp: " + data.temp + " F";
    wind.textContent = "Wind: " + data.wind_speed + " MPH";
    hum.textContent = "Humidity" + data.humidity + " %";

    cardBody.append(title, temp, wind, hum);

    uv.textContent = "UV Index: ";
    uvBadge.classList.add('btn', 'btn-sm');

    if (data.uvi < 3) {
        uvBadge.classList.add('btn-success');
    } else if (data.uvi < 7) {
        uvBadge.classList.add('btn-warning');
    } else {
        uvBadge.classList.add('btn-danger');
    }

    uvBadge.textContent = data.uvi;
    uv.append(uvBadge);
    cardBody.append(uv);

    cityInfo.innerHTML = "";
    cityInfo.append(card);
}

function renderForecast(data, timezone) {
    var start = dayjs().tz(timezone).add(1, 'day').startOf('day').unix();
    var end = dayjs().tz(timezone).add(6, 'day').startOf('day').unix();

    var wrapper = document.createElement('div');
    var title = document.createElement('h4');

    title.textContent = '5 Day Forecast';
    wrapper.append(title);

    forecastInfo.innerHTML = '';
    forecastInfo.append(wrapper);

    for (var i = 0; i < data.length; i++) {
        if (data[i].dt >= start && data[i].dt < end) {
            renderCard(data[i], timezone);
        }
    }

}

function renderCard(data, timezone) {
    console.log(data, timezone);

    // Create elements for a card
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    // Add content to elements
    cardTitle.textContent = dayjs.unix(data.dt).tz(timezone).format('M/D/YYYY');
    weatherIcon.setAttribute('src', "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
    weatherIcon.setAttribute('alt', data.weather[0].description);
    tempEl.textContent = "Temp: " + data.temp.day + " °F";
    windEl.textContent = "Wind: " + data.wind_speed + " MPH";
    humidityEl.textContent = "Humidity: " + data.humidity + " %";

    forecastInfo.append(col);
}

function getWeatherInfo(location) {
    var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + location.lat + "&lon=" + location.lon + "&units=imperial&exclude=minutely,hourly&appid=" + apiKey;

    fetch(url)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log('weather data:', data);
            renderCurrentWeather(location.name, data.current, data.timezone);
            renderForecast(data.daily, data.timezone);
        })
        .catch(function(err) {
            console.error(err);
        });
}

function getCoordinates(cityName) {
    var coordUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&limit=5&appid=" + apiKey;

    fetch(coordUrl)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log('coord data:', data);
            if (!data[0]) {
                alert("Location not found");
            } else {
                setLocalStorage(cityName);
                getWeatherInfo(data[0]);
            }
        })
        .catch(function(err) {
            console.error(err);
        });
}

function handleSearchFormSubmit(event) {
    event.preventDefault();

    var cityName = $('#city-name').val();
    console.log(cityName);

    loadSearchHistory();
    $('#city-name').val("");

    getCoordinates(cityName);
}

function handleHistoryClick(event) {
    if (event.target.matches('.history-btn')) {
        console.log('found')
        event.preventDefault();

        var cityName = event.target.getAttribute('data-name');

        console.log(cityName);

        getCoordinates(cityName);
    }
}

$(document).ready(function() {
    loadSearchHistory()

    $('#search-btn').click(handleSearchFormSubmit);
    $('#search-history').click(handleHistoryClick);
});

// var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

// var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";