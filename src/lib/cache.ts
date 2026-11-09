// Tiny localStorage cache so repeat visits don't hammer rate-limited APIs.
// Storage can be unavailable (private windows, blocked cookies), so every access is guarded.
export async function cached<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const { at, data } = JSON.parse(raw) as { at: number; data: T }
      if (Date.now() - at < ttlMs) return data
    }
  } catch {
    /* ignore unreadable cache */
  }

  const data = await load()

  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* storage unavailable or full */
  }
  return data
}
