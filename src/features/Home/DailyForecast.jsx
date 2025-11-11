import { useWeather } from '../../context/WeatherContext';

function getWeatherIcon(weatherCode) {
  if (weatherCode === 0) return 'icon-sunny.webp';
  if (weatherCode === 1 || weatherCode === 2) return 'icon-partly-cloudy.webp';
  if (weatherCode === 3) return 'icon-overcast.webp';
  if (weatherCode === 45 || weatherCode === 48) return 'icon-fog.webp';
  if (weatherCode >= 51 && weatherCode <= 57) return 'icon-drizzle.webp';
  if (weatherCode >= 61 && weatherCode <= 67) return 'icon-rain.webp';
  if (weatherCode >= 71 && weatherCode <= 77) return 'icon-snow.webp';
  if (weatherCode >= 80 && weatherCode <= 82) return 'icon-rain.webp';
  if (weatherCode >= 85 && weatherCode <= 86) return 'icon-snow.webp';
  if (weatherCode >= 95 && weatherCode <= 99) return 'icon-storm.webp';
  return 'partly-cloudy';
}

function getWeatherDescription(weatherCode) {
  if (weatherCode === 0) return 'Clear sky';
  if (weatherCode === 1) return 'Mainly clear';
  if (weatherCode === 2) return 'Partly cloudy';
  if (weatherCode === 3) return 'Overcast';
  if (weatherCode === 45 || weatherCode === 48) return 'Foggy';
  if (weatherCode >= 51 && weatherCode <= 57) return 'Drizzle';
  if (weatherCode >= 61 && weatherCode <= 67) return 'Rain';
  if (weatherCode >= 71 && weatherCode <= 77) return 'Snow';
  if (weatherCode >= 80 && weatherCode <= 82) return 'Rain showers';
  if (weatherCode >= 85 && weatherCode <= 86) return 'Snow showers';
  if (weatherCode >= 95 && weatherCode <= 99) return 'Thunderstorm';
  return 'Partly cloudy';
}

function DailyForecast() {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-lg">Loading forecast...</p>
      </div>
    );
  }

  if (error || !weather) return null;

  const dailyData = weather.daily;

  //   const forecastDays = dailyData.time.slice(1, 8);
  const forecastDays = dailyData.time.slice(0, 8);

  return (
    <div>
      <h3 className="text-xl font-light">Daily forcast</h3>
      <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
        {forecastDays.map((date, index) => {
          const actualIndex = index; // Adjust for slicing from index 1
          const maxTemp = Math.round(dailyData.temperature_2m_max[actualIndex]);
          const minTemp = Math.round(dailyData.temperature_2m_min[actualIndex]);
          const weatherCode = dailyData.weather_code[actualIndex];
          const icon = getWeatherIcon(weatherCode);
          const description = getWeatherDescription(weatherCode);

          // Format date
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString('en-US', {
            weekday: 'short',
          });

          return (
            <div
              className=" flex flex-col gap-4 px-2.5 py-4 bg-(--neutral-800) border border-(--neutral-600) rounded-xl"
              key={date}
            >
              <p className="text-center">{dayName}</p>
              <img
                className="w-15 h-15 self-center"
                src={`/assets/images/${icon}`}
                alt={description}
              />

              <div className="flex fllex-row justify-between">
                <p>{maxTemp}°</p>
                <p>{minTemp}°</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecast;
