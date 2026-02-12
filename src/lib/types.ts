export type MediaType = "movie" | "tv";

export type TmdbTitle = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  overview: string;
  vote_average: number;
};

export type ConsentState = {
  essential: true;
  marketing: boolean;
};
