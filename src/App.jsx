import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Content from "./components/Content";
import NewsDetails from "./pages/NewsDetails";

export default function App() {
  const [news, setNews] = useState([]);
  const [query, setQuery] = useState("latest");
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch news whenever query changes
  useEffect(() => {
    fetchNews();
  }, [query]);

  const fetchNews = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/news?q=${query}`);

      // ✅ ADD THIS (error handling)
      if (!res.ok) {
        throw new Error("Failed to fetch news");
      }

      const data = await res.json();

      console.log(data); // debug

      setNews(data.articles || []);

    } catch (error) {
      console.error("Error fetching news:", error);

      // ✅ ADD THIS (fallback)
      setNews([]);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 text-black dark:text-white min-h-screen">

      {/* NAVBAR */}
      <Navbar setQuery={setQuery} />

      <Routes>

        {/* HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              {loading ? (
                <p className="text-center mt-10 text-lg">
                  Loading news...
                </p>
              ) : news.length === 0 ? (
                <p className="text-center mt-10 text-gray-500">
                  No news found 😕
                </p>
              ) : (
                <>
                  <Hero news={news} />
                  <Content news={news} />
                </>
              )}
            </>
          }
        />

        {/* DETAILS PAGE */}
        <Route path="/news" element={<NewsDetails />} />

      </Routes>

    </div>
  );
}