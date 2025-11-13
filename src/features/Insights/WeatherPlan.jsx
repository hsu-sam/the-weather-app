import { useWeather } from '../../context/WeatherContext';
import { generateWeatherInsights } from '../../utils/weatherInsights';

function WeatherPlan() {
  const { weather, loading, error } = useWeather();

  if (loading || error || !weather) return null;

  const insights = generateWeatherInsights(weather);

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
