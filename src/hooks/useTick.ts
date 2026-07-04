import { useEffect, useState } from "react";

/** Re-renders the calling component every `intervalMs`, returning Date.now(). */
export function useTick(intervalMs = 1000, active = true) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, active]);

  return now;
}
