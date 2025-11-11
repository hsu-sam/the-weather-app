import { useState } from 'react';
import Button from '../../ui/Button';
import Form from '../../ui/Form';
import Input from '../../ui/Input';
import { useWeather } from '../../context/WeatherContext';
import Loader from '../../ui/Loader';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

function SearchLocation() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const { searchLocation, fetchWeatherByCoords, loading } = useWeather();

  async function handleInputChange(e) {
    const value = e.target.value;
    setQuery(value);
    setSelectedLocation(null);

    if (value.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          value
        )}&count=10&language=en&format=json`
      );
      const data = await response.json();

      if (data.results) {
        setSearchResults(data.results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
      console.log(voiceError);
    } finally {
      setIsSearching(false);
    }
  }

  function handleSelectLocation(result) {
    setSelectedLocation(result);
    setQuery(
      `${result.name}${result.admin1 ? `, ${result.admin1}` : ''}, ${
        result.country
      }`
    );
    setSearchResults([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (selectedLocation) {
      await searchLocation(selectedLocation.name);

      setQuery('');
      setSelectedLocation(null);
    } else if (query.trim()) {
      await searchLocation(query);

      setQuery('');
    }
  }

  function startVoiceSearch() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError('Speech recognition is not supported in your browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceError('');
      setQuery('Listening...');
    };

    recognition.onresult = async (event) => {
      const speechResult = event.results[0][0].transcript;
      setQuery(speechResult);

      // Automatically search for the spoken location
      // await searchLocation(speechResult);
      setQuery(speechResult);
      setIsListening(false);

      try {
        setIsSearching(true);
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            speechResult
          )}&count=10&language=en&format=json`
        );
        const data = await response.json();

        if (data.results) {
          setSearchResults(data.results);
        } else if (speechResult.trim().length < 3) {
          setSearchResults([]);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error('Search failed:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'no-speech') {
        setVoiceError('No speech detected. Please try again.');
      } else if (event.error === 'not-allowed') {
        setVoiceError('Microphone access denied.');
      } else {
        setVoiceError(`Error: ${event.error}`);
      }
      setQuery('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }

  async function getUserLocation(e) {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(
            'Unable to get your location. Please search for a location instead.'
          );
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  }

  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col items-center justify-center gap-4 relative md:flex-row"
      >
        <div className="relative w-full md:w-180 lg:w-131.5">
          <img
            src="/assets/images/icon-search.svg"
            alt="Search"
            width="21"
            height="21"
            className="absolute left-6 top-1/2 -translate-y-1/2"
          />
          <Input
            value={query}
            onChange={handleInputChange}
            disabled={loading}
            autoComplete="on"
            placeholder="Search for a place..."
            className="pl-16 w-full flex flex-1 text-neutarl-200"
          />

          <button
            type="button"
            onClick={startVoiceSearch}
            disabled={loading || isListening}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-(--neutral-600) rounded-lg transition-colors disabled:opacity-50"
          >
            {isListening ? (
              <FaMicrophoneSlash
                style={{ fontSize: '20px', color: 'var(--orange-500)' }}
              />
            ) : (
              <FaMicrophone style={{ fontSize: '20px' }} />
            )}
          </button>

          {/* Dropdown Results */}
          {searchResults?.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-(--neutral-800) border border-(--neutral-600) rounded-xl shadow-lg max-h-80 overflow-y-auto z-20">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.id}-${index}`}
                  type="button"
                  onClick={() => handleSelectLocation(result)}
                  className="w-full text-left px-6 py-4 hover:bg-(--neutral-700) transition-colors border-b border-(--neutral-600) last:border-b-0"
                >
                  <div className="flex flex-col gap-0.5">
                    <p className="text-(--neutral-0) font-medium">
                      {result.name}
                    </p>
                    <p className="text-sm text-(--neutral-300)">
                      {result.admin1 && `${result.admin1}, `}
                      {result.country}
                      {result.admin2 && ` • ${result.admin2}`}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-(--neutral-800) border border-(--neutral-600) rounded-xl shadow-lg flex flex-row items-center gap-2.5 px-2 py-2.5 z-20">
              <Loader />
              <p className="text-(--neutral-300) text-center">
                Search in progress
              </p>
            </div>
          )}

          {query.length >= 3 && searchResults?.length === 0 && isSearching && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-(--neutral-800) border border-(--neutral-600) rounded-xl shadow-lg p-4 z-20">
              <p className="text-(--neutral-300) text-center">
                No locations found
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-row w-full md:w-fit gap-4">
          <Button size="large" className="flex-1 md:w-28.5 disabled={loading}">
            Search
          </Button>
          <Button
            size="large"
            className="md:w-28.5"
            onClick={getUserLocation}
            disabled={loading}
          >
            <FaLocationCrosshairs style={{ fontSize: '28px' }} />
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default SearchLocation;
