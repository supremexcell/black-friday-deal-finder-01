// Deal Ledger — Black Friday 2026. Hash router (#/ and #/deal/<id>), filter state,
// "My list" (in-memory only), header stats. Vanilla JS, no network.
import { DEALS } from './deals.js';
import { applyFilters } from './filters.js';
import { listView, detailView } from './views.js';
import { usd0, pctOff, save } from './format.js';

const app = document.getElementById('app');
const statsEl = document.getElementById('header-stats');
const listEl = document.getElementById('mylist-summary');

const state = { query: '', category: 'All', store: 'All', minDiscount: 0, sort: 'discount' };
const myList = new Set();

const stats = {
  total: DEALS.length,
  totalSavings: DEALS.reduce((s, d) => s + save(d), 0),
  avgPct: Math.round(DEALS.reduce((s, d) => s + pctOff(d), 0) / DEALS.length),
};

function renderHeader() {
  statsEl.innerHTML = `<strong>${stats.total} deals</strong> · <strong>${usd0(stats.totalSavings)} total savings</strong> · <strong>${stats.avgPct}% avg off</strong> · all prices checked 27 Nov 2026`;
  const n = myList.size;
  const saved = [...myList].reduce((s, id) => {
    const d = DEALS.find((x) => x.id === id);
    return d ? s + save(d) : s;
  }, 0);
  listEl.textContent = n === 0
    ? 'Your list: nothing saved yet — tick “My list” on any deal.'
    : `Your list: ${n} deal${n === 1 ? '' : 's'} · You save ${usd0(saved)}`;
}

// Wire each control once (marked with data-wired); full renders replace the DOM,
// so fresh controls start unwired and get wired here.
function wireListEvents() {
  document.querySelectorAll('[data-category]:not([data-wired])').forEach((b) => {
    b.dataset.wired = '1';
    b.addEventListener('click', () => { state.category = b.dataset.category; render(); });
  });
  document.querySelectorAll('[data-mindiscount]:not([data-wired])').forEach((b) => {
    b.dataset.wired = '1';
    b.addEventListener('click', () => { state.minDiscount = Number(b.dataset.mindiscount); render(); });
  });
  const storeSel = document.getElementById('store-filter');
  if (storeSel && !storeSel.dataset.wired) {
    storeSel.dataset.wired = '1';
    storeSel.addEventListener('change', () => { state.store = storeSel.value; render(); });
  }
  const sortSel = document.getElementById('sort');
  if (sortSel && !sortSel.dataset.wired) {
    sortSel.dataset.wired = '1';
    sortSel.addEventListener('change', () => { state.sort = sortSel.value; render(); });
  }
  const clear = document.querySelector('[data-clear-filters]:not([data-wired])');
  if (clear) {
    clear.dataset.wired = '1';
    clear.addEventListener('click', () => {
      state.query = ''; state.category = 'All'; state.store = 'All'; state.minDiscount = 0; state.sort = 'discount';
      render();
    });
  }
}

// Re-render only the grid + count while typing, keeping focus in the search box.
function refreshListOnly() {
  const filtered = applyFilters(DEALS, state);
  const grid = document.querySelector('.grid');
  const count = document.querySelector('.match-count');
  if (!grid || !count) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = listView(DEALS, filtered, state, myList, stats);
  grid.replaceWith(tmp.querySelector('.grid'));
  count.replaceWith(tmp.querySelector('.match-count'));
  const oldEmpty = document.querySelector('.empty');
  if (oldEmpty) oldEmpty.remove();
  if (filtered.length === 0) {
    document.querySelector('.grid').insertAdjacentHTML('afterend',
      '<p class="empty">No deals match those filters. <button class="linklike" data-clear-filters>Clear all filters</button></p>');
    wireListEvents();
  }
}

function render() {
  renderHeader();
  const hash = location.hash || '#/';
  const m = hash.match(/^#\/deal\/([\w-]+)$/);
  if (m) {
    const deal = DEALS.find((d) => d.id === m[1]);
    app.innerHTML = deal
      ? detailView(deal, DEALS, myList.has(deal.id))
      : '<p class="empty">Deal not found. <a href="#/">Back to all deals</a></p>';
  } else {
    const filtered = applyFilters(DEALS, state);
    app.innerHTML = listView(DEALS, filtered, state, myList, stats);
    const search = document.getElementById('search');
    if (search) {
      search.addEventListener('input', () => { state.query = search.value; refreshListOnly(); });
    }
  }
  wireListEvents();
  window.__shotReady = true;
}

document.addEventListener('change', (e) => {
  const t = e.target;
  if (t && t.matches('[data-list-toggle]')) {
    const id = t.dataset.listToggle;
    if (t.checked) myList.add(id); else myList.delete(id);
    renderHeader();
  }
});

window.addEventListener('hashchange', render);
render();
