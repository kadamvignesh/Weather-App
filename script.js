const apiKey = 'YOUR_API_KEY;   // ← Put your OpenWeatherMap key here
const apiUrl = 'https://api.openweathermap.org/data/2.5';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');

async function getWeather(city) {
  try {
    // Current weather
    const res = await fetch(`${apiUrl}/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await res.json();

    if (data.cod !== 200) {
      alert("City not found! Try again.");
      return;
    }

    updateCurrentWeather(data);

    // 5-day forecast
    const forecastRes = await fetch(`${apiUrl}/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const forecastData = await forecastRes.json();
    updateForecast(forecastData);

  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check your API key or internet.");
  }
}

function updateCurrentWeather(data) {
  document.getElementById('location').textContent = `${data.name}, ${data.sys.country}`;
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('description').textContent = data.weather[0].description;
  document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}°C`;
  document.getElementById('humidity').textContent = `${data.main.humidity}%`;
  document.getElementById('wind').textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;

  const iconCode = data.weather[0].icon;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  // Change background based on weather
  const body = document.body;
  const mainWeather = data.weather[0].main.toLowerCase();

  if (mainWeather.includes('clear')) body.style.background = 'linear-gradient(135deg, #1e3c72, #2a5298)';
  else if (mainWeather.includes('cloud')) body.style.background = 'linear-gradient(135deg, #334155, #475569)';
  else if (mainWeather.includes('rain') || mainWeather.includes('drizzle')) body.style.background = 'linear-gradient(135deg, #1e2937, #334155)';
  else if (mainWeather.includes('thunder')) body.style.background = 'linear-gradient(135deg, #1a1a2e, #16213e)';
  else body.style.background = 'linear-gradient(135deg, #0f172a, #1e2937)';
}

function updateForecast(forecastData) {
  const container = document.getElementById('forecast-container');
  container.innerHTML = '';

  // Take one forecast per day (every 8th item ≈ 24 hours)
  const daily = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);

  daily.forEach(day => {
    const date = new Date(day.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

    const div = document.createElement('div');
    div.className = 'forecast-day';
    div.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
      <div class="day">${dayName}</div>
      <div class="temp">${Math.round(day.main.temp)}°C</div>
    `;
    container.appendChild(div);
  });
}

// Event listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  }
});

// Load default city (Mumbai since you're there!)
window.onload = () => {
  cityInput.value = "Mumbai";
  getWeather("Mumbai");
};
