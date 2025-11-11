// Using Open-Meteo API (free, no API key needed)
const BASE_URL = 'https://api.open-meteo.com/v1';

export const fetchWeatherData = async (lat, lon, units = 'metric') => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,visibility,pressure_msl',
    hourly: 'temperature_2m,weather_code',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,sunrise,sunset',
    temperature_unit: units === 'imperial' ? 'fahrenheit' : 'celsius',
    wind_speed_unit: units === 'imperial' ? 'mph' : 'kmh',
    timezone: 'auto',
  });

  const response = await fetch(`${BASE_URL}/forecast?${params}`);
  if (!response.ok) throw new Error('Failed to fetch weather');
  return response.json();
};
