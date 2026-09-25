const axios = require("axios");

const API_KEY = "YOUR_API_KEY"; // get from OpenWeather

exports.getWeatherData = async () => {
  const city = "Pune";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  const res = await axios.get(url);

  return {
    temperature: Math.floor(res.data.main.temp),
    weather: res.data.weather[0].main
  };
};