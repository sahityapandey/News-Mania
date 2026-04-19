import { useEffect } from "react";
import Hero from "../components/Hero";
import Content from "../components/Content";
import { useNews } from "../hooks/useNews";

export default function Home({ query, onArticlesLoaded }) {
  const { articles, loading, error } = useNews(query);

  useEffect(() => {
    if (articles.length > 0) onArticlesLoaded(articles);
  }, [articles, onArticlesLoaded]);

  return (
    <main>
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
          <div className="rounded-lg px-4 py-3 text-sm flex items-center gap-3"
            style={{ backgroundColor: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.2)", color: "var(--color-accent)" }}>
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx={12} cy={12} r={10}/><path strokeLinecap="round" d="M12 8v4M12 16h.01"/>
            </svg>
            {error.includes("426") || error.includes("429")
              ? "API rate limit reached. Please wait a moment and try again."
              : `Could not load news: ${error}`}
          </div>
        </div>
      )}
      <Hero articles={articles} loading={loading} />
      <Content articles={articles} loading={loading} />
    </main>
  );
}
