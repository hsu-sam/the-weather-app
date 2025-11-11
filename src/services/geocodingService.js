// Open-Meteo Geocoding API
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1';

export const searchLocation = async (query) => {
  const params = new URLSearchParams({
    name: query,
    count: 5,
    language: 'en',
    format: 'json',
  });

  const response = await fetch(`${GEO_URL}/search?${params}`);
  if (!response.ok) throw new Error('Failed to search location');
  const data = await response.json();
  return data.results || [];
};

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }),
      (error) => reject(error)
    );
  });
};
