import { useApp } from "../context/AppContext";
import { ListCard } from "../components/ArticleCard";
import { Link } from "react-router-dom";

export default function Bookmarks() {
  const { bookmarks, user } = useApp();

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🔖</p>
        <h2
          className="font-display text-2xl font-bold mb-2"
          style={{ color: "var(--color-text)" }}
        >
          Sign in to see bookmarks
        </h2>
        <p className="mb-6" style={{ color: "var(--color-muted)" }}>
          Create a free account to save articles and access them anytime.
        </p>
        <Link to="/" className="btn-primary inline-block" style={{ backgroundColor: "var(--color-accent)", color: "white", padding: "0.5rem 1.5rem", borderRadius: "0.5rem", fontWeight: 600 }}>
          ← Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="font-display font-bold text-3xl"
            style={{ color: "var(--color-text)" }}
          >
            Saved Articles
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
            {bookmarks.length === 0
              ? "Nothing saved yet"
              : `${bookmarks.length} article${bookmarks.length !== 1 ? "s" : ""} saved`}
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-5xl mb-4">📑</p>
          <p className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>
            Your reading list is empty
          </p>
          <p className="text-sm mb-6" style={{ color: "var(--color-muted)" }}>
            Bookmark articles from the home feed to save them here.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Browse news
          </Link>
        </div>
      ) : (
        <div className="max-w-3xl">
          {bookmarks.map((art, i) => (
            <ListCard key={art.url} article={art} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
