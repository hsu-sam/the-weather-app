import { useWeather } from '../../context/WeatherContext';

function getWeatherDescription(weatherCode) {
  if (weatherCode === 0) return 'Clear skies';
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

// Calculate outdoor comfort score (0-100)
function calculateComfortScore(temp, weatherCode, windSpeed, humidity) {
  let score = 100;

  // Temperature scoring (optimal: 18-24°C / 65-75°F)
  if (temp < 0) score -= 40;
  else if (temp < 10) score -= 25;
  else if (temp < 15) score -= 15;
  else if (temp > 32) score -= 30;
  else if (temp > 28) score -= 20;
  else if (temp > 26) score -= 10;

  // Weather code scoring
  if (weatherCode >= 95) score -= 30; // Thunderstorm
  else if (weatherCode >= 80) score -= 20; // Heavy rain
  else if (weatherCode >= 61) score -= 15; // Rain
  else if (weatherCode >= 51) score -= 10; // Drizzle
  else if (weatherCode >= 45) score -= 5; // Fog
  else if (weatherCode >= 3) score -= 3; // Overcast

  // Wind scoring
  if (windSpeed > 40) score -= 15;
  else if (windSpeed > 32) score -= 10;
  else if (windSpeed > 24) score -= 5;

  // Humidity scoring
  if (humidity > 80) score -= 10;
  else if (humidity < 20) score -= 5;

  return Math.max(0, Math.min(100, score));
}

function getQualityLabel(score) {
  if (score >= 85) return { label: 'Excellent', color: 'var(--blue-500)' };
  if (score >= 70) return { label: 'Good', color: 'var(--blue-500)' };
  if (score >= 50) return { label: 'Fair', color: 'var(--orange-500)' };
  return { label: 'Poor', color: 'var(--orange-500)' };
}

function WeatherInsights() {
  const { weather, location, loading, error } = useWeather();

  if (loading || error || !weather || !weather.hourly) return null;

  const now = new Date();

  // Get next 24 hours of data
  const next24Hours = weather.hourly.time
    .map((time, index) => {
      const hourTime = new Date(time);
      return {
        time: hourTime,
        hour: hourTime.getHours(),
        temp: weather.hourly.temperature_2m[index],
        weatherCode: weather.hourly.weather_code[index],
        humidity: weather.current.relative_humidity_2m,
        windSpeed: weather.current.wind_speed_10m * 0.621371,
      };
    })
    .filter((hour) => {
      const hoursDiff = (hour.time - now) / (1000 * 60 * 60);
      return hoursDiff >= 0 && hoursDiff <= 24;
    })
    .slice(0, 24);

  // Calculate comfort scores for each hour
  const hoursWithScores = next24Hours.map((hour) => ({
    ...hour,
    score: calculateComfortScore(
      hour.temp,
      hour.weatherCode,
      hour.windSpeed,
      hour.humidity
    ),
  }));

  // Find best 2-hour window
  let bestWindow = { startIndex: 0, avgScore: 0 };
  for (let i = 0; i < hoursWithScores.length - 1; i++) {
    const avgScore =
      (hoursWithScores[i].score + hoursWithScores[i + 1].score) / 2;
    if (avgScore > bestWindow.avgScore) {
      bestWindow = { startIndex: i, avgScore };
    }
  }

  const bestStartHour = hoursWithScores[bestWindow.startIndex];
  const bestEndHour = hoursWithScores[bestWindow.startIndex + 1];
  const bestScore = Math.round(bestWindow.avgScore);
  const bestQuality = getQualityLabel(bestScore);

  // Get next 9 hours for the bar chart
  const next9Hours = hoursWithScores.slice(0, 9);
  const maxScore = Math.max(...next9Hours.map((h) => h.score));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">
          Plan Your Day in {location.name}
        </h2>
        <p className="text-(--neutral-300)">
          Personalized weather insights to help you make the most of your day
        </p>
      </div>

      {/* Best Time Outside */}
      <div className="bg-(--neutral-800) border border-(--neutral-600) rounded-xl p-6 flex flex-col gap-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-semibold">Best Time Outside Today</h3>
          <div className="flex gap-3 text-sm flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-(--blue-500)"></span>
              Excellent
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-(--blue-700)"></span>
              Good
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-(--orange-500)"></span>
              Fair
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-(--neutral-600)"></span>
              Poor
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Optimal Window Card */}
          <div className="bg-(--neutral-900) border border-(--neutral-600) rounded-xl p-5 flex flex-col gap-4">
            <p className="text-sm text-(--neutral-300) font-medium">
              Optimal 2 hour Window
            </p>
            <p className="text-3xl font-bold">
              {bestStartHour.time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: true,
              })}{' '}
              -{' '}
              {bestEndHour.time.toLocaleTimeString('en-US', {
                hour: 'numeric',
                hour12: true,
              })}
            </p>
            <p className="text-(--neutral-300)">
              Around {Math.round(bestStartHour.temp)}°C •{' '}
              {getWeatherDescription(bestStartHour.weatherCode)}
            </p>
            <p className="text-sm">
              {bestScore >= 85
                ? 'Excellent conditions for outdoor activities'
                : bestScore >= 70
                ? 'Good conditions for being outside'
                : bestScore >= 50
                ? 'Fair conditions, dress appropriately'
                : 'Challenging conditions, plan accordingly'}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div
                className="text-4xl font-bold"
                style={{ color: bestQuality.color }}
              >
                {bestScore}/100
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-sm font-semibold"
                style={{
                  backgroundColor: `${bestQuality.color}20`,
                  color: bestQuality.color,
                }}
              >
                {bestQuality.label}
              </div>
            </div>
          </div>

          {/* Next 9 Hours Chart */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-(--neutral-300) font-medium">
                Next 9 hours
              </p>
              <p className="text-xs text-(--neutral-300)">
                Tap bars for details
              </p>
            </div>
            <div className="flex items-end justify-between gap-1.5 h-40">
              {next9Hours.map((hour, index) => {
                const quality = getQualityLabel(hour.score);
                const heightPercent = (hour.score / maxScore) * 100;

                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="relative w-full flex items-end h-32">
                      <div
                        className="w-full rounded-t transition-all duration-200 group-hover:opacity-80"
                        style={{
                          height: `${heightPercent}%`,
                          minHeight: '20px',
                          backgroundColor: quality.color,
                        }}
                      ></div>
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="bg-(--neutral-700) border border-(--neutral-600) rounded-lg p-2 text-xs whitespace-nowrap shadow-lg">
                          <p className="font-semibold">
                            {Math.round(hour.temp)}°C
                          </p>
                          <p className="text-(--neutral-300)">
                            {hour.score}/100
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-(--neutral-300)">
                      {hour.time.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        hour12: true,
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-(--neutral-300) px-1">
              <span>
                {next9Hours[0].time.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  hour12: true,
                })}
              </span>
              <span>→</span>
              <span>
                {next9Hours[next9Hours.length - 1].time.toLocaleTimeString(
                  'en-US',
                  {
                    hour: 'numeric',
                    hour12: true,
                  }
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeatherInsights;
