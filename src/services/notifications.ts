export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

export function notify(title: string, body: string, icon = "📚") {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: undefined, tag: title });
  } catch {
    // Some environments (e.g. sandboxed iframes) can throw — fail silently.
  }
}
