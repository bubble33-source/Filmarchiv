import { MediaType } from "@/lib/types";

export function normalizeMediaType(input: string): MediaType | null {
  return input === "movie" || input === "tv" ? input : null;
}
