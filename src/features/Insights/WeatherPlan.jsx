import { useWeather } from '../../context/WeatherContext';

function WeatherPlan() {
  const { weather, loading, error } = useWeather();

  if (loading || error || !weather) return null;

  const currentTemp = Math.round(weather.current.temperature_2m);
  const feelsLike = Math.round(weather.current.apparent_temperature);
  const humidity = weather.current.relative_humidity_2m;
  const windSpeed = Math.round(weather.current.wind_speed_10m * 0.621371); // Convert to mph
  const precipitation = weather.current.precipitation;

  // Get today's high and low
  const todayHigh = Math.round(weather.daily.temperature_2m_max[0]);
  const todayLow = Math.round(weather.daily.temperature_2m_min[0]);

  // Generate insights based on weather data
  const insights = [];

  // Temperature insight
  if (currentTemp >= 85) {
    insights.push({
      icon: '🌡️',
      title: 'Hot Weather',
      description:
        "It's quite hot today. Stay hydrated and avoid prolonged sun exposure.",
      type: 'warning',
    });
  } else if (currentTemp <= 32) {
    insights.push({
      icon: '❄️',
      title: 'Freezing Temperature',
      description:
        'Temperature is at or below freezing. Dress warmly and watch for ice.',
      type: 'warning',
    });
  } else if (currentTemp >= 70 && currentTemp <= 80) {
    insights.push({
      icon: '☀️',
      title: 'Pleasant Weather',
      description: 'Perfect temperature for outdoor activities!',
      type: 'good',
    });
  }

  // Feels like insight
  if (Math.abs(feelsLike - currentTemp) >= 10) {
    insights.push({
      icon: '🌡️',
      title: 'Feels Different',
      description: `It feels ${
        feelsLike > currentTemp ? 'warmer' : 'colder'
      } than the actual temperature due to ${
        feelsLike > currentTemp ? 'humidity' : 'wind chill'
      }.`,
      type: 'info',
    });
  }

  // Humidity insight
  if (humidity >= 70) {
    insights.push({
      icon: '💧',
      title: 'High Humidity',
      description:
        'Humidity is high. You may feel warmer than the actual temperature.',
      type: 'info',
    });
  } else if (humidity <= 30) {
    insights.push({
      icon: '🏜️',
      title: 'Low Humidity',
      description:
        'Air is dry. Consider using moisturizer and staying hydrated.',
      type: 'info',
    });
  }

  // Wind insight
  if (windSpeed >= 20) {
    insights.push({
      icon: '💨',
      title: 'Windy Conditions',
      description: 'Strong winds expected. Secure loose objects outdoors.',
      type: 'warning',
    });
  } else if (windSpeed <= 5) {
    insights.push({
      icon: '🍃',
      title: 'Calm Conditions',
      description: 'Light winds make it a great day for outdoor activities.',
      type: 'good',
    });
  }

  // Precipitation insight
  if (precipitation > 0) {
    insights.push({
      icon: '☔',
      title: 'Precipitation',
      description: `Currently experiencing ${precipitation} inches of precipitation. Don't forget your umbrella!`,
      type: 'warning',
    });
  }

  // Temperature range insight
  const tempRange = todayHigh - todayLow;
  if (tempRange >= 20) {
    insights.push({
      icon: '📊',
      title: 'Large Temperature Swing',
      description: `Temperature will vary by ${tempRange}° today. Dress in layers.`,
      type: 'info',
    });
  }

  // UV/Sun insight based on weather code
  const weatherCode = weather.current.weather_code;
  if (weatherCode === 0 || weatherCode === 1) {
    insights.push({
      icon: '🕶️',
      title: 'Clear Skies',
      description:
        "Sunny conditions expected. Don't forget sunscreen and sunglasses.",
      type: 'info',
    });
  }

  // If no specific insights, add a general one
  if (insights.length === 0) {
    insights.push({
      icon: '✨',
      title: 'Normal Conditions',
      description: 'Weather conditions are typical for this time of year.',
      type: 'good',
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-semibold">Smart Recommendations</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex flex-row gap-4 p-5 rounded-xl border ${
              insight.type === 'warning'
                ? 'bg-(--orange-500)/10 border-(--orange-500)/30'
                : insight.type === 'good'
                ? 'bg-(--blue-500)/10 border-(--blue-500)/30'
                : 'bg-(--neutral-800) border-(--neutral-600)'
            }`}
          >
            <div className="text-4xl">{insight.icon}</div>
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-semibold">{insight.title}</h4>
              <p className="text-sm text-(--neutral-300)">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherPlan;
