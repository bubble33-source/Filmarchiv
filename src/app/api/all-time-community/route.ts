import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("ratings").select("tmdb_id, media_type, stars").limit(5000);

  if (error || !data) {
    return NextResponse.json({ entries: [] });
  }

  const grouped = new Map<string, { tmdb_id: number; media_type: "movie" | "tv"; sum: number; count: number }>();

  for (const row of data as Array<{ tmdb_id: number; media_type: "movie" | "tv"; stars: number }>) {
    const key = `${row.media_type}:${row.tmdb_id}`;
    const current = grouped.get(key) ?? { tmdb_id: row.tmdb_id, media_type: row.media_type, sum: 0, count: 0 };
    current.sum += row.stars;
    current.count += 1;
    grouped.set(key, current);
  }

  const entries = [...grouped.values()]
    .map((item) => ({ tmdb_id: item.tmdb_id, media_type: item.media_type, avg: item.sum / item.count, count: item.count }))
    .sort((a, b) => b.avg - a.avg || b.count - a.count)
    .slice(0, 10);

  return NextResponse.json({ entries });
}
