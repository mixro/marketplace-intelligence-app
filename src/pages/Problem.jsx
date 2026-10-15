import React from 'react';
import { useApp } from '../lib/store.jsx';
import { pick } from '../lib/format.js';
import { A, Breadcrumb, Empty, Notice, Section, StatusBadge, Tag } from '../components/ui.jsx';
import { ProductCard } from '../components/Cards.jsx';

export default function Problem({ id }) {
  const { data, lang, t, openModal } = useApp();
  const pr = data.problems.find((p) => p.id === id);
  if (!pr) return <div className="container page"><Empty title={t('common.notFound')} /></div>;
  const cat = data.categories[pr.category];
  const prods = pr.related.map((x) => data.productsById[x]).filter(Boolean);

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: t('nav.home'), to: '/' }, { label: pick(cat.short, lang), to: `/category/${cat.id}` }, { label: pick(pr.title, lang) }]} />
      <header className="detail-head single">
        <div>
          <div className="row gap wrap"><Tag tone="warn">{t('type.problem')}</Tag><StatusBadge status="submitted" /></div>
          <h1>{pick(pr.title, lang)}</h1>
          <p className="lead small-lead">{pick(pr.description, lang)}</p>
          <p className="muted"><b>{t('problem.group')}:</b> {pick(pr.group, lang)}</p>
        </div>
      </header>
      <Notice tone="warn" icon="alert" title={t('problem.researchStatus')}>{pick(pr.research, lang)}</Notice>
      <Notice tone="info" icon="info">{t('problem.hypothesis')}</Notice>
      <Section title={t('problem.related')} hint={t('problem.relatedHint')}>
        <div className="grid grid-3">{prods.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </Section>
      <button type="button" className="btn btn-ghost" onClick={() => openModal({ kind: 'correction', type: 'missing', target: pick(pr.title, lang) })}>{t('search.suggestMissing')}</button>
      <p className="mt"><A to={`/category/${cat.id}`}>{t('cat.open')}</A></p>
    </div>
  );
}
