import { useState, useEffect, useCallback, useRef } from "react";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || "";
const CACHE = new Map(); // in-memory cache per session

function buildUrl(query) {
  const base = "https://newsapi.org/v2";
  const q = encodeURIComponent(query);

  // Use top-headlines for short category queries
  const shortCategories = ["technology", "sports", "business", "health", "entertainment", "science"];
  if (shortCategories.includes(query.toLowerCase())) {
    return `${base}/top-headlines?category=${query.toLowerCase()}&language=en&pageSize=30&apiKey=${API_KEY}`;
  }
  if (query.toLowerCase() === "latest") {
    return `${base}/top-headlines?language=en&pageSize=30&apiKey=${API_KEY}`;
  }
  return `${base}/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=30&apiKey=${API_KEY}`;
}

export function useNews(query) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchNews = useCallback(async (q) => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    const url = buildUrl(q);

    // Return cache hit instantly
    if (CACHE.has(url)) {
      setArticles(CACHE.get(url));
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const valid = (data.articles || []).filter(
        (a) => a.title && a.title !== "[Removed]"
      );
      CACHE.set(url, valid);
      setArticles(valid);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(query);
    return () => abortRef.current?.abort();
  }, [query, fetchNews]);

  return { articles, loading, error, refetch: () => fetchNews(query) };
}
