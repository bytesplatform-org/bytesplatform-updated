import { DEMO_TODAY } from "./data";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Deterministic on server and client: no locale or timezone lookups. */
export function dateFromToday(days: number) {
  return new Date(DEMO_TODAY.getTime() + days * 86_400_000);
}

export function fmtDate(d: Date, withDay = false) {
  const s = `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
  return withDay ? `${DAYS[d.getUTCDay()]}, ${s}` : s;
}

export function fmtShort(d: Date) {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function dueLabel(days: number) {
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days`;
}

function trim(n: number, digits: number) {
  return String(Number(n.toFixed(digits)));
}

export function money(n: number) {
  if (n >= 1_000_000_000) return `$${trim(n / 1_000_000_000, 1)}B`;
  if (n >= 1_000_000) return `$${trim(n / 1_000_000, n >= 10_000_000 ? 1 : 2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function moneyFull(n: number) {
  return "$" + Math.round(n).toLocaleString("en-US");
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bytesplatform.com";
