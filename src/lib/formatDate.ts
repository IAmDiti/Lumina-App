const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

// Deterministic across server and client (fixed locale + UTC), so SSR markup
// matches the client's first render exactly. Callers upgrade to
// formatDateLocal() after mount, once "undefined" locale is safe to use —
// see LocalTime.
export function formatDateStable(iso: string) {
  return new Date(iso).toLocaleString("en-US", { ...DATE_FORMAT, timeZone: "UTC" });
}

export function formatDateLocal(iso: string) {
  return new Date(iso).toLocaleString(undefined, DATE_FORMAT);
}
