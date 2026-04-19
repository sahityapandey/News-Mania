import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

export default function AuthModal({ open, mode, setMode, onClose }) {
  const { login, signup } = useApp();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");
    setForm({ name: "", email: "", password: "" });
  }, [mode, open]);

  // Lock scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const handle = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!form.name.trim()) throw new Error("Name is required");
        signup(form.name.trim(), form.email.trim(), form.password);
      } else {
        login(form.email.trim(), form.password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = "text") => (
    <div>
      <label
        className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
        style={{ color: "var(--color-muted)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
        required
        className="input-base"
        autoComplete={type === "password" ? "current-password" : "off"}
      />
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 animate-slide-up shadow-2xl"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold" style={{ color: "var(--color-text)" }}>
              {mode === "login" ? "Welcome back" : "Join News Mania"}
            </h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
              {mode === "login"
                ? "Sign in to access your saved articles"
                : "Create a free account to save articles"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
            style={{ color: "var(--color-muted)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handle} className="space-y-4">
          {mode === "signup" && field("Full Name", "name")}
          {field("Email", "email", "email")}
          {field("Password", "password", "password")}

          {error && (
            <p className="text-sm rounded-lg px-3 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity"
            style={{ backgroundColor: "var(--color-accent)", color: "white", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm mt-5" style={{ color: "var(--color-muted)" }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="font-semibold hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            {mode === "login" ? "Sign up free" : "Sign in"}
          </button>
        </p>

        <p className="text-xs text-center mt-4" style={{ color: "var(--color-muted)" }}>
          Demo app · credentials stored locally in your browser
        </p>
      </div>
    </div>
  );
}
