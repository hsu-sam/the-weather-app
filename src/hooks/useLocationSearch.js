import { useState } from 'react';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const MIN_QUERY_LENGTH = 3;

export function useLocationSearch() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  async function fetchLocations(searchQuery) {
    if (searchQuery.trim().length < MIN_QUERY_LENGTH) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(
        `${GEOCODING_API}?name=${encodeURIComponent(
          searchQuery
        )}&count=10&language=en&format=json`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }

  function clearSearch() {
    setQuery('');
    setSearchResults([]);
  }

  return {
    query,
    setQuery,
    searchResults,
    setSearchResults,
    isSearching,
    fetchLocations,
    clearSearch,
  };
}
