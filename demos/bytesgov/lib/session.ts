/* No real auth: the demo only remembers, for this tab, whether the
   visitor came through the sign-in screen. Storage can throw in private
   windows or with blocked site data, so every access is guarded. */

const KEY = "bytesgov-demo-session";

export function setSignedIn(email: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ email, at: Date.now() }));
  } catch {}
}

export function getSignedIn(): string | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    return (JSON.parse(raw) as { email?: string }).email ?? null;
  } catch {
    return null;
  }
}

export function signOut() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}
