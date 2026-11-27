// Deal score (0-100) and verdict, computed from the deal itself — no network, no guessing.
//   discount share: up to 55 points (1 point per % off, capped at 55)
//   signal bonus:  NEW LOW +25, STRONG DEAL +12, ROUTINE +0
//   savings bonus: up to 20 points ($1 per $25 saved, capped at 20)
// Verdict tiers: 85+ "Buy it now", 70+ "Great deal", 50+ "Solid deal", below "Only if you need it".
import { pctOff, save } from './format.js';

export function dealScore(deal) {
  const pct = pctOff(deal);
  const discountPts = Math.min(pct, 55);
  const signalPts = deal.signal === 'NEW LOW' ? 25 : deal.signal === 'STRONG DEAL' ? 12 : 0;
  const savingsPts = Math.min(Math.floor(save(deal) / 25), 20);
  return Math.max(0, Math.min(100, discountPts + signalPts + savingsPts));
}

export function verdict(deal) {
  const s = dealScore(deal);
  if (s >= 85) return { tier: 'Buy it now', text: 'A rare combination: a steep cut, a record-low signal and big dollars saved. If this is on your list, this is the price to buy at.' };
  if (s >= 70) return { tier: 'Great deal', text: 'Well above a routine sale — either the discount is deep or the price is at its lowest ever. Worth buying now rather than waiting.' };
  if (s >= 50) return { tier: 'Solid deal', text: 'A genuine saving on a real product, but not a once-a-year price. Buy if you need it now; patient shoppers may see it again.' };
  return { tier: 'Only if you need it', text: 'A modest cut. Fine if you were buying anyway, but not a reason to rush.' };
}

export function scoreBreakdown(deal) {
  const pct = pctOff(deal);
  return [
    { label: `Discount ${pct}% off`, points: Math.min(pct, 55), max: 55 },
    { label: `Signal: ${deal.signal}`, points: deal.signal === 'NEW LOW' ? 25 : deal.signal === 'STRONG DEAL' ? 12 : 0, max: 25 },
    { label: `You save $${save(deal).toFixed(2)}`, points: Math.min(Math.floor(save(deal) / 25), 20), max: 20 },
  ];
}
