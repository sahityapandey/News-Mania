import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

const AppContext = createContext(null);

const ls = {
  get: (k, fallback = null) => { try { return JSON.parse(localStorage.getItem(k)) ?? fallback; } catch { return fallback; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k),
};

export function AppProvider({ children }) {
  const [dark, setDark] = useState(() => {
    const saved = ls.get("theme", null);
    if (saved !== null) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    ls.set("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  const [session, setSession] = useState(() => ls.get("nm_session", null));
  const user = session?.user ?? null;

  const _saveSession = (sess) => {
    setSession(sess);
    if (sess) ls.set("nm_session", sess);
    else ls.del("nm_session");
  };

  const _loadDbBookmarks = async (userId) => {
    try {
      const rows = await supabase.getBookmarks(userId);
      const arts = rows.map((r) => r.article_json).filter(Boolean);
      setBookmarks(arts);
      ls.set("nm_bookmarks", arts);
    } catch { /* use local */ }
  };

  const signup = useCallback(async (name, email, password) => {
    if (supabase.isConfigured) {
      const data = await supabase.signUp(email, password, name);
      const sess = { user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name || name }, accessToken: data.access_token };
      _saveSession(sess);
      _loadDbBookmarks(sess.user.id);
    } else {
      const users = ls.get("nm_users", []);
      if (users.find((u) => u.email === email)) throw new Error("Email already registered");
      const newUser = { id: Date.now().toString(), name, email };
      ls.set("nm_users", [...users, { ...newUser, password }]);
      _saveSession({ user: newUser, accessToken: null });
    }
  }, []);

  const login = useCallback(async (email, password) => {
    if (supabase.isConfigured) {
      const data = await supabase.signIn(email, password);
      const sess = { user: { id: data.user.id, email: data.user.email, name: data.user.user_metadata?.name || email.split("@")[0] }, accessToken: data.access_token };
      _saveSession(sess);
      _loadDbBookmarks(sess.user.id);
    } else {
      const users = ls.get("nm_users", []);
      const found = users.find((u) => u.email === email && u.password === password);
      if (!found) throw new Error("Invalid email or password");
      const { password: _pw, ...userData } = found;
      _saveSession({ user: userData, accessToken: null });
    }
  }, []);

  const logout = useCallback(async () => {
    if (supabase.isConfigured && session?.accessToken) {
      await supabase.signOut(session.accessToken).catch(() => {});
    }
    _saveSession(null);
    setBookmarks([]);
  }, [session]);

  const [bookmarks, setBookmarks] = useState(() => ls.get("nm_bookmarks", []));

  useEffect(() => {
    if (supabase.isConfigured && session?.user?.id) {
      _loadDbBookmarks(session.user.id);
    }
  }, []);

  const toggleBookmark = useCallback(async (article) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.url === article.url);
      const updated = exists ? prev.filter((b) => b.url !== article.url) : [article, ...prev];
      ls.set("nm_bookmarks", updated);
      if (supabase.isConfigured && user?.id) {
        if (exists) supabase.removeBookmark(user.id, article.url).catch(() => {});
        else supabase.addBookmark(user.id, article).catch(() => {});
      }
      return updated;
    });
  }, [user]);

  const isBookmarked = useCallback((url) => bookmarks.some((b) => b.url === url), [bookmarks]);

  return (
    <AppContext.Provider value={{ dark, toggleDark, user, session, login, signup, logout, bookmarks, toggleBookmark, isBookmarked, isSupabaseConfigured: supabase.isConfigured }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
