import React, { useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { go, buildQuery } from '../lib/router.js';
import { pick } from '../lib/format.js';
import { A, Icon, StatusBadge, Notice } from '../components/ui.jsx';
import { STATUS_KEYS } from '../lib/format.js';

const EXAMPLES = ['pump for borehole', 'inverter for home backup', 'MPPT 60A controller', 'pampu ya maji ya jua', 'automatic water flow control'];

export default function Home() {
  const { t, lang, data } = useApp();
  const [q, setQ] = useState('');
  const submit = (e) => { e.preventDefault(); go('/search' + buildQuery({ q })); };

  const claims = data.products.flatMap((p) => Object.values(p.claims));
  const review = claims.filter((c) => c.status === 'needs_review').length;
  const tzProducts = data.products.filter((p) => data.localSuppliersFor(p).length).length;
  const localOrgs = data.orgs.filter((o) => o.kind === 'local').length;

  const tasks = [
    { n: 1, icon: 'search', to: '/search', k: 'search' },
    { n: 2, icon: 'building', to: '/search?type=org', k: 'suppliers' },
    { n: 3, icon: 'compare', to: '/compare', k: 'compare' },
    { n: 4, icon: 'layers', to: '/category/pumps', k: 'landscape' },
    { n: 5, icon: 'shield', to: '/about', k: 'evidence' },
  ];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">{t('home.eyebrow')}</p>
            <h1>{t('home.title')}</h1>
            <p className="lead">{t('home.lead')}</p>
            <form className="searchbar" onSubmit={submit} role="search">
              <Icon name="search" size={20} />
              <input
                type="search" value={q} onChange={(e) => setQ(e.target.value)}
                placeholder={t('home.placeholder')} aria-label={t('home.placeholder')} autoComplete="off"
              />
              <button type="submit" className="btn btn-primary">{t('common.search')}</button>
            </form>
            <div className="examples">
              <span className="muted small">{t('home.try')}</span>
              {EXAMPLES.map((ex) => (
                <button key={ex} type="button" className="chip chip-btn" onClick={() => go('/search' + buildQuery({ q: ex }))}>{ex}</button>
              ))}
            </div>
          </div>
          <aside className="snapshot card" aria-label={t('home.snapshot')}>
            <p className="eyebrow">{t('home.snapshot')}</p>
            <dl className="stat-grid">
              <div><dt>{t('home.stat.products')}</dt><dd>{data.products.length}</dd></div>
              <div><dt>{t('home.stat.orgs')}</dt><dd>{data.orgs.length}</dd></div>
              <div><dt>{t('home.stat.localOrgs')}</dt><dd>{localOrgs}</dd></div>
              <div><dt>{t('home.stat.sources')}</dt><dd>{data.sources.length}</dd></div>
              <div><dt>{t('home.stat.tz')}</dt><dd>{tzProducts}/{data.products.length}</dd></div>
              <div><dt>{t('home.stat.review')}</dt><dd>{review}</dd></div>
            </dl>
            <p className="muted small">{t('home.snapshotNote')}</p>
          </aside>
        </div>
      </section>

      <div className="container">
        <Notice tone="warn" icon="alert" title={t('home.protoTitle')}>{t('home.protoBody')}</Notice>

        <section className="section">
          <div className="section-head"><div><h2>{t('home.browse')}</h2><p className="muted">{t('home.browseHint')}</p></div></div>
          <div className="grid grid-3">
            {Object.values(data.categories).map((c) => {
              const n = data.products.filter((p) => p.category === c.id).length;
              return (
                <A key={c.id} to={`/category/${c.id}`} className="tile">
                  <span className="tile-icon"><Icon name={c.icon} size={22} /></span>
                  <strong>{pick(c.name, lang)}</strong>
                  <span className="muted small">{pick(c.description, lang)}</span>
                  <span className="tile-foot">{t('home.productsCount', { n })} <Icon name="arrow" size={16} /></span>
                </A>
              );
            })}
          </div>
        </section>

        <section className="section">
          <div className="section-head"><div><h2>{t('home.tasksTitle')}</h2><p className="muted">{t('home.tasksHint')}</p></div></div>
          <div className="grid grid-5">
            {tasks.map((k) => (
              <A key={k.n} to={k.to} className="task">
                <span className="task-n">{k.n}</span>
                <Icon name={k.icon} size={20} />
                <strong>{t(`task.${k.k}.title`)}</strong>
                <span className="muted small">{t(`task.${k.k}.desc`)}</span>
              </A>
            ))}
          </div>
        </section>

        <section className="section" id="verify">
          <div className="section-head"><div><h2>{t('home.verifyTitle')}</h2><p className="muted">{t('home.verifyHint')}</p></div></div>
          <div className="grid grid-4">
            {STATUS_KEYS.map((s) => (
              <div key={s} className="card legend">
                <StatusBadge status={s} />
                <p className="small">{t(`statusHelp.${s}`)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
