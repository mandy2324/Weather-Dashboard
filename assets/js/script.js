var apiKey = "9d967b939b0daea559d9c5678e1a233e";
var city = "cary";

var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

fetch(url)
    .then(function(response) {
        console.log(response);
        return response.json();
    })
    .then(function(fall) {
        console.log(fall);
        console.log(fall.weather[0].description);

    })