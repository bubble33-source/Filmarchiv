import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { getTrending } from "@/lib/tmdb";
import { getSupabaseClient } from "@/lib/supabase";

async function getMostSearched() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("search_events")
      .select("query")
      .limit(1000);

    if (error || !data) {
      return ["TODO: search_events Tabelle konfigurieren"];
    }

    const frequency = new Map<string, number>();
    for (const row of data as Array<{ query: string }>) {
      const normalized = row.query.trim().toLowerCase();
      if (!normalized) continue;
      frequency.set(normalized, (frequency.get(normalized) ?? 0) + 1);
    }

    return [...frequency.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query]) => query);
  } catch {
    return ["TODO: search_events Tabelle konfigurieren"];
  }
}

async function getAllTimeTop() {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("ratings")
      .select("tmdb_id, media_type, stars")
      .limit(5000);

    if (error || !data) {
      return [] as Array<{ tmdb_id: number; media_type: "movie" | "tv"; avg: number; count: number }>;
    }

    const grouped = new Map<string, { tmdb_id: number; media_type: "movie" | "tv"; sum: number; count: number }>();
    for (const row of data as Array<{ tmdb_id: number; media_type: "movie" | "tv"; stars: number }>) {
      const key = `${row.media_type}:${row.tmdb_id}`;
      const current = grouped.get(key) ?? { tmdb_id: row.tmdb_id, media_type: row.media_type, sum: 0, count: 0 };
      current.sum += row.stars;
      current.count += 1;
      grouped.set(key, current);
    }

    return [...grouped.values()]
      .map((item) => ({ ...item, avg: item.sum / item.count }))
      .sort((a, b) => b.avg - a.avg || b.count - a.count)
      .slice(0, 10);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [trendingMovies, trendingSeries, topQueries, allTimeTop] = await Promise.all([
    getTrending("movie"),
    getTrending("tv"),
    getMostSearched(),
    getAllTimeTop()
  ]);

  return (
    <div className="grid" style={{ gap: "1.25rem" }}>
      <AdSlot placement="home-top" minHeight={140} />
      <section className="card">
        <h2>Top aktuell – Filme</h2>
        <ul className="list">
          {trendingMovies.map((item) => (
            <li key={item.id}>
              <Link href={`/title/movie/${item.id}`}>{item.title ?? item.name}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2>Top aktuell – Serien</h2>
        <ul className="list">
          {trendingSeries.map((item) => (
            <li key={item.id}>
              <Link href={`/title/tv/${item.id}`}>{item.name ?? item.title}</Link>
            </li>
          ))}
        </ul>
      </section>
      <section className="card">
        <h2>Meistgesuchte Begriffe</h2>
        <ol className="list">
          {topQueries.map((query) => (
            <li key={query}>{query}</li>
          ))}
        </ol>
      </section>
      <section className="card">
        <h2>All-Time Top (Community)</h2>
        {allTimeTop.length === 0 ? (
          <p>Noch keine Community-Bewertungen vorhanden.</p>
        ) : (
          <ol className="list">
            {allTimeTop.map((entry) => (
              <li key={`${entry.media_type}-${entry.tmdb_id}`}>
                <Link href={`/title/${entry.media_type}/${entry.tmdb_id}`}>
                  {entry.media_type.toUpperCase()} #{entry.tmdb_id}
                </Link>{" "}
                – {entry.avg.toFixed(1)} / 5 ({entry.count})
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
