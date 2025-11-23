import { createContext, useContext, useState, useEffect } from 'react';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add units state
  const [units, setUnits] = useState({
    temperature: 'celsius', // 'celsius' or 'fahrenheit'
    windSpeed: 'kmh', // 'kmh' or 'mph'
    precipitation: 'mm', // 'mm' or 'in'
  });

  // Conversion functions
  const convertTemperature = (temp) => {
    if (units.temperature === 'fahrenheit') {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  const convertWindSpeed = (speed) => {
    if (units.windSpeed === 'mph') {
      return Math.round(speed * 0.621371);
    }
    return Math.round(speed);
  };

  const convertPrecipitation = (precip) => {
    if (units.precipitation === 'in') {
      return (precip * 0.0393701).toFixed(2);
    }
    return precip.toFixed(1);
  };

  const getTemperatureUnit = () =>
    units.temperature === 'celsius' ? '°C' : '°F';
  const getWindSpeedUnit = () => (units.windSpeed === 'kmh' ? 'km/h' : 'mph');
  const getPrecipitationUnit = () =>
    units.precipitation === 'mm' ? 'mm' : 'in';

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (err) => {
          setError('Location access denied. Please search for a location.');
          setLoading(false);
          console.log(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  }, []);

  async function fetchWeatherByCoords(lat, lon) {
    try {
      setLoading(true);
      setError(null);

      // Get location name from coordinates
      const geoResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );
      const geoData = await geoResponse.json();

      // Get weather data - WITH HOURLY DATA
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index,visibility,pressure_msl,cloud_cover&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      setLocation({
        name: geoData.city || geoData.locality || 'Unknown',
        country: geoData.countryName || '',
        lat,
        lon,
      });

      setWeather(weatherData);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }

  async function searchLocation(query) {
    try {
      setLoading(true);
      setError(null);

      // Search for location
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          query
        )}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError('Location not found. Please try another search.');
        setLoading(false);
        return;
      }

      const result = geoData.results[0];

      // Get weather data - WITH HOURLY DATA
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${result.latitude}&longitude=${result.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,uv_index,visibility,pressure_msl,cloud_cover&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=auto`
      );
      const weatherData = await weatherResponse.json();

      setLocation({
        name: result.name,
        country: result.country,
        state: result.admin1 || '',
        lat: result.latitude,
        lon: result.longitude,
      });
      setWeather(weatherData);
      setLoading(false);
    } catch (err) {
      setError('Failed to search location');
      setLoading(false);
    }
  }

  return (
    <WeatherContext.Provider
      value={{
        location,
        weather,
        loading,
        error,
        searchLocation,
        fetchWeatherByCoords,
        units,
        setUnits,
        convertTemperature,
        convertWindSpeed,
        convertPrecipitation,
        getTemperatureUnit,
        getWindSpeedUnit,
        getPrecipitationUnit,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within WeatherProvider');
  }
  return context;
}
