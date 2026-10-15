// Client-side search: tolerant of typos, understands English and Swahili keywords,
// and matches problem-style queries through the keyword fields on every record.
import { pick } from './format.js';

const STOP = new Set(['for', 'a', 'an', 'the', 'of', 'to', 'with', 'from', 'my', 'in', 'on', 'and', 'or', 'is', 'na', 'ya', 'wa', 'kwa', 'la', 'za', 'cha']);

export const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s./-]/g, ' ');

const splitWords = (s) => norm(s).split(/[\s./-]+/).filter(Boolean);

export function tokenize(q) {
  return norm(q).split(/\s+/).filter((t) => t && !STOP.has(t));
}

function editDistanceAtMost1(a, b) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    edits++;
    if (edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

function scoreToken(tok, rec) {
  let s = 0;
  if (rec.titleWords.includes(tok)) s = 8;
  else if (rec.titleWords.some((w) => w.startsWith(tok) && tok.length >= 2)) s = 6;
  else if (rec.words.has(tok)) s = 4;
  else if (tok.length >= 3 && [...rec.words].some((w) => w.startsWith(tok))) s = 3;
  else if (tok.length >= 3 && rec.flat.includes(tok)) s = 2;
  else if (tok.length >= 4 && [...rec.words].some((w) => editDistanceAtMost1(tok, w))) s = 1.5;
  return s;
}

export function buildIndex(data, lang) {
  const recs = [];
  data.products.forEach((p) => {
    const brand = data.orgsById[p.brand];
    const cat = data.categories[p.category];
    const text = [p.name, brand && brand.name, p.type, p.summary, (p.applications || []).join(' '), p.keywords, pick(cat.name, 'en'), pick(cat.name, 'sw')].join(' ');
    recs.push({ type: 'product', id: p.id, category: p.category, brand: p.brand, titleText: `${brand ? brand.name : ''} ${p.name}`, text });
  });
  data.orgs.forEach((o) => {
    const cats = [...new Set(data.productsForOrg(o).map((p) => p.category))];
    const text = [o.name, o.legalName, o.city, o.country, o.keywords, pick(o.description, 'en'), o.roles.map((r) => r.role).join(' '), o.brands.map((b) => data.orgsById[b.brand].name).join(' ')].join(' ');
    recs.push({ type: 'org', id: o.id, categories: cats, brands: o.kind === 'manufacturer' ? [o.id] : o.brands.map((b) => b.brand), roles: o.roles.map((r) => r.role), kind: o.kind, titleText: o.name, text });
  });
  data.problems.forEach((pr) => {
    const text = [pr.title.en, pr.title.sw, pr.description.en, pr.description.sw, pr.keywords, pr.group.en].join(' ');
    recs.push({ type: 'problem', id: pr.id, category: pr.category, titleText: pr.title[lang] || pr.title.en, text });
  });
  Object.values(data.categories).forEach((c) => {
    const text = [c.name.en, c.name.sw, c.description.en, c.description.sw, c.keywords].join(' ');
    recs.push({ type: 'category', id: c.id, category: c.id, titleText: c.name[lang] || c.name.en, text });
  });
  return recs.map((r) => ({
    ...r,
    titleWords: splitWords(r.titleText),
    words: new Set(splitWords(r.text)),
    flat: norm(r.text),
  }));
}

export function runSearch(index, query, filters, data) {
  const toks = tokenize(query);
  const need = toks.length ? Math.max(1, Math.ceil(toks.length * 0.6)) : 0;
  const out = [];
  index.forEach((rec) => {
    if (filters.type !== 'all' && rec.type !== filters.type) return;
    if (filters.cat !== 'all') {
      if (rec.type === 'product' && rec.category !== filters.cat) return;
      if (rec.type === 'problem' && rec.category !== filters.cat) return;
      if (rec.type === 'category' && rec.id !== filters.cat) return;
      if (rec.type === 'org' && !rec.categories.includes(filters.cat)) return;
    }
    if (filters.brand !== 'all') {
      if (rec.type === 'product' && rec.brand !== filters.brand) return;
      if (rec.type === 'org' && !rec.brands.includes(filters.brand)) return;
      if (rec.type === 'problem' || rec.type === 'category') return;
    }
    if (filters.role !== 'all') {
      if (rec.type !== 'org' || !rec.roles.includes(filters.role)) return;
    }
    if (filters.tz) {
      if (rec.type === 'product') {
        const p = data.productsById[rec.id];
        if (!data.localSuppliersFor(p).length) return;
      } else if (rec.type === 'org') {
        if (rec.kind !== 'local') return;
      } else return;
    }
    let score = 0;
    if (toks.length) {
      let matched = 0;
      toks.forEach((t) => {
        const s = scoreToken(t, rec);
        if (s > 0) { matched++; score += s; }
      });
      if (matched < need) return;
      // small boost to concrete records over categories/problems on name-like queries
      if (rec.type === 'product') score += 0.5;
    } else {
      score = 1;
    }
    out.push({ ...rec, score });
  });
  out.sort((a, b) => b.score - a.score || a.titleText.localeCompare(b.titleText));
  return out;
}
