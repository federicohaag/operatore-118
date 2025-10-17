/**
 * Utility helpers for core modules.
 */

/**
 * Generates an RFC4122 v4 UUID string.
 *
 * Uses the platform crypto APIs when available:
 * - `crypto.randomUUID()` if present
 * - otherwise `crypto.getRandomValues()` to construct a v4 UUID
 * Falls back to a non-cryptographically secure ID using Math.random if
 * no crypto APIs are available (very rare in supported runtimes).
 */
export function generateUuid(): string {
  try {
    const w = globalThis as any;
    if (w?.crypto?.randomUUID && typeof w.crypto.randomUUID === 'function') {
      return w.crypto.randomUUID();
    }

    if (w?.crypto?.getRandomValues && typeof w.crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      w.crypto.getRandomValues(bytes);
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      bytes[6] = (bytes[6] & 0x0f) | 0x40;

      const toHex = (b: number) => b.toString(16).padStart(2, '0');
      const parts = [
        Array.from(bytes.slice(0, 4)).map(toHex).join(''),
        Array.from(bytes.slice(4, 6)).map(toHex).join(''),
        Array.from(bytes.slice(6, 8)).map(toHex).join(''),
        Array.from(bytes.slice(8, 10)).map(toHex).join(''),
        Array.from(bytes.slice(10, 16)).map(toHex).join('')
      ];
      return `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}-${parts[4]}`;
    }
  } catch (e) {
    // ignore and fallback
  }

  return 'id-' + Math.random().toString(36).substring(2, 15);
}
