// Formatting helpers: money, percentages, escaping, dates.
export function usd(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function usd0(n) {
  return '$' + Math.round(Number(n)).toLocaleString('en-US');
}

export function pctOff(deal) {
  return Math.round((1 - deal.price / deal.was) * 100);
}

export function save(deal) {
  return deal.was - deal.price;
}

export function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// "2026-11-27T09:48:00Z" -> "27 Nov 2026, 09:48 UTC"
export function checkedLabel(iso) {
  const d = new Date(iso);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
}
