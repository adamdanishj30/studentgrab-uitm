// Live Weather Service for UiTM Shah Alam via Open-Meteo (Free, No API key needed)

const SHAH_ALAM_COORDS = {
  lat: 3.0738,
  lon: 101.5183,
  name: 'UiTM Shah Alam',
};

const WEATHER_CODES = {
  0: { label: 'Clear Sky', icon: '☀️', isRain: false },
  1: { label: 'Mainly Clear', icon: '🌤️', isRain: false },
  2: { label: 'Partly Cloudy', icon: '⛅', isRain: false },
  3: { label: 'Overcast', icon: '☁️', isRain: false },
  45: { label: 'Foggy', icon: '🌫️', isRain: false },
  48: { label: 'Depositing Rime Fog', icon: '🌫️', isRain: false },
  51: { label: 'Light Drizzle', icon: '🌦️', isRain: true },
  53: { label: 'Moderate Drizzle', icon: '🌧️', isRain: true },
  55: { label: 'Dense Drizzle', icon: '🌧️', isRain: true },
  61: { label: 'Slight Rain', icon: '🌧️', isRain: true },
  63: { label: 'Moderate Rain', icon: '🌧️', isRain: true },
  65: { label: 'Heavy Rain', icon: '⛈️', isRain: true },
  80: { label: 'Slight Rain Showers', icon: '🌦️', isRain: true },
  81: { label: 'Moderate Rain Showers', icon: '🌧️', isRain: true },
  82: { label: 'Violent Rain Showers', icon: '⛈️', isRain: true },
  95: { label: 'Thunderstorm', icon: '⛈️', isRain: true },
  96: { label: 'Thunderstorm with Hail', icon: '⛈️', isRain: true },
  99: { label: 'Heavy Thunderstorm', icon: '⛈️', isRain: true },
};

export async function fetchShahAlamWeather() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${SHAH_ALAM_COORDS.lat}&longitude=${SHAH_ALAM_COORDS.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&timezone=Asia%2FSingapore`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();
    
    const current = data.current;
    const code = current.weather_code;
    const weatherInfo = WEATHER_CODES[code] || { label: 'Partly Cloudy', icon: '⛅', isRain: false };
    
    const isRaining = current.rain > 0 || current.precipitation > 0 || weatherInfo.isRain;

    return {
      success: true,
      temperature: Math.round(current.temperature_2m),
      apparentTemperature: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      rainMm: current.rain,
      weatherCode: code,
      condition: weatherInfo.label,
      icon: weatherInfo.icon,
      isRaining,
      timestamp: Date.now(),
      location: 'UiTM Shah Alam',
    };
  } catch (error) {
    console.warn('Failed to fetch live weather:', error);
    return {
      success: false,
      temperature: 28,
      apparentTemperature: 31,
      humidity: 80,
      windSpeed: 6,
      rainMm: 0,
      weatherCode: 2,
      condition: 'Partly Cloudy',
      icon: '⛅',
      isRaining: false,
      timestamp: Date.now(),
      location: 'UiTM Shah Alam',
    };
  }
}
