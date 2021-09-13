var apiKey = "9d967b939b0daea559d9c5678e1a233e";
var searchBtn = document.getElementById('search-btn');
var cityInfo = document.getElementById('city-info');
var cityText = document.getElementById('city-text');

var dataCity = "";

var cityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;


for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
    var cityName = $(".list-group").addClass("list-group-item");

    cityName.append("<li>" + city + "</li>");
}
var keyCount = 0;

searchBtn.click(function() {
    var searchInput = $(".searchInput").val();
    // Variable for current weather working 
    var urlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    // Variable for 5 day forecast working
    var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
})