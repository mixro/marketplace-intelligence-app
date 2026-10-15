import { useEffect, useState } from 'react';

function parse() {
  const raw = (typeof window !== 'undefined' && window.location.hash ? window.location.hash : '#/').slice(1);
  const [p, qs = ''] = raw.split('?');
  const segs = p.split('/').filter(Boolean).map(decodeURIComponent);
  const query = Object.fromEntries(new URLSearchParams(qs));
  return { segs, query, raw };
}

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onChange = () => {
      setRoute(parse());
      try { window.scrollTo(0, 0); } catch { /* not critical */ }
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export const go = (path) => { window.location.hash = path; };
export const href = (path) => '#' + path;

export function buildQuery(obj) {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v !== '' && v != null && v !== false && v !== 'all') p.set(k, v === true ? '1' : v);
  });
  const s = p.toString();
  return s ? '?' + s : '';
}

// Update the URL without triggering a route change (used by live search filters).
export function replaceQuery(path, obj) {
  try {
    window.history.replaceState(null, '', '#' + path + buildQuery(obj));
  } catch { /* ignore */ }
}
