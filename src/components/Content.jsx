import { ListCard, ListSkeleton } from "./ArticleCard";
import WeatherWidget from "./WeatherWidget";

export default function Content({ articles, loading }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 mb-16 grid lg:grid-cols-3 gap-8">
      {/* Main feed */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-xl" style={{ color: "var(--color-text)" }}>
            Latest Stories
          </h2>
          <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "var(--color-muted)" }}>
            {loading ? "Loading…" : `${articles.length} articles`}
          </span>
        </div>

        {loading ? (
          <ListSkeleton count={8} />
        ) : articles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">📰</p>
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>No articles found</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>Try a different search term or category</p>
          </div>
        ) : (
          <div>
            {articles.slice(3).map((art, i) => (
              <ListCard key={art.url || i} article={art} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-5">
          {/* Weather widget */}
          <WeatherWidget />

          {/* Trending topics */}
          <div className="rounded-xl p-5"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-xs font-mono uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--color-muted)" }}>
              🔥 Trending Topics
            </h3>
            <div className="space-y-0">
              {["Artificial Intelligence","Climate Change","Global Markets","Space Exploration","Geopolitics","Health & Medicine"].map((topic, i) => (
                <div key={topic} className="flex items-center gap-3 py-2.5 border-b" style={{ borderColor: "var(--color-border)" }}>
                  <span className="font-display font-black text-lg w-7 leading-none" style={{ color: "var(--color-border)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Follow us */}
          <div className="rounded-xl p-5" style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
            <h3 className="text-xs font-mono uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--color-muted)" }}>
              Follow Us
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Twitter", href: "https://twitter.com", color: "#000" },
                { label: "Instagram", href: "https://instagram.com", color: "#E1306C" },
                { label: "Facebook", href: "https://facebook.com", color: "#1877F2" },
                { label: "YouTube", href: "https://youtube.com", color: "#FF0000" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium hover:opacity-80"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
