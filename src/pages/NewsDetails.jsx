import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatDate } from "../utils/helpers";
import ShareMenu from "../components/ShareMenu";

const FALLBACK = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80";

export default function NewsDetails() {
  const { state: article } = useLocation();
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark, user } = useApp();

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">📰</p>
        <h2 className="font-display text-2xl font-bold mb-2" style={{ color: "var(--color-text)" }}>
          Article not found
        </h2>
        <p className="mb-6" style={{ color: "var(--color-muted)" }}>
          This article may have expired or is unavailable.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const saved = isBookmarked(article.url);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm mb-6 hover:underline"
        style={{ color: "var(--color-muted)" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Source + date */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span
          className="inline-block text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm"
          style={{ backgroundColor: "var(--color-accent)", color: "white" }}
        >
          {article.source?.name || "News"}
        </span>
        <span className="text-xs font-mono" style={{ color: "var(--color-muted)" }}>
          {formatDate(article.publishedAt)}
        </span>
        {article.author && (
          <>
            <span style={{ color: "var(--color-border)" }}>·</span>
            <span className="text-xs" style={{ color: "var(--color-muted)" }}>
              {article.author.split(",")[0]}
            </span>
          </>
        )}
      </div>

      {/* Title */}
      <h1
        className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-4"
        style={{ color: "var(--color-text)" }}
      >
        {article.title}
      </h1>

      {/* Description */}
      {article.description && (
        <p
          className="text-lg leading-relaxed mb-6 border-l-4 pl-4"
          style={{ color: "var(--color-muted)", borderColor: "var(--color-accent)" }}
        >
          {article.description}
        </p>
      )}

      {/* Action bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Bookmark */}
        <button
          onClick={() => {
            if (!user) { alert("Sign in to bookmark articles"); return; }
            toggleBookmark(article);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
          style={{
            borderColor: saved ? "var(--color-accent)" : "var(--color-border)",
            color: saved ? "var(--color-accent)" : "var(--color-muted)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          {saved ? "Saved" : "Save article"}
        </button>

        {/* Share (full dropdown) */}
        <ShareMenu article={article} compact={false} />

        {/* Read full */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          Read full article
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Hero image */}
      <div className="rounded-xl overflow-hidden mb-6 h-64 sm:h-80">
        <img
          src={article.urlToImage || FALLBACK}
          onError={(e) => { e.target.src = FALLBACK; }}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      {article.content && (
        <div className="leading-relaxed space-y-4" style={{ color: "var(--color-text)" }}>
          <p className="text-base sm:text-lg">
            {article.content.replace(/\[\+\d+ chars\]/g, "").trim()}
          </p>
          <p className="text-sm italic" style={{ color: "var(--color-muted)" }}>
            This is a preview. Read the complete story on the publisher's website.
          </p>
        </div>
      )}

      {/* Footer CTA */}
      <div
        className="mt-10 rounded-xl p-6 text-center"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--color-muted)" }}>
          Continue reading
        </p>
        <h3 className="font-display font-bold text-lg mb-4" style={{ color: "var(--color-text)" }}>
          Read the full story on {article.source?.name || "the source"}
        </h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Open original article →
          </a>
          <ShareMenu article={article} compact={false} />
        </div>
      </div>
    </article>
  );
}
