// List + detail templates. No external images: product tiles are a category colour
// with the product's first letter, drawn with inline CSS.
import { usd, usd0, pctOff, save, esc, checkedLabel } from './format.js';
import { dealScore, verdict, scoreBreakdown } from './score.js';
import { SORTS, MIN_DISCOUNTS, allCategories, allStores } from './filters.js';

export const CATEGORY_COLORS = {
  'TVs': '#7c3aed', 'Laptops': '#2563eb', 'Headphones': '#db2777', 'Smartwatches': '#059669',
  'Gaming': '#dc2626', 'Tablets': '#0891b2', 'Smart Home': '#65a30d', 'Cameras & Drones': '#ea580c',
  'Kitchen': '#b45309', 'Tools': '#475569', 'Home': '#0d9488', 'Toys': '#e11d48',
  'Beauty': '#c026d3', 'Fashion': '#4f46e5', 'Fitness': '#16a34a',
};

export function categoryColor(cat) {
  return CATEGORY_COLORS[cat] || '#334155';
}

export function monogram(product) {
  const clean = product.replace(/^[^A-Za-z0-9]+/, '');
  return esc(clean.charAt(0).toUpperCase());
}

function signalClass(signal) {
  return signal === 'NEW LOW' ? 'badge-newlow' : signal === 'STRONG DEAL' ? 'badge-strong' : 'badge-routine';
}

function tile(deal, size) {
  return `<span class="tile ${size || ''}" style="background:${categoryColor(deal.category)}" aria-hidden="true">${monogram(deal.product)}</span>`;
}

function listToggle(deal, inList) {
  return `<label class="mylist-toggle"><input type="checkbox" data-list-toggle="${esc(deal.id)}" ${inList ? 'checked' : ''}> <span>My list</span></label>`;
}

export function dealCard(deal, inList) {
  const pct = pctOff(deal);
  return `<article class="card">
    <a class="card-main" href="#/deal/${esc(deal.id)}">
      <span class="card-top">${tile(deal)}<span class="card-cat">${esc(deal.category)} · ${esc(deal.store)}</span></span>
      <h3 class="card-title">${esc(deal.product)}</h3>
      <p class="card-blurb">${esc(deal.blurb)}</p>
      <span class="card-prices"><span class="price">${usd(deal.price)}</span> <s class="was">${usd(deal.was)}</s> <span class="pct">−${pct}%</span></span>
      <span class="card-save">You save ${usd(save(deal))}</span>
      <span class="card-badges"><span class="badge ${signalClass(deal.signal)}">${esc(deal.signal)}</span><span class="score-chip">Score ${dealScore(deal)}/100</span></span>
      <span class="card-checked">Checked ${checkedLabel(deal.checked)} · ${esc(deal.source)}</span>
    </a>
    <span class="card-actions">${listToggle(deal, inList)}<a class="store-link" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a></span>
  </article>`;
}

export function listView(deals, filtered, state, listSet, stats) {
  const cats = allCategories(deals);
  const stores = allStores(deals);
  const chips = ['All', ...cats].map((c) =>
    `<button class="chip ${state.category === c ? 'active' : ''}" data-category="${esc(c)}">${esc(c)}</button>`).join('');
  const storeOpts = ['All', ...stores].map((s) =>
    `<option value="${esc(s)}" ${state.store === s ? 'selected' : ''}>${esc(s)}</option>`).join('');
  const minOpts = MIN_DISCOUNTS.map((m) =>
    `<button class="chip small ${state.minDiscount === m ? 'active' : ''}" data-mindiscount="${m}">${m === 0 ? 'Any discount' : m + '%+ off'}</button>`).join('');
  const sortOpts = SORTS.map((s) =>
    `<option value="${s.id}" ${state.sort === s.id ? 'selected' : ''}>${s.label}</option>`).join('');
  const cards = filtered.map((d) => dealCard(d, listSet.has(d.id))).join('');
  const empty = filtered.length === 0
    ? `<p class="empty">No deals match those filters. <button class="linklike" data-clear-filters>Clear all filters</button></p>` : '';
  return `
  <section class="controls" aria-label="Search and filters">
    <input id="search" type="search" placeholder="Search deals — try “airpods”, “lego”, “dyson”…" value="${esc(state.query)}" aria-label="Search deals">
    <div class="chip-row" role="group" aria-label="Category">${chips}</div>
    <div class="control-row">
      <label>Store <select id="store-filter">${storeOpts}</select></label>
      <span class="min-group" role="group" aria-label="Minimum discount">${minOpts}</span>
      <label>Sort <select id="sort">${sortOpts}</select></label>
    </div>
  </section>
  <p class="match-count" aria-live="polite"><strong>${filtered.length}</strong> of ${deals.length} deals match${state.query ? ` “${esc(state.query)}”` : ''}${state.category !== 'All' ? ` in ${esc(state.category)}` : ''}${state.minDiscount ? ` · ${state.minDiscount}%+ off` : ''}</p>
  <section class="grid">${cards}</section>
  ${empty}
  <footer class="page-foot">
    <p>Every price was checked live at the linked store on 27 Nov 2026. Prices can move — the store page is the final word.</p>
    <p class="foot-stats">${stats.total} deals · ${usd0(stats.totalSavings)} total savings · ${stats.avgPct}% average discount</p>
  </footer>`;
}

