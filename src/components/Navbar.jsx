import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { debounce } from "../utils/helpers";
import AuthModal from "./AuthModal";
import DailyQuote from "./DailyQuote";
import PopularDrawer from "./PopularDrawer";

const CATEGORIES = ["Latest","Technology","Sports","Business","Health","Science","Entertainment"];

export default function Navbar({ setQuery, activeCategory, setActiveCategory, articles }) {
  const { dark, toggleDark, user, logout } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSearch = useCallback(
    debounce((val) => {
      if (val.trim()) { setQuery(val.trim()); setActiveCategory(null); navigate("/"); }
    }, 500),
    [setQuery, setActiveCategory, navigate]
  );

  const handleCategory = (cat) => {
    setQuery(cat); setActiveCategory(cat); setMobileMenuOpen(false); navigate("/");
  };

  return (
    <>
      {/* Daily quote banner */}
      <DailyQuote />

      {/* Top meta strip */}
      <div className="border-b text-xs font-mono py-1.5 px-4 flex justify-between items-center"
        style={{ borderColor:"var(--color-border)", color:"var(--color-muted)", backgroundColor:"var(--color-surface)" }}>
        <span style={{ color:"var(--color-accent)" }} className="font-semibold tracking-widest uppercase hidden sm:inline">
          The News Mania
        </span>
        <span className="hidden sm:inline">
          {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
        </span>
        <div className="flex gap-4 items-center ml-auto">
          {user ? (
            <span className="flex gap-3 items-center">
              <span className="hidden sm:inline">👋 {user.name.split(" ")[0]}</span>
              <button onClick={logout} className="hover:underline" style={{color:"var(--color-accent)"}}>Sign out</button>
            </span>
          ) : (
            <span className="flex gap-3">
              <button onClick={()=>{setAuthMode("login");setShowAuth(true);}} className="hover:underline">Sign in</button>
              <button onClick={()=>{setAuthMode("signup");setShowAuth(true);}} className="hover:underline font-semibold" style={{color:"var(--color-accent)"}}>Join free</button>
            </span>
          )}
        </div>
      </div>

      {/* Main header */}
      <header style={{backgroundColor:"var(--color-surface)",borderColor:"var(--color-border)"}} className="border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-14 gap-3">

          {/* Hamburger / popular drawer trigger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 flex-shrink-0"
            style={{color:"var(--color-muted)"}}
            aria-label="Popular posts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
            <span className="font-display font-black text-2xl tracking-tight" style={{color:"var(--color-accent)"}}>NM</span>
            <span className="font-display font-bold text-lg hidden md:inline" style={{color:"var(--color-text)"}}>News Mania</span>
          </Link>

          {/* Search */}
          <div className="relative flex-1 max-w-sm mx-2 hidden sm:block">
            <input type="text" placeholder="Search topics, headlines…" className="input-base pr-8"
              onChange={(e) => handleSearch(e.target.value)} />
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{color:"var(--color-muted)"}}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx={11} cy={11} r={8}/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
            </svg>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1">
            <Link to="/bookmarks"
              className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 hidden sm:flex items-center gap-1.5 text-sm"
              style={{color:"var(--color-muted)"}}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
              </svg>
              <span>Saved</span>
            </Link>

            <button onClick={toggleDark}
              className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
              style={{color:"var(--color-muted)"}} aria-label="Toggle theme">
              {dark ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx={12} cy={12} r={5}/>
                  <path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                </svg>
              )}
            </button>

            {/* Mobile category toggle */}
            <button onClick={() => setMobileMenuOpen(v => !v)}
              className="sm:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
              style={{color:"var(--color-muted)"}}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h10"}/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden px-4 pb-3">
          <input type="text" placeholder="Search…" className="input-base"
            onChange={(e) => handleSearch(e.target.value)}/>
        </div>

        {/* Desktop category nav */}
        <nav style={{borderColor:"var(--color-border)"}} className="border-t overflow-x-auto hidden sm:block">
          <div className="max-w-7xl mx-auto px-6 flex">
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => handleCategory(cat)}
                className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all whitespace-nowrap border-b-2 ${activeCategory===cat?"border-accent":"border-transparent hover:border-ink-300 dark:hover:border-ink-600"}`}
                style={{color: activeCategory===cat ? "var(--color-accent)" : "var(--color-muted)"}}>
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile category menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t" style={{borderColor:"var(--color-border)",backgroundColor:"var(--color-surface)"}}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => handleCategory(cat)}
                  className="text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-ink-100 dark:hover:bg-ink-800"
                  style={{color: activeCategory===cat ? "var(--color-accent)" : "var(--color-text)"}}>
                  {cat}
                </button>
              ))}
              <hr style={{borderColor:"var(--color-border)"}} className="my-1"/>
              <Link to="/bookmarks" onClick={()=>setMobileMenuOpen(false)}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium"
                style={{color:"var(--color-text)"}}>
                📑 Saved Articles
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Popular posts drawer */}
      <PopularDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} articles={articles || []} />

      <AuthModal open={showAuth} mode={authMode} setMode={setAuthMode} onClose={() => setShowAuth(false)} />
    </>
  );
}
