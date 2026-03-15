import * as Crypto from "expo-crypto";

/**
 * Generates a cryptographically random 16-character recovery key
 * using base-36 characters (0-9, A-Z).
 *
 * Returns the raw 16-char string (without dashes) for storage,
 * and a formatted display string as XXXX-XXXX-XXXX-XXXX.
 */
export const generateRecoveryKey = async (): Promise<{
  raw: string;
  formatted: string;
}> => {
  const bytes = await Crypto.getRandomBytesAsync(12);
  const raw = Array.from(bytes)
    .map((b) => b.toString(36).toUpperCase())
    .join("")
    .slice(0, 16);

  const formatted = [
    raw.slice(0, 4),
    raw.slice(4, 8),
    raw.slice(8, 12),
    raw.slice(12, 16),
  ].join("-");

  return { raw, formatted };
};
