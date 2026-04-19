import { HeroCard, MediumCard, HeroSkeleton } from "./ArticleCard";

export default function Hero({ articles, loading }) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <HeroSkeleton />
      </div>
    );
  }

  if (!articles.length) return null;

  const [main, ...rest] = articles;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 grid lg:grid-cols-3 gap-4">
      {/* Main big card */}
      <div className="lg:col-span-2">
        <HeroCard article={main} />
      </div>

      {/* Side grid */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
        {rest.slice(0, 2).map((art, i) => (
          <MediumCard key={i} article={art} />
        ))}
      </div>
    </section>
  );
}
