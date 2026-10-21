/** All persisted monetary values are integer kobo. Never use floating point for ledger arithmetic. */
export const MOVIE_PRICE_KOBO = 10_000n;
export const EPISODE_BUNDLE_PRICE_KOBO = 30_000n;
export const CREATOR_SHARE_BPS = 9_000n;
export const PLATFORM_SHARE_BPS = 1_000n;
export const FREE_PREVIEW_SECONDS = 600;
export function formatNairaFromKobo(kobo: bigint | number | string) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 2 }).format(Number(kobo) / 100);
}
export function splitRevenue(grossKobo: bigint) {
  const creatorShareKobo = grossKobo * CREATOR_SHARE_BPS / 10_000n;
  return { creatorShareKobo, platformShareKobo: grossKobo - creatorShareKobo };
}
