import { useWeather } from '../context/WeatherContext';
import { TbSunrise, TbSunset } from 'react-icons/tb';

function SunriseSunset() {
  const { weather, loading, error } = useWeather();

  if (loading || error || !weather || !weather.daily) return null;

  const sunrise = new Date(weather.daily.sunrise[0]);
  const sunset = new Date(weather.daily.sunset[0]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sunrise */}
      <div className="flex flex-col gap-4 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600)">
        <p className="text-3xl">Sunrise</p>
        <TbSunrise style={{ fontSize: '40px', color: 'gold' }} />

        <p className="text-3xl">{formatTime(sunrise)}</p>
      </div>

      {/* Sunset */}
      <div className="flex flex-col gap-4 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600)">
        <p className="text-3xl ">Sunset</p>
        <TbSunset style={{ fontSize: '40px', color: 'red' }} />

        <p className="text-3xl">{formatTime(sunset)}</p>
      </div>
    </div>
  );
}

export default SunriseSunset;
