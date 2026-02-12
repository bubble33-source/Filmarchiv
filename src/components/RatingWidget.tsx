"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";

type Props = {
  tmdbId: number;
  mediaType: "movie" | "tv";
};

export function RatingWidget({ tmdbId, mediaType }: Props) {
  const [stars, setStars] = useState(0);
  const [status, setStatus] = useState<string>("Bewerte diesen Titel (Login erforderlich).");

  const submit = async (value: number) => {
    const supabase = getSupabaseBrowserClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      setStatus("Bitte zuerst einloggen.");
      return;
    }
    setStars(value);
    const response = await fetch("/api/community-rating", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tmdbId, mediaType, stars: value })
    });

    if (response.ok) {
      setStatus("Bewertung gespeichert.");
      window.dispatchEvent(new Event("community-rating-updated"));
      return;
    }

    const result = (await response.json()) as { error?: string };
    setStatus(result.error ?? "Konnte Bewertung nicht speichern.");
  };

  return (
    <div className="card">
      <h3>Deine Bewertung</h3>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            className="secondary"
            style={{ background: value <= stars ? "#f59e0b" : "#334155" }}
            onClick={() => submit(value)}
            aria-label={`${value} Sterne`}
          >
            ★
          </button>
        ))}
      </div>
      <small>{status}</small>
    </div>
  );
}
