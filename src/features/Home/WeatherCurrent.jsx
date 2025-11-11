import { useWeather } from '../../context/WeatherContext';
import DailyForecast from './DailyForecast';
import ThreeDotsLoader from '../../ui/ThreeDotsLoader';
import HourlyForecast from './HourlyForecast';
import { useState } from 'react';
import Button from '../../ui/Button';
import { TbTemperature, TbUvIndex, TbWind } from 'react-icons/tb';
import { MdOutlineVisibility, MdOutlineWaterDrop } from 'react-icons/md';
import { BsSpeedometer } from 'react-icons/bs';
import { FaCloud } from 'react-icons/fa';
import SunriseSunset from '../../ui/SunriseSunset';
import { FiCloudRain } from 'react-icons/fi';

function WeatherCurrent() {
  const {
    location,
    weather,
    loading,
    error,
    convertTemperature,
    convertWindSpeed,
    convertPrecipitation,
    getTemperatureUnit,
    getWindSpeedUnit,
    getPrecipitationUnit,
  } = useWeather();

  const [allDetails, setAllDetails] = useState(false);

  if (loading) {
    return <ThreeDotsLoader />;
  }

  if (error) {
    return (
      <div>
        <p className="text-center text-2xl ">No search result found!</p>
      </div>
    );
  }

  if (!weather || !location) return null;

  const currentTemp = convertTemperature(weather.current.temperature_2m);
  const feelsLike = convertTemperature(weather.current.apparent_temperature);
  const windSpeed = convertWindSpeed(weather.current.wind_speed_10m);
  const precipitation = convertPrecipitation(weather.current.precipitation);
  const humidity = weather.current.relative_humidity_2m;
  const uvIndex = weather.current.uv_index || 0;
  const visibility = weather.current.visibility || 0;
  const pressure = Math.round(weather.current.pressure_msl || 0);
  const cloudCover = Math.round(weather.current.cloud_cover || 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
      <div className="flex flex-col gap-12">
        <div className="relative">
          <picture>
            <source
              media="(min-width: 45em)"
              srcSet="/assets/images/bg-today-large.svg"
              width="800"
              height="286"
            />
            <img
              src="/assets/images/bg-today-small.svg"
              alt="Today's weather background"
              width="343"
              height="286"
              className="w-full"
            />
          </picture>

          <div className="absolute inset-0 flex flex-col md:flex-row md:justify-between items-center justify-center px-6 py-20 gap-1">
            <div className="flex flex-col items-center gap-3">
              <h2 className="text-3xl text-center">
                {location.name}
                {location.country && `, ${location.country}`}
              </h2>
              <div>
                <p className="text-lg font-normal">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center">
              <img
                className="w-30 h-30"
                src="/assets/images/icon-sunny.webp"
                alt="Sunny"
                width="320"
                height="320"
              />

              <p className="text-8xl font-['DM_Sans_Italic']">
                {currentTemp}
                {getTemperatureUnit()}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
            <p className="text-lg">Feels Like</p>
            <TbTemperature style={{ fontSize: '40px', color: 'red' }} />
            <p className="text-3xl">
              {feelsLike} {getTemperatureUnit()}
            </p>
          </div>
          <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
            <p className="text-lg">Humidity</p>
            <MdOutlineWaterDrop
              style={{ fontSize: '40px', color: 'dodgerblue' }}
            />
            <p className="text-3xl">{humidity}%</p>
          </div>
          <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
            <p className="text-lg">Wind</p>
            <TbWind style={{ fontSize: '40px', color: 'gray' }} />
            <p className="text-3xl">
              {windSpeed} {getWindSpeedUnit()}
            </p>
          </div>
          <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
            <p className="text-lg">Percipitation</p>
            <FiCloudRain style={{ fontSize: '40px', color: 'deepskyblue' }} />
            <p className="text-3xl">
              {precipitation} {getPrecipitationUnit()}
            </p>
          </div>
        </div>

        <Button className="" onClick={() => setAllDetails(!allDetails)}>
          {!allDetails ? 'Show All Details' : 'Hide Details'}
        </Button>

        {allDetails && (
          <>
            <SunriseSunset />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
                <p className="text-lg">UV Index</p>
                <TbUvIndex style={{ fontSize: '40px', color: 'orange' }} />
                <p className="text-3xl">{uvIndex}</p>
              </div>
              <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
                <p className="text-lg">Visibility</p>
                <MdOutlineVisibility
                  style={{ fontSize: '40px', color: 'blue' }}
                />
                <p className="text-3xl">{visibility} km</p>
              </div>
              <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
                <p className="text-lg">Air Pressure</p>
                <BsSpeedometer style={{ fontSize: '40px', color: 'gray' }} />
                <p className="text-3xl">{pressure} hPa</p>
              </div>
              <div className="flex flex-col gap-6 bg-(--neutral-800) font-light p-5 rounded-xl border border-(--neutral-600) ">
                <p className="text-lg">Cloud Cover</p>
                <FaCloud style={{ fontSize: '40px', color: 'skyblue' }} />
                <p className="text-3xl">{cloudCover}%</p>
              </div>
            </div>
          </>
        )}

        <DailyForecast />
      </div>
      <HourlyForecast />
    </div>
  );
}

export default WeatherCurrent;
