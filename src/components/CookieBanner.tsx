"use client";

import { useEffect, useState } from "react";
import { defaultConsent, readConsentFromStorage, writeConsentToStorage, CONSENT_STORAGE_KEY } from "@/lib/consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isSet = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    setVisible(!isSet);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <aside style={{ position: "fixed", bottom: 16, right: 16, width: 380, zIndex: 1000 }} className="card">
      <h3>Cookie-Einwilligung</h3>
      <p>Essenzielle Cookies sind immer aktiv. Marketing ist optional und steuert Trailer-Einbettungen.</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            writeConsentToStorage({ ...defaultConsent(), marketing: false });
            setVisible(false);
          }}
          className="secondary"
        >
          Nur essenziell
        </button>
        <button
          onClick={() => {
            writeConsentToStorage({ ...defaultConsent(), marketing: true });
            setVisible(false);
          }}
        >
          Alle akzeptieren
        </button>
      </div>
      <small style={{ display: "block", marginTop: 8 }}>
        Du kannst deine Entscheidung jederzeit im Browser-Speicher ändern.
      </small>
    </aside>
  );
}
