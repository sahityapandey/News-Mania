import { useState } from "react";
import { useWeather } from "../hooks/useWeather";

function CityPill({ data }) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 rounded-lg"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
        {data.city}
      </span>
      <span className="flex items-center gap-1.5 text-sm">
        <span>{data.icon}</span>
        <span className="font-mono font-semibold" style={{ color: "var(--color-text)" }}>
          {data.temp}°
        </span>
      </span>
    </div>
  );
}

export default function WeatherWidget() {
  const { current, cities, loading, error } = useWeather();
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="rounded-xl p-4" style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}>
        <div className="h-4 w-24 rounded shimmer-bg mb-3" />
        <div className="h-12 w-full rounded shimmer-bg mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-8 rounded shimmer-bg" />)}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <p
          className="text-xs font-mono uppercase tracking-widest font-semibold mb-3"
          style={{ color: "var(--color-muted)" }}
        >
          🌤 Weather
        </p>

        {current ? (
          <>
            {/* Current location */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                  📍 {current.city}
                </p>
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-4xl">{current.icon}</span>
                  <div>
                    <span
                      className="font-display font-black text-3xl"
                      style={{ color: "var(--color-text)" }}
                    >
                      {current.temp}°C
                    </span>
                    <p className="text-xs" style={{ color: "var(--color-muted)" }}>
                      {current.label}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right text-xs" style={{ color: "var(--color-muted)" }}>
                <div>💨 {current.wind} km/h</div>
                <div>💧 {current.humidity}%</div>
                <div className="mt-0.5">Feels {current.feels}°</div>
              </div>
            </div>

            {/* 5-day forecast */}
            {current.daily?.length > 0 && (
              <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
                {current.daily.slice(0, 5).map((d) => {
                  const label = new Date(d.date).toLocaleDateString("en-IN", { weekday: "short" });
                  return (
                    <div
                      key={d.date}
                      className="flex-shrink-0 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-center"
                      style={{ backgroundColor: "var(--color-bg)", minWidth: "48px" }}
                    >
                      <span className="text-xs" style={{ color: "var(--color-muted)" }}>{label}</span>
                      <span className="text-base">{d.icon}</span>
                      <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>{d.max}°</span>
                      <span className="text-xs" style={{ color: "var(--color-muted)" }}>{d.min}°</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <p className="text-xs py-2" style={{ color: "var(--color-muted)" }}>
            {error || "Enable location to see your weather"}
          </p>
        )}
      </div>

      {/* City list */}
      {cities.length > 0 && (
        <div
          className="border-t px-4 py-3"
          style={{ borderColor: "var(--color-border)" }}
        >
          <p
            className="text-xs font-mono uppercase tracking-widest font-semibold mb-2"
            style={{ color: "var(--color-muted)" }}
          >
            Other Cities
          </p>
          <div className="space-y-1.5">
            {(showAll ? cities : cities.slice(0, 3)).map((c) => (
              <CityPill key={c.city} data={c} />
            ))}
          </div>
          {cities.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-2 text-xs hover:underline"
              style={{ color: "var(--color-accent)" }}
            >
              {showAll ? "Show less ▲" : `+${cities.length - 3} more cities ▼`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
