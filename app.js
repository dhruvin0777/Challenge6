const API_KEY = "c92f71fdd492c730504dffc18ac179b5";
const weatherDataDiv = document.querySelector("#weatherData");
const recentSearchesDiv = document.querySelector("#recentSearches");
const weatherForm = document.querySelector("form");

let recentSearches = [];

const displayRecentSearches = () => {
  let recentSearchesList = "";
  recentSearches.forEach(city => {
    recentSearchesList += `<p>${city}</p>`;
  });
  recentSearchesDiv.innerHTML = recentSearchesList;
};

weatherForm.addEventListener("submit", event => {
  event.preventDefault();
  const city = document.querySelector("#cityInput").value;

  recentSearches.unshift(city);
  recentSearches = recentSearches.slice(0, 5);
  displayRecentSearches();

  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
  const forecastUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

  Promise.all([fetch(weatherUrl), fetch(forecastUrl)])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([weatherData, forecastData]) => {
      const date = new Date();
      const iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
      const temperature = weatherData.main.temp;
      const humidity = weatherData.main.humidity;
      const windSpeed = weatherData.wind.speed;
      const weatherReport = `
        <p>City: ${city}</p>
        <p>Date: ${date.toDateString()}</p>
        <img src="${iconUrl}" alt="Weather icon">
        <p>Temperature: ${temperature} Kelvin</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
      `;
      let forecastReport = "<h3>5-Day Forecast</h3>";
      for (let i = 0; i < forecastData.list.length; i++) {
        if (forecastData.list[i].dt_txt.includes("12:00:00")) {
          const forecastDate = new Date(forecastData.list[i].dt * 1000);
          const forecastIconUrl = `http://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}@2x.png`;
          const forecastTemperature = forecastData.list[i].main.temp;
          const forecastHumidity = forecastData.list[i].main.humidity;
          forecastReport += `
            <p>
              ${forecastDate.toDateString()}:
              <img src="${forecastIconUrl}" alt="Weather icon">
              Temp: ${forecastTemperature} Kelvin,
              Humidity: ${forecastHumidity}%
            </p>
          `;
        }
      }
      weatherDataDiv.innerHTML = weatherReport + forecastReport;
    });
});

