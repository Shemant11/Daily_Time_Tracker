/** Formats total seconds as HH:MM:SS (always includes hours) */
export function formatHMS(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Formats minutes as "Xh Ym" (or "Ym" if under an hour) */
export function formatMinutes(totalMinutes: number): string {
  const m = Math.round(totalMinutes);
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem}m`;
  if (rem === 0) return `${h}h`;
  return `${h}h ${rem}m`;
}

export function minutesToSeconds(min: number) {
  return min * 60;
}

export function secondsToMinutes(sec: number) {
  return sec / 60;
}

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}
