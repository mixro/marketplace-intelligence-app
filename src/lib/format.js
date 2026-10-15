export function fmtNumber(n) {
  if (typeof n !== 'number') return String(n);
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function fmtDate(iso, lang) {
  if (!iso) return '';
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString(lang === 'sw' ? 'sw-TZ' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function fmtValue(def, v) {
  if (v === undefined || v === null || v === '') return null;
  if (def && def.kind === 'num' && typeof v === 'number') {
    return def.unit ? `${fmtNumber(v)} ${def.unit}` : fmtNumber(v);
  }
  return String(v);
}

export function fmtMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${amount} ${currency}`;
  }
}

export const STATUS_ORDER = ['needs_review', 'submitted', 'source_checked', 'confirmed'];
export const STATUS_KEYS = ['submitted', 'source_checked', 'confirmed', 'needs_review'];

// weakest status among claims (needs_review < submitted < source_checked < confirmed)
export function weakestStatus(statuses) {
  if (!statuses.length) return 'submitted';
  return statuses.slice().sort((a, b) => STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b))[0];
}

export const pick = (obj, lang) => (obj && typeof obj === 'object' ? obj[lang] || obj.en : obj);
