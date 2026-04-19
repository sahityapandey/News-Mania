// ─────────────────────────────────────────────────────────────
//  Supabase client
//  Replace the two env vars below with your own project values:
//    VITE_SUPABASE_URL  →  https://xyzcompany.supabase.co
//    VITE_SUPABASE_ANON_KEY  →  eyJhbGci…
//
//  Free project: https://supabase.com/dashboard/new
// ─────────────────────────────────────────────────────────────

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// ── Tiny fetch wrapper (no SDK dependency needed) ─────────────
async function sb(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase not configured — add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env");
  }
  const url = `${SUPABASE_URL}/rest/v1${path}`;
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
    ...options.headers,
  };
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Supabase error");
  }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

// ── Auth via Supabase Auth REST ───────────────────────────────
async function authFetch(path, body) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("Supabase not configured");
  }
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Auth error");
  return data;
}

export const supabase = {
  isConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),

  // ── Auth ────────────────────────────────────────────────────
  async signUp(email, password, name) {
    const data = await authFetch("/signup", {
      email,
      password,
      data: { name },
    });
    return data; // { user, session }
  },

  async signIn(email, password) {
    const data = await authFetch("/token?grant_type=password", {
      email,
      password,
    });
    return data; // { access_token, user }
  },

  async signOut(accessToken) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  // ── Users table ─────────────────────────────────────────────
  async upsertProfile(userId, profile) {
    return sb(`/profiles?id=eq.${userId}`, {
      method: "PATCH",
      body: JSON.stringify(profile),
    });
  },

  async getProfile(userId) {
    const rows = await sb(`/profiles?id=eq.${userId}&select=*`);
    return rows[0] || null;
  },

  // ── Bookmarks table ─────────────────────────────────────────
  async getBookmarks(userId) {
    return sb(`/bookmarks?user_id=eq.${userId}&select=*&order=created_at.desc`);
  },

  async addBookmark(userId, article) {
    return sb("/bookmarks", {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        url: article.url,
        title: article.title,
        description: article.description,
        image: article.urlToImage,
        source: article.source?.name,
        published_at: article.publishedAt,
        article_json: article,
      }),
    });
  },

  async removeBookmark(userId, articleUrl) {
    return sb(`/bookmarks?user_id=eq.${userId}&url=eq.${encodeURIComponent(articleUrl)}`, {
      method: "DELETE",
    });
  },
};

// ─────────────────────────────────────────────────────────────
//  SQL to run once in Supabase SQL editor:
//
//  create table profiles (
//    id uuid primary key references auth.users(id) on delete cascade,
//    name text,
//    avatar_url text,
//    created_at timestamptz default now()
//  );
//
//  create table bookmarks (
//    id bigserial primary key,
//    user_id uuid references auth.users(id) on delete cascade,
//    url text not null,
//    title text,
//    description text,
//    image text,
//    source text,
//    published_at timestamptz,
//    article_json jsonb,
//    created_at timestamptz default now(),
//    unique(user_id, url)
//  );
//
//  alter table profiles enable row level security;
//  alter table bookmarks enable row level security;
//
//  create policy "Users manage own profile"
//    on profiles for all using (auth.uid() = id);
//
//  create policy "Users manage own bookmarks"
//    on bookmarks for all using (auth.uid() = user_id);
// ─────────────────────────────────────────────────────────────
