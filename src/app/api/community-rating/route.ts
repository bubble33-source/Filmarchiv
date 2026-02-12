import { NextRequest, NextResponse } from "next/server";
import { normalizeMediaType } from "@/lib/mediaType";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const tmdbId = Number(request.nextUrl.searchParams.get("tmdbId"));
  const mediaTypeRaw = request.nextUrl.searchParams.get("mediaType") ?? "";
  const mediaType = normalizeMediaType(mediaTypeRaw);

  if (!Number.isFinite(tmdbId) || !mediaType) {
    return NextResponse.json({ avg: 0, count: 0 });
  }

  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("ratings")
    .select("stars")
    .eq("tmdb_id", tmdbId)
    .eq("media_type", mediaType);

  if (error || !data || data.length === 0) {
    return NextResponse.json({ avg: 0, count: 0 });
  }

  const stars = data.map((row) => row.stars as number);
  const avg = stars.reduce((sum, current) => sum + current, 0) / stars.length;
  return NextResponse.json({ avg, count: stars.length });
}

export async function POST(request: NextRequest) {
  try {
    const { tmdbId, mediaType: mediaTypeRaw, stars } = (await request.json()) as {
      tmdbId: number;
      mediaType: string;
      stars: number;
    };

    const mediaType = normalizeMediaType(mediaTypeRaw);
    if (!Number.isFinite(tmdbId) || !mediaType || !Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: "Ungültige Eingaben." }, { status: 400 });
    }

    const authHeader = request.headers.get("authorization") ?? "";
    const accessToken = authHeader.startsWith("Bearer ") ? authHeader.replace("Bearer ", "") : undefined;

    if (!accessToken) {
      return NextResponse.json({ error: "Bitte einloggen." }, { status: 401 });
    }

    const supabase = getSupabaseServerClient(accessToken);
    const { data: userResult } = await supabase.auth.getUser(accessToken);
    const userId = userResult.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Bitte einloggen." }, { status: 401 });
    }

    const { error } = await supabase.from("ratings").upsert(
      {
        user_id: userId,
        tmdb_id: tmdbId,
        media_type: mediaType,
        stars
      },
      { onConflict: "user_id,tmdb_id,media_type" }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Serverfehler" }, { status: 500 });
  }
}
