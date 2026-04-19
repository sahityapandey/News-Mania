import { getDailyQuote } from "../utils/quotes";

const quote = getDailyQuote(); // stable for the whole session

export default function DailyQuote() {
  return (
    <div
      className="border-b"
      style={{
        backgroundColor: "var(--color-accent)",
        borderColor: "rgba(0,0,0,0.15)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3">
        <span className="text-white/60 text-lg flex-shrink-0">"</span>
        <p className="text-white text-xs sm:text-sm text-center flex-1 leading-relaxed">
          <span className="italic">{quote.text}</span>
          <span className="not-italic font-semibold text-white/80 ml-2">— {quote.author}</span>
        </p>
        <span className="text-white/60 text-lg flex-shrink-0">"</span>
      </div>
    </div>
  );
}
