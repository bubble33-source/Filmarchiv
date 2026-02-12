"use client";

import { useEffect, useState } from "react";
import { readConsentFromStorage } from "@/lib/consent";

export function TrailerSection({ youtubeKey }: { youtubeKey?: string }) {
  const [marketingEnabled, setMarketingEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setMarketingEnabled(readConsentFromStorage().marketing);
    sync();
    window.addEventListener("consent-changed", sync);
    return () => window.removeEventListener("consent-changed", sync);
  }, []);

  if (!youtubeKey) {
    return <p>Kein Trailer verfügbar.</p>;
  }

  if (!marketingEnabled) {
    return (
      <div className="card">
        <p>Trailer deaktiviert (Marketing-Cookies nicht akzeptiert).</p>
        <a href={`https://www.youtube.com/watch?v=${youtubeKey}`} target="_blank" rel="noreferrer">
          <button>YouTube öffnen</button>
        </a>
      </div>
    );
  }

  return (
    <iframe
      width="100%"
      height="360"
      src={`https://www.youtube-nocookie.com/embed/${youtubeKey}`}
      title="Trailer"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      style={{ borderRadius: 12, border: 0 }}
    />
  );
}
