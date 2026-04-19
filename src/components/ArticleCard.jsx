import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { timeAgo, truncate } from "../utils/helpers";
import ShareMenu from "./ShareMenu";

const FALLBACK = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80";

function BookmarkBtn({ article }) {
  const { isBookmarked, toggleBookmark, user } = useApp();
  const saved = isBookmarked(article.url);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!user) { alert("Sign in to bookmark articles"); return; }
        toggleBookmark(article);
      }}
      aria-label={saved ? "Remove bookmark" : "Bookmark article"}
      className="p-1.5 rounded-lg transition-colors hover:bg-ink-100 dark:hover:bg-ink-800"
      style={{ color: saved ? "var(--color-accent)" : "var(--color-muted)" }}
    >
      <svg className="w-4 h-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}

// ── Large hero card ───────────────────────────────────────────
export function HeroCard({ article }) {
  const navigate = useNavigate();
  return (
    <div
      className="relative overflow-hidden rounded-xl cursor-pointer group h-[420px] sm:h-[480px]"
      onClick={() => navigate("/news", { state: article })}
    >
      <img
        src={article.urlToImage || FALLBACK}
        onError={(e) => { e.target.src = FALLBACK; }}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
        <SourceTag article={article} />
        <h2 className="font-display font-bold text-white text-xl sm:text-2xl lg:text-3xl mt-2 leading-snug">
          {article.title}
        </h2>
        <p className="text-white/70 text-sm mt-2 hidden sm:block line-clamp-2">{article.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-white/50 text-xs font-mono">{timeAgo(article.publishedAt)}</span>
          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
            <ShareMenu article={article} compact />
            <BookmarkBtn article={article} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Medium card (grid) ────────────────────────────────────────
export function MediumCard({ article }) {
  const navigate = useNavigate();
  return (
    <div
      className="relative overflow-hidden rounded-xl cursor-pointer group h-[200px]"
      onClick={() => navigate("/news", { state: article })}
    >
      <img
        src={article.urlToImage || FALLBACK}
        onError={(e) => { e.target.src = FALLBACK; }}
        alt={article.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 p-3">
        <p className="text-white text-sm font-semibold leading-snug line-clamp-2">{article.title}</p>
        <span className="text-white/50 text-xs font-mono mt-1 block">{timeAgo(article.publishedAt)}</span>
      </div>
    </div>
  );
}

// ── List row card ─────────────────────────────────────────────
export function ListCard({ article, index }) {
  const navigate = useNavigate();
  return (
    <article
      className="flex gap-4 py-4 border-b cursor-pointer group animate-fade-in"
      style={{
        borderColor: "var(--color-border)",
        animationDelay: `${index * 40}ms`,
        animationFillMode: "both",
      }}
      onClick={() => navigate("/news", { state: article })}
    >
      {/* Index number */}
      <span
        className="font-display font-black text-3xl leading-none w-8 flex-shrink-0 mt-1"
        style={{ color: "var(--color-border)" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex-1 min-w-0">
        <SourceTag article={article} />
        <h3
          className="font-semibold text-base mt-1 leading-snug group-hover:underline decoration-accent/50"
          style={{ color: "var(--color-text)" }}
        >
          {article.title}
        </h3>
        <p className="text-sm mt-1 line-clamp-2 hidden sm:block" style={{ color: "var(--color-muted)" }}>
          {truncate(article.description, 140)}
        </p>
        <span className="text-xs font-mono mt-1.5 block" style={{ color: "var(--color-muted)" }}>
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      {article.urlToImage && (
        <img
          src={article.urlToImage}
          onError={(e) => { e.target.style.display = "none"; }}
          alt=""
          className="w-24 h-20 sm:w-28 sm:h-24 object-cover rounded-lg flex-shrink-0"
        />
      )}

      <div className="flex-shrink-0 self-center flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
        <BookmarkBtn article={article} />
        <ShareMenu article={article} compact />
      </div>
    </article>
  );
}

function SourceTag({ article }) {
  const source = article.source?.name;
  if (!source) return null;
  return (
    <span
      className="inline-block text-xs font-mono uppercase tracking-widest px-2 py-0.5 rounded-sm"
      style={{ backgroundColor: "var(--color-accent)", color: "white" }}
    >
      {source}
    </span>
  );
}

// ── Skeleton loaders ──────────────────────────────────────────
export function HeroSkeleton() {
  return <div className="rounded-xl h-[420px] sm:h-[480px] shimmer-bg" />;
}

export function ListSkeleton({ count = 6 }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
          <div className="w-8 h-8 rounded shimmer-bg flex-shrink-0 mt-1" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-3 rounded shimmer-bg w-1/4" />
            <div className="h-4 rounded shimmer-bg w-full" />
            <div className="h-4 rounded shimmer-bg w-3/4" />
            <div className="h-3 rounded shimmer-bg w-1/5" />
          </div>
          <div className="w-24 h-20 rounded-lg shimmer-bg flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
