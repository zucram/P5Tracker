// Analytics must never interrupt navigation, progress or save transfers.
export function trackEvent(eventName, eventData = {}) {
  try {
    globalThis.window?.umami?.track(eventName, eventData)?.catch?.(() => {});
  } catch { /* Keep the app usable when analytics is unavailable. */ }
}
