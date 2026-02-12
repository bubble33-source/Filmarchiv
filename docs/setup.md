# Filmarchiv MVP Setup

## Benötigte ENV Variablen
- `TMDB_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Migration ausführen
1. SQL aus `supabase/migrations/202602120001_ratings_and_search_events.sql` in Supabase SQL Editor ausführen.
2. Optional `search_events` bei Suchfunktion befüllen.

## Lokale Entwicklung
```bash
npm install
npm run dev
```

Dann öffnen:
- `http://localhost:3000/`
- `http://localhost:3000/title/movie/550`
- `http://localhost:3000/title/tv/1399`
- `http://localhost:3000/privacy`
- `http://localhost:3000/imprint`
