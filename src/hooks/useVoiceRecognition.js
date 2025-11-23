import { useState } from 'react';

export function useVoiceRecognition(onResult) {
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');

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

  return { isListening, voiceError, startVoiceSearch };
}
