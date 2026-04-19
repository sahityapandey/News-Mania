# The News Mania v2.0 — Enhanced Edition

A production-grade news application built with React 19, Tailwind CSS, and the NewsAPI.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Add your NewsAPI key to .env
VITE_NEWS_API_KEY=your_key_here

# 3. Start development server
npm run dev
```

Get a free API key at https://newsapi.org/register

---

## 📁 Project Structure

```
src/
├── context/
│   └── AppContext.jsx      # Global state: theme, auth, bookmarks
├── hooks/
│   └── useNews.js          # Custom hook — fetch, cache, abort
├── utils/
│   └── helpers.js          # debounce, formatDate, timeAgo, truncate
├── components/
│   ├── Navbar.jsx          # Sticky nav, search, categories, mobile menu
│   ├── Hero.jsx            # Featured articles grid
│   ├── Content.jsx         # Article list feed + sidebar
│   ├── ArticleCard.jsx     # HeroCard, MediumCard, ListCard, Skeletons
│   ├── AuthModal.jsx       # Login/Signup modal
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx            # Homepage combining Hero + Content
│   ├── NewsDetails.jsx     # Article detail view
│   └── Bookmarks.jsx       # Saved articles page
├── App.jsx                 # Routes + layout
├── main.jsx                # React entry
└── index.css               # Tailwind + CSS variables for theming
```

---

## ✅ Features Implemented

### New vs Original

| Feature                  | Original | v2.0 |
|--------------------------|----------|-------|
| News feed                | ✅       | ✅ Enhanced |
| Category nav             | ✅       | ✅ Active state |
| Search (debounced)       | ✅       | ✅ Improved |
| Dark mode                | ⚠️ Basic | ✅ CSS vars + persistence |
| Bookmarks                | ⚠️ Partial | ✅ Full, persisted |
| User auth                | ❌       | ✅ Local (signup/login) |
| Article detail page      | ✅       | ✅ Redesigned |
| Loading skeletons        | ❌       | ✅ |
| API caching              | ❌       | ✅ In-memory per session |
| AbortController          | ❌       | ✅ Cancels in-flight |
| Error handling           | ❌       | ✅ User-friendly |
| Mobile responsive        | ⚠️       | ✅ Full |
| Bookmarks page           | ❌       | ✅ |
| Footer                   | ❌       | ✅ |
| CSS design system        | ❌       | ✅ CSS variables |
| Custom fonts             | ❌       | ✅ Playfair + DM Sans |
| Fade/slide animations    | ❌       | ✅ |

---

## 🏗️ Architecture Decisions

### Global State via Context
`AppContext` manages three concerns in one place:
- **Theme**: persisted to localStorage, respects OS preference
- **Auth**: simple local-storage-backed credential system
- **Bookmarks**: persisted array of article objects

### Custom `useNews` Hook
Handles the full data lifecycle:
- Builds correct NewsAPI endpoint (top-headlines vs everything)
- In-memory cache prevents redundant API calls
- AbortController cancels stale requests on query change
- Returns `{ articles, loading, error, refetch }`

### CSS Variable Design System
All colors flow through CSS custom properties on `:root` and `.dark`.
Tailwind classes + inline `style={{ color: "var(--color-text)" }}` give
full control without fighting Tailwind's dark mode purging.

---

## 🌐 Deployment

### Vercel (recommended)
```bash
npm install -g vercel
vercel --prod
# Add VITE_NEWS_API_KEY in Vercel dashboard → Settings → Environment Variables
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
# Add env var in Netlify UI
```

### Note on NewsAPI
NewsAPI's **free tier only works on localhost**. For production you need:
1. A paid NewsAPI plan, **OR**
2. A backend proxy (Express/Next.js API route) that injects the key server-side

---

## 🔮 Further Scalability Suggestions

### Backend (Phase 2)
- **Next.js** — convert to Next.js App Router for SSR, API routes (hides API key)
- **Node/Express proxy** — `/api/news` route that calls NewsAPI server-side
- **Supabase** — replace localStorage auth with real user accounts + DB bookmarks
- **Redis cache** — cache API responses server-side for 5-10 minutes

### Features (Phase 3)
- Full-text search with Algolia or Meilisearch
- Email newsletter digest (Resend or SendGrid)
- Push notifications for breaking news (Web Push API)
- Personalized feed based on reading history
- Article sharing with OG cards (Next.js dynamic OG)
- Comments/reactions (Supabase Realtime)

### Performance
- React Query or SWR for server-state management
- Image optimization with `<picture>` + `srcset`
- Route-based code splitting with `React.lazy`
- Service Worker for offline reading of bookmarks
