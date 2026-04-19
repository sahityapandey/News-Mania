import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WeatherWidget from "./WeatherWidget";
import { timeAgo } from "../utils/helpers";

const FALLBACK = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=60";

function PopularCard({ article, rank, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3 items-start py-3 border-b text-left group"
      style={{ borderColor: "var(--color-border)" }}
    >
      <span
        className="font-display font-black text-2xl leading-none w-7 flex-shrink-0"
        style={{ color: "var(--color-border)" }}
      >
        {String(rank).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold leading-snug line-clamp-2 group-hover:underline decoration-accent/50"
          style={{ color: "var(--color-text)" }}
        >
          {article.title}
        </p>
        <span className="text-xs font-mono mt-1 block" style={{ color: "var(--color-muted)" }}>
          {article.source?.name} · {timeAgo(article.publishedAt)}
        </span>
      </div>
      {article.urlToImage && (
        <img
          src={article.urlToImage}
          onError={(e) => { e.target.src = FALLBACK; }}
          alt=""
          className="w-14 h-12 object-cover rounded-lg flex-shrink-0"
        />
      )}
    </button>
  );
}

export default function PopularDrawer({ open, onClose, articles }) {
  const navigate = useNavigate();

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Pick "popular" = first 8 articles (in a real app, sort by views)
  const popular = articles.slice(0, 8);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ backgroundColor: "var(--color-surface)", borderLeft: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
        >
          <h2 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
            🔥 Popular &amp; Weather
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
            style={{ color: "var(--color-muted)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Weather */}
          <WeatherWidget />

          {/* Popular posts */}
          <div>
            <h3
              className="text-xs font-mono uppercase tracking-widest font-semibold mb-1"
              style={{ color: "var(--color-muted)" }}
            >
              Most Read Today
            </h3>
            {popular.length === 0 ? (
              <p className="text-sm py-4 text-center" style={{ color: "var(--color-muted)" }}>
                Loading articles…
              </p>
            ) : (
              popular.map((art, i) => (
                <PopularCard
                  key={art.url || i}
                  article={art}
                  rank={i + 1}
                  onClick={() => {
                    navigate("/news", { state: art });
                    onClose();
                  }}
                />
              ))
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
