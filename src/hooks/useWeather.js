import { useState, useEffect } from "react";

// Uses Open-Meteo (100% free, no API key needed)
const WMO_CODES = {
  0: { label: "Clear sky", icon: "☀️" },
  1: { label: "Mainly clear", icon: "🌤️" },
  2: { label: "Partly cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Icy fog", icon: "🌫️" },
  51: { label: "Light drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy drizzle", icon: "🌧️" },
  61: { label: "Slight rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy rain", icon: "🌧️" },
  71: { label: "Slight snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy snow", icon: "❄️" },
  80: { label: "Showers", icon: "🌦️" },
  85: { label: "Snow showers", icon: "🌨️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  99: { label: "Hail storm", icon: "⛈️" },
};

function wmo(code) {
  const keys = Object.keys(WMO_CODES).map(Number).sort((a, b) => b - a);
  const match = keys.find((k) => code >= k);
  return WMO_CODES[match] || { label: "Unknown", icon: "🌡️" };
}

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  return (
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.county ||
    "Your location"
  );
}

async function fetchWeatherForCoords(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,weathercode,windspeed_10m,relative_humidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
  const res = await fetch(url);
  return res.json();
}

// Popular cities for the "other locations" panel
export const PRESET_CITIES = [
  { name: "Mumbai", lat: 19.076, lon: 72.877 },
  { name: "Delhi", lat: 28.614, lon: 77.209 },
  { name: "New York", lat: 40.713, lon: -74.006 },
  { name: "London", lat: 51.507, lon: -0.128 },
  { name: "Tokyo", lat: 35.676, lon: 139.65 },
  { name: "Dubai", lat: 25.204, lon: 55.27 },
];

export function useWeather() {
  const [current, setCurrent] = useState(null);   // { city, temp, feels, icon, label, wind, humidity, daily[] }
  const [cities, setCities] = useState([]);         // array of same shape for preset cities
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        // 1. Get user location
        const pos = await new Promise((res, rej) =>
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
        );
        const { latitude: lat, longitude: lon } = pos.coords;

        const [weatherData, city] = await Promise.all([
          fetchWeatherForCoords(lat, lon),
          reverseGeocode(lat, lon),
        ]);

        if (cancelled) return;

        const c = weatherData.current;
        const daily = (weatherData.daily?.time || []).map((date, i) => ({
          date,
          max: Math.round(weatherData.daily.temperature_2m_max[i]),
          min: Math.round(weatherData.daily.temperature_2m_min[i]),
          ...wmo(weatherData.daily.weathercode[i]),
        }));

        setCurrent({
          city,
          temp: Math.round(c.temperature_2m),
          feels: Math.round(c.apparent_temperature),
          wind: Math.round(c.windspeed_10m),
          humidity: c.relative_humidity_2m,
          ...wmo(c.weathercode),
          daily,
        });

        // 2. Fetch preset cities in parallel
        const cityWeathers = await Promise.all(
          PRESET_CITIES.map(async ({ name, lat, lon }) => {
            const d = await fetchWeatherForCoords(lat, lon);
            const cur = d.current;
            return {
              city: name,
              temp: Math.round(cur.temperature_2m),
              ...wmo(cur.weathercode),
            };
          })
        );
        if (!cancelled) setCities(cityWeathers);
      } catch (err) {
        if (!cancelled) {
          // Fallback: load preset cities only
          setError(err.message.includes("User denied") ? "Location access denied" : err.message);
          try {
            const cityWeathers = await Promise.all(
              PRESET_CITIES.map(async ({ name, lat, lon }) => {
                const d = await fetchWeatherForCoords(lat, lon);
                const cur = d.current;
                return { city: name, temp: Math.round(cur.temperature_2m), ...wmo(cur.weathercode) };
              })
            );
            if (!cancelled) setCities(cityWeathers);
          } catch { /* silent */ }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  return { current, cities, loading, error };
}
