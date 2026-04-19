import { useState } from "react";
import { shareArticle, SOCIAL_SHARE } from "../utils/share";

const SOCIALS = [
  { key: "twitter", label: "X / Twitter", color: "#000", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { key: "whatsapp", label: "WhatsApp", color: "#25D366", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.072 23.929l6.264-1.643A11.96 11.96 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.894a9.884 9.884 0 01-5.032-1.376l-.361-.214-3.719.975.993-3.623-.235-.373A9.862 9.862 0 012.105 12c0-5.46 4.435-9.894 9.895-9.894 5.458 0 9.893 4.434 9.893 9.894 0 5.46-4.435 9.894-9.893 9.894z"/>
    </svg>
  )},
  { key: "linkedin", label: "LinkedIn", color: "#0A66C2", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )},
  { key: "facebook", label: "Facebook", color: "#1877F2", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )},
];

export default function ShareMenu({ article, compact = false }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleNativeShare = async (e) => {
    e.stopPropagation();
    const result = await shareArticle(article);
    if (result === "copied") {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setOpen(false);
  };

  if (compact) {
    // Just a share icon button for cards
    return (
      <button
        onClick={handleNativeShare}
        title="Share article"
        className="p-1.5 rounded-lg transition-colors hover:bg-ink-100 dark:hover:bg-ink-800"
        style={{ color: copied ? "var(--color-accent)" : "var(--color-muted)" }}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
        )}
      </button>
    );
  }

  // Full share panel (for article detail)
  return (
    <div className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
        style={{ borderColor: "var(--color-border)", color: "var(--color-muted)", backgroundColor: "var(--color-surface)" }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? "Copied!" : "Share"}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute left-0 top-full mt-2 w-48 rounded-xl shadow-xl z-20 overflow-hidden animate-slide-up"
            style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={SOCIAL_SHARE[s.key](article)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
                style={{ color: "var(--color-text)" }}
              >
                <span style={{ color: s.color }}>{s.icon}</span>
                {s.label}
              </a>
            ))}
            <hr style={{ borderColor: "var(--color-border)" }} />
            <button
              onClick={handleNativeShare}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-ink-50 dark:hover:bg-ink-800 transition-colors"
              style={{ color: "var(--color-text)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy link
            </button>
          </div>
        </>
      )}
    </div>
  );
}
