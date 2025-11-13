import { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import Button from '../../ui/Button';

// Map weather codes to icon filenames
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
  return 'icon-partly-cloudy.webp';
}

function HourlyForecast() {
  const { weather, loading, error } = useWeather();
  const [selectedDay, setSelectedDay] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading || error || !weather) return null;

  // Get the next 7 days
  const dailyData = weather.daily;
  const days = dailyData.time.slice(0, 7).map((date, index) => {
    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      date,
      dayName,
      maxTemp: Math.round(dailyData.temperature_2m_max[index]),
      minTemp: Math.round(dailyData.temperature_2m_min[index]),
      weatherCode: dailyData.weather_code[index],
    };
  });

  // Get hourly data for the selected day
  const selectedDate = days[selectedDay].date;
  const hourlyData = weather.hourly;
  const displayDayName =
    selectedDay === 0 ? 'Today' : days[selectedDay].dayName;

  // Filter hourly data for the selected day (24 hours)
  const dayStart = new Date(selectedDate).setHours(0, 0, 0, 0);
  const dayEnd = new Date(selectedDate).setHours(23, 59, 59, 999);

  const hourlyForecasts = hourlyData.time
    .map((time, index) => ({
      time: new Date(time),
      temp: Math.round(hourlyData.temperature_2m[index]),
      weatherCode: hourlyData.weather_code[index - 1],
    }))
    .filter((hour) => {
      const hourTime = hour.time.getTime();
      return hourTime >= dayStart && hourTime <= dayEnd;
    });

  return (
    <div className="bg-(--neutral-800) h-195 overflow-hidden border border-(--neutral-600) rounded-xl p-6">
      <div className="flex flex-row items-center justify-between mb-6">
        <h3 className="text-xl font-light">Hourly forecast</h3>
        <div className="relative">
          <Button
            variant="secondary"
            size="medium"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            type="button"
          >
            {displayDayName}
            <img
              src="/assets/images/icon-dropdown.svg"
              alt=""
              width="13"
              height="8"
              className={`transition-transform ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </Button>

          {dropdownOpen && (
            <div
              className={`absolute top-12 right-0 p-2 bg-(--neutral-800) border border-(--neutral-600) rounded-xl shadow-lg min-w-48 z-20 transition-all duration-180 ease-out ${
                dropdownOpen
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              {days.map((day, index) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setSelectedDay(index);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-2.5 hover:bg-(--neutral-600) rounded-lg transition-colors first:rounded-t-xl last:rounded-b-xl flex justify-between items-center ${
                    selectedDay === index ? 'bg-(--neutral-700)' : ''
                  }  `}
                >
                  <p className="font-light text-base">
                    {index === 0 ? 'Today' : day.dayName}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 h-[98vh] overflow-y-scroll">
        {hourlyForecasts.map((hour) => {
          const icon = getWeatherIcon(hour.weatherCode);
          const timeString = hour.time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          });

          return (
            <div
              key={hour.time.toISOString()}
              className="flex flex-row items-center justify-between border border-(--neutral-600) bg-(--neutral-700)  rounded-xl pl-3 pr-4 px-2.5"
            >
              <div className="flex flex-row gap-4 items-center">
                <img
                  className="w-10 h-10"
                  src={`/assets/images/${icon}`}
                  alt=""
                  width="320"
                  height="320"
                />
                <p className="text-xl font-light">{timeString}</p>
              </div>

              <p className="text-base font-light">{hour.temp}°</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;
