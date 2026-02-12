import { MediaType, TmdbTitle } from "@/lib/types";

const baseUrl = "https://api.themoviedb.org/3";
const tmdbKey = process.env.TMDB_API_KEY;

async function fetchTmdb<T>(path: string): Promise<T> {
  if (!tmdbKey) {
    throw new Error("TMDB_API_KEY fehlt");
  }
  const response = await fetch(`${baseUrl}${path}${path.includes("?") ? "&" : "?"}api_key=${tmdbKey}&language=de-DE`, {
    next: { revalidate: 3600 }
  });
  if (!response.ok) {
    throw new Error(`TMDB Fehler: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getTrending(mediaType: MediaType): Promise<TmdbTitle[]> {
  const data = await fetchTmdb<{ results: TmdbTitle[] }>(`/trending/${mediaType}/week`);
  return data.results.slice(0, 10);
}

export async function getTitleDetails(mediaType: MediaType, tmdbId: number) {
  return fetchTmdb<TmdbTitle & { genres?: { id: number; name: string }[] }>(`/${mediaType}/${tmdbId}`);
}

export async function getTitleVideos(mediaType: MediaType, tmdbId: number) {
  const data = await fetchTmdb<{ results: Array<{ key: string; site: string; type: string; official?: boolean }> }>(`/${mediaType}/${tmdbId}/videos`);
  return data.results.filter((video) => video.site === "YouTube" && video.type === "Trailer");
}

export async function searchTmdb(query: string, mediaType: MediaType) {
  const data = await fetchTmdb<{ results: TmdbTitle[] }>(`/search/${mediaType}?query=${encodeURIComponent(query)}`);
  return data.results;
}
