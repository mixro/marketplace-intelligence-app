import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildData } from './data.js';
import { translate } from './i18n.js';

const KEY = 'amip.proto.v1';

function load() {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || '{}') || {};
  } catch {
    return {};
  }
}
function save(state) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch { /* storage can be blocked; the app still works without persistence */ }
}

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const saved = useMemo(load, []);
  const [lang, setLang] = useState(saved.lang === 'sw' ? 'sw' : 'en');
  const [theme, setTheme] = useState(saved.theme || 'auto');
  const [overrides, setOverrides] = useState(saved.overrides || {});
  const [customProducts, setCustomProducts] = useState(saved.customProducts || []);
  const [corrections, setCorrections] = useState(saved.corrections || []);
  const [compare, setCompare] = useState([]);
  const [drawer, setDrawer] = useState(null);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    save({ lang, theme, overrides, customProducts, corrections });
  }, [lang, theme, overrides, customProducts, corrections]);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (theme === 'auto') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', theme);
  }, [lang, theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 4200);
    return () => clearTimeout(id);
  }, [toast]);

  const data = useMemo(() => buildData({ overrides, customProducts }), [overrides, customProducts]);
  const t = useCallback((key, vars) => translate(lang, key, vars), [lang]);
  const notify = useCallback((message) => setToast({ message, id: Date.now() }), []);

  const toggleCompare = useCallback((id) => {
    setCompare((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      const prod = data.productsById[id];
      if (!prod) return cur;
      const sameCat = cur.filter((x) => data.productsById[x] && data.productsById[x].category === prod.category);
      if (sameCat.length !== cur.length) {
        notify(translate(lang, 'compare.categoryReset'));
        return [id];
      }
      if (cur.length >= 3) {
        notify(translate(lang, 'compare.max'));
        return cur;
      }
      return [...cur, id];
    });
  }, [data, lang, notify]);

  const value = {
    lang, setLang, theme, setTheme, data, t,
    overrides, setOverride: (productId, attr, patch) =>
      setOverrides((o) => ({ ...o, [`${productId}.${attr}`]: { ...(o[`${productId}.${attr}`] || {}), ...patch, at: new Date().toISOString().slice(0, 10) } })),
    clearOverride: (productId, attr) => setOverrides((o) => { const n = { ...o }; delete n[`${productId}.${attr}`]; return n; }),
    customProducts, addProduct: (p) => setCustomProducts((l) => [...l, p]),
    removeProduct: (id) => setCustomProducts((l) => l.filter((p) => p.id !== id)),
    corrections, addCorrection: (c) => setCorrections((l) => [{ ...c, id: `c-${Date.now()}`, at: new Date().toISOString().slice(0, 10), resolved: false }, ...l]),
    toggleCorrection: (id) => setCorrections((l) => l.map((c) => (c.id === id ? { ...c, resolved: !c.resolved } : c))),
    resetLocal: () => { setOverrides({}); setCustomProducts([]); setCorrections([]); setCompare([]); },
    compare, setCompare, toggleCompare, clearCompare: () => setCompare([]),
    drawer, openEvidence: setDrawer, closeEvidence: () => setDrawer(null),
    modal, openModal: setModal, closeModal: () => setModal(null),
    toast, notify,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
