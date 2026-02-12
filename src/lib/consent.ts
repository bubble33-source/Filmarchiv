import { ConsentState } from "@/lib/types";

export const CONSENT_STORAGE_KEY = "filmarchiv-consent";

export function defaultConsent(): ConsentState {
  return { essential: true, marketing: false };
}

export function readConsentFromStorage(): ConsentState {
  if (typeof window === "undefined") {
    return defaultConsent();
  }

  const rawValue = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  if (!rawValue) {
    return defaultConsent();
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ConsentState>;
    return {
      essential: true,
      marketing: Boolean(parsed.marketing)
    };
  } catch {
    return defaultConsent();
  }
}

export function writeConsentToStorage(consent: ConsentState) {
  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new Event("consent-changed"));
}
