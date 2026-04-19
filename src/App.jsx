import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NewsDetails from "./pages/NewsDetails";
import Bookmarks from "./pages/Bookmarks";

export default function App() {
  const [query, setQuery] = useState("latest");
  const [activeCategory, setActiveCategory] = useState("Latest");
  const [articles, setArticles] = useState([]); // lifted up so Navbar can pass to drawer

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg)" }}>
        <Navbar
          setQuery={setQuery}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          articles={articles}
        />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home query={query} onArticlesLoaded={setArticles} />} />
            <Route path="/news" element={<NewsDetails />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AppProvider>
  );
}
