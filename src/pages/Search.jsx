import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { replaceQuery } from '../lib/router.js';
import { buildIndex, runSearch } from '../lib/search.js';
import { pick } from '../lib/format.js';
import { ROLE_KEYS } from '../data/orgs.js';
import { Empty, Icon, Section } from '../components/ui.jsx';
import { CategoryCard, OrgCard, ProblemCard, ProductCard } from '../components/Cards.jsx';

const TYPES = ['all', 'product', 'org', 'problem', 'category'];

export default function Search({ route }) {
  const { data, lang, t, openModal } = useApp();
  const qs = route.query;
  const [q, setQ] = useState(qs.q || '');
  const [type, setType] = useState(qs.type || 'all');
  const [cat, setCat] = useState(qs.cat || 'all');
  const [brand, setBrand] = useState(qs.brand || 'all');
  const [role, setRole] = useState(qs.role || 'all');
  const [tz, setTz] = useState(qs.tz === '1');

  // a new navigation (e.g. from the home page) resets the form
  useEffect(() => {
    setQ(qs.q || ''); setType(qs.type || 'all'); setCat(qs.cat || 'all');
    setBrand(qs.brand || 'all'); setRole(qs.role || 'all'); setTz(qs.tz === '1');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.raw]);

  useEffect(() => {
    replaceQuery('/search', { q, type, cat, brand, role, tz });
  }, [q, type, cat, brand, role, tz]);

  const index = useMemo(() => buildIndex(data, lang), [data, lang]);
  const results = useMemo(
    () => runSearch(index, q, { type, cat, brand, role, tz }, data),
    [index, q, type, cat, brand, role, tz, data],
  );

  const groups = {
    product: results.filter((r) => r.type === 'product'),
    org: results.filter((r) => r.type === 'org'),
    problem: results.filter((r) => r.type === 'problem'),
    category: results.filter((r) => r.type === 'category'),
  };
  const manufacturers = data.orgs.filter((o) => o.kind === 'manufacturer');
  const hasFilter = type !== 'all' || cat !== 'all' || brand !== 'all' || role !== 'all' || tz;
  const reset = () => { setType('all'); setCat('all'); setBrand('all'); setRole('all'); setTz(false); };

  return (
    <div className="container page">
      <h1 className="page-title">{t('search.title')}</h1>
      <form className="searchbar" onSubmit={(e) => e.preventDefault()} role="search">
        <Icon name="search" size={20} />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('home.placeholder')} aria-label={t('home.placeholder')} autoComplete="off" />
      </form>

      <div className="filters" role="group" aria-label={t('search.filters')}>
        <div className="seg" role="tablist" aria-label={t('search.type')}>
          {TYPES.map((k) => (
            <button key={k} type="button" role="tab" aria-selected={type === k} className={type === k ? 'on' : ''} onClick={() => setType(k)}>{t(`filter.type.${k}`)}</button>
          ))}
        </div>
        <label className="select">
          <span>{t('filter.category')}</span>
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="all">{t('filter.all')}</option>
            {Object.values(data.categories).map((c) => <option key={c.id} value={c.id}>{pick(c.short, lang)}</option>)}
          </select>
        </label>
        <label className="select">
          <span>{t('filter.brand')}</span>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="all">{t('filter.all')}</option>
            {manufacturers.map((m) => <option key={m.id} value={m.id}>{m.name.split(' (')[0]}</option>)}
          </select>
        </label>
        <label className="select">
          <span>{t('filter.role')}</span>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">{t('filter.all')}</option>
            {ROLE_KEYS.map((r) => <option key={r} value={r}>{t(`role.${r}`)}</option>)}
          </select>
        </label>
        <label className="check">
          <input type="checkbox" checked={tz} onChange={(e) => setTz(e.target.checked)} />
          <span>{t('filter.tz')}</span>
        </label>
        {hasFilter && <button type="button" className="btn btn-ghost btn-sm" onClick={reset}>{t('filter.reset')}</button>}
      </div>

      <p className="muted result-count" aria-live="polite">{t('search.count', { n: results.length })}</p>

      {results.length === 0 && (
        <Empty
          title={t('search.emptyTitle')}
          action={<button type="button" className="btn btn-ghost" onClick={() => openModal({ kind: 'correction', type: 'missing', target: q ? `${t('search.missingFor')}: ${q}` : '' })}>{t('search.suggestMissing')}</button>}
        >
          {t('search.emptyBody')}
        </Empty>
      )}

      {groups.product.length > 0 && (
        <Section title={`${t('group.product')} (${groups.product.length})`}>
          <div className="grid grid-3">{groups.product.map((r) => <ProductCard key={r.id} p={data.productsById[r.id]} />)}</div>
        </Section>
      )}
      {groups.org.length > 0 && (
        <Section title={`${t('group.org')} (${groups.org.length})`}>
          <div className="grid grid-3">{groups.org.map((r) => <OrgCard key={r.id} o={data.orgsById[r.id]} />)}</div>
        </Section>
      )}
      {groups.problem.length > 0 && (
        <Section title={`${t('group.problem')} (${groups.problem.length})`} hint={t('problem.hypothesis')}>
          <div className="grid grid-2">{groups.problem.map((r) => <ProblemCard key={r.id} pr={data.problems.find((x) => x.id === r.id)} />)}</div>
        </Section>
      )}
      {groups.category.length > 0 && (
        <Section title={`${t('group.category')} (${groups.category.length})`}>
          <div className="grid grid-3">{groups.category.map((r) => <CategoryCard key={r.id} c={data.categories[r.id]} />)}</div>
        </Section>
      )}
    </div>
  );
}