export function detailView(deal, allDeals, inList) {
  const v = verdict(deal);
  const score = dealScore(deal);
  const pct = pctOff(deal);
  const breakdown = scoreBreakdown(deal).map((b) =>
    `<li><span>${esc(b.label)}</span><span class="bar"><i style="width:${Math.round((b.points / b.max) * 100)}%"></i></span><b>${b.points}/${b.max}</b></li>`).join('');
  const also = (deal.alsoAt || []).map((a) =>
    `<li>Also at <strong>${esc(a.store)}</strong> for <strong>${usd(a.price)}</strong> — <a href="${esc(a.url)}" target="_blank" rel="noopener">check ${esc(a.store)} ↗</a></li>`).join('');
  const sameStore = allDeals.filter((d) => d.store === deal.store && d.id !== deal.id).slice(0, 4);
  const more = sameStore.map((d) =>
    `<li><a href="#/deal/${esc(d.id)}">${esc(d.product)}</a> — <strong>${usd(d.price)}</strong> <s>${usd(d.was)}</s> (−${pctOff(d)}%)</li>`).join('');
  return `
  <nav class="back"><a href="#/">← All deals</a></nav>
  <article class="detail">
    <header class="detail-head">
      ${tile(deal, 'big')}
      <div>
        <p class="detail-cat">${esc(deal.category)} · ${esc(deal.store)}</p>
        <h2>${esc(deal.product)}</h2>
        <p class="detail-blurb">${esc(deal.blurb)}</p>
      </div>
    </header>
    <div class="detail-grid">
      <section class="detail-price box">
        <p class="price big">${usd(deal.price)}</p>
        <p>Usual price <s>${usd(deal.was)}</s> · <strong>−${pct}%</strong></p>
        <p class="save-line">You save <strong>${usd(save(deal))}</strong></p>
        <p><span class="badge ${signalClass(deal.signal)}">${esc(deal.signal)}</span></p>
        <p class="checked-line">Checked ${checkedLabel(deal.checked)} · Source: <a href="${esc(deal.sourceUrl)}" target="_blank" rel="noopener">${esc(deal.source)} ↗</a></p>
        <p class="evidence">Why this signal: ${esc(deal.signalEvidence)}</p>
        <p class="detail-actions">
          <a class="btn primary" href="${esc(deal.url)}" target="_blank" rel="noopener">View at ${esc(deal.store)} ↗</a>
          ${listToggle(deal, inList)}
        </p>
      </section>
      <section class="detail-score box">
        <h3>Deal score: ${score}/100 — ${esc(v.tier)}</h3>
        <p>${esc(v.text)}</p>
        <ul class="breakdown">${breakdown}</ul>
        <p class="score-note">Score is computed from this deal's own numbers: discount depth, signal and dollars saved. No outside data.</p>
      </section>
    </div>
    ${also ? `<section class="box"><h3>Also available</h3><ul class="also-list">${also}</ul></section>` : ''}
    ${more ? `<section class="box"><h3>More from ${esc(deal.store)}</h3><ul class="more-list">${more}</ul></section>` : ''}
    <p class="detail-foot">Prices were checked live on 27 Nov 2026 and can change. Always confirm the price on the store page before buying.</p>
  </article>`;
}
