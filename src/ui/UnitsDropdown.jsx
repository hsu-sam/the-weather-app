import { useWeather } from '../context/WeatherContext';
import Button from './Button';
import { useState } from 'react';

function UnitsDRopdown() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { units, setUnits } = useWeather();

  const handleUnitChange = (unitType, value) => {
    setUnits((prev) => ({
      ...prev,
      [unitType]: value,
    }));
  };

  return (
    <div className="relative">
      <Button variant="neutral" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <img
          src="\assets\images\icon-units.svg"
          alt=""
          width="16"
          height="16"
        />
        Units
        <img
          src="\assets\images\icon-dropdown.svg"
          alt=""
          width="13"
          height="8"
        />
      </Button>

      {dropdownOpen && (
        <div className="absolute top-15 right-0 p-2 bg-(--neutral-800) border border-(--neutral-600) rounded-xl shadow-lg min-w-48 z-20">
          <h4 className="text-base mb-3">Switch to Imperial</h4>

          <div>
            <h6 className="text-sm font-light">Temperature</h6>

            <button
              type="button"
              onClick={() => handleUnitChange('temperature', 'celsius')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex justify-between items-center ${
                units.temperature === 'celsius'
                  ? 'bg-(--neutral-700)'
                  : 'hover:bg-(--neutral-600)'
              }`}
            >
              <p className="font-light text-base">Celsius (°C)</p>
              {units.temperature === 'celsius' && (
                <span>
                  <img
                    src="/assets/images/icon-checkmark.svg"
                    alt="checkmark"
                    width="14"
                    height="11"
                  />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('temperature', 'fahrenheit')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex justify-between items-center ${
                units.temperature === 'fahrenheit'
                  ? 'bg-(--neutral-700)'
                  : 'hover:bg-(--neutral-600)'
              }`}
            >
              <p className="font-light text-base">Fahrenheit (°F)</p>
              {units.temperature === 'fahrenheit' && (
                <span>
                  <img
                    src="/assets/images/icon-checkmark.svg"
                    alt="checkmark"
                    width="14"
                    height="11"
                  />
                </span>
              )}
            </button>
          </div>

          <div>
            <h6 className="text-sm font-light">Wind Speed</h6>

            <button
              type="button"
              onClick={() => handleUnitChange('windSpeed', 'kmh')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex justify-between items-center ${
                units.windSpeed === 'kmh'
                  ? 'bg-(--neutral-700)'
                  : 'hover:bg-(--neutral-600)'
              }`}
            >
              <p className="font-light text-base">km/h</p>
              {units.windSpeed === 'kmh' && (
                <span>
                  <img
                    src="/assets/images/icon-checkmark.svg"
                    alt="checkmark"
                    width="14"
                    height="11"
                  />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('windSpeed', 'mph')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex justify-between items-center ${
                units.windSpeed === 'mph'
                  ? 'bg-(--neutral-700)'
                  : 'hover:bg-(--neutral-600)'
              }`}
            >
              <p className="font-light text-base">mph</p>
              {units.windSpeed === 'mph' && (
                <span>
                  <img
                    src="/assets/images/icon-checkmark.svg"
                    alt="checkmark"
                    width="14"
                    height="11"
                  />
                </span>
              )}
            </button>
          </div>

          <div>
            <h6 className="text-sm font-light">Percipitation</h6>

            <button
              type="button"
              onClick={() => handleUnitChange('precipitation', 'mm')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex justify-between items-center ${
                units.percipitation === 'mm'
                  ? 'bg-(--neutral-700)'
                  : 'hover:bg-(--neutral-600)'
              }`}
            >
              <p className="font-light text-base">Millimeters (mm)</p>
              {units.precipitation === 'mm' && (
                <span>
                  <img
                    src="/assets/images/icon-checkmark.svg"
                    alt="checkmark"
                    width="14"
                    height="11"
                  />
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => handleUnitChange('precipitation', 'in')}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex justify-between items-center ${
                units.percipitation === 'in'
                  ? 'bg-(--neutral-700)'
                  : 'hover:bg-(--neutral-600)'
              }`}
            >
              <p className="font-light text-base">Inches (in)</p>
              {units.precipitation === 'in' && (
                <span>
                  <img
                    src="/assets/images/icon-checkmark.svg"
                    alt="checkmark"
                    width="14"
                    height="11"
                  />
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UnitsDRopdown;
