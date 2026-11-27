// Search / filter / sort over the baked-in deal list. Pure functions, no network.
import { pctOff, save } from './format.js';
import { dealScore } from './score.js';

export const SORTS = [
  { id: 'discount', label: 'Biggest discount' },
  { id: 'savings', label: 'Biggest saving ($)' },
  { id: 'price', label: 'Lowest price' },
  { id: 'score', label: 'Deal score' },
];

export const MIN_DISCOUNTS = [0, 25, 40, 50];

export function allCategories(deals) {
  return [...new Set(deals.map((d) => d.category))].sort();
}

export function allStores(deals) {
  return [...new Set(deals.map((d) => d.store))].sort();
}

export function applyFilters(deals, state) {
  const q = (state.query || '').trim().toLowerCase();
  let out = deals.filter((d) => {
    if (state.category !== 'All' && d.category !== state.category) return false;
    if (state.store !== 'All' && d.store !== state.store) return false;
    if (pctOff(d) < state.minDiscount) return false;
    if (q) {
      const hay = `${d.product} ${d.store} ${d.category} ${d.blurb}`.toLowerCase();
      if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const by = state.sort;
  out = [...out].sort((a, b) => {
    if (by === 'discount') return pctOff(b) - pctOff(a) || save(b) - save(a);
    if (by === 'savings') return save(b) - save(a);
    if (by === 'price') return a.price - b.price;
    if (by === 'score') return dealScore(b) - dealScore(a) || pctOff(b) - pctOff(a);
    return 0;
  });
  return out;
}
