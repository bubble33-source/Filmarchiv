"use client";

import { useEffect, useState } from "react";

type ScoreResponse = { avg: number; count: number };

export function CommunityScore({ tmdbId, mediaType }: { tmdbId: number; mediaType: "movie" | "tv" }) {
  const [score, setScore] = useState<ScoreResponse>({ avg: 0, count: 0 });

  useEffect(() => {
    const load = () => {
      fetch(`/api/community-rating?tmdbId=${tmdbId}&mediaType=${mediaType}`)
        .then((response) => response.json())
        .then((data) => setScore(data))
        .catch(() => setScore({ avg: 0, count: 0 }));
    };

    load();
    window.addEventListener("community-rating-updated", load);
    return () => window.removeEventListener("community-rating-updated", load);
  }, [tmdbId, mediaType]);

  return (
    <div className="card">
      <h3>Community Score</h3>
      <p style={{ fontSize: "1.5rem", margin: 0 }}>{score.avg.toFixed(1)} / 5</p>
      <p style={{ margin: 0 }}>{score.count} Bewertungen</p>
    </div>
  );
}
