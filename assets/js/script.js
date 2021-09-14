var apiKey = "9d967b939b0daea559d9c5678e1a233e";

var cityInfo = document.getElementById('city-info');

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
            $('ul').append("<li>" + cityName + "</li>")
        }
    }
}

$(document).ready(function() {
    loadSearchHistory()



    $('#search-btn').click(function(event) {
        event.preventDefault();
        // console.log(event);
        var cityName = $('#city-name').val();
        console.log(cityName);
        setLocalStorage(cityName);
        loadSearchHistory();
        $('#city-name').val("");


        // var cityName = function() {
        var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +
            "&Appid=" + apiKey;
        console.log(urlCurrent);

        fetch(urlCurrent)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                console.log(data.main.humidity);
                console.log(data.wind)
                console.log(data.main.temp)
                console.log(data.weather[0].icon)
            });


        // }

    })

})

// var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

// var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";