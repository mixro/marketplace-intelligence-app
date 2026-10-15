import React from 'react';
import { useApp } from '../lib/store.jsx';
import { pick } from '../lib/format.js';
import { A, Breadcrumb, Empty, Icon, Notice, Section, StatusBadge } from '../components/ui.jsx';
import { ProductCard } from '../components/Cards.jsx';

export default function Category({ id }) {
  const { data, lang, t } = useApp();
  const cat = data.categories[id];
  if (!cat) return <div className="container page"><Empty title={t('common.notFound')} /></div>;

  const prods = data.products.filter((p) => p.category === id);
  const brandIds = [...new Set(prods.map((p) => p.brand))];
  const brands = brandIds.map((b) => data.orgsById[b]);
  const locals = data.orgs.filter((o) => o.kind === 'local' && o.brands.some((b) => brandIds.includes(b.brand)));
  const problems = data.problems.filter((p) => p.category === id);

  const claims = prods.flatMap((p) => Object.values(p.claims));
  const review = claims.filter((c) => c.status === 'needs_review').length;
  const comp = prods.reduce((acc, p) => { const c = data.completeness(p); return { f: acc.f + c.filled, t: acc.t + c.total }; }, { f: 0, t: 0 });
  const pct = comp.t ? Math.round((comp.f / comp.t) * 100) : 0;
  const withTz = prods.filter((p) => data.localSuppliersFor(p).length).length;
  const withoutTz = prods.filter((p) => !data.localSuppliersFor(p).length);
  const offers = data.offers.filter((o) => prods.some((p) => p.id === o.product));

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: t('nav.home'), to: '/' }, { label: pick(cat.short, lang) }]} />
      <header className="detail-head single">
        <div>
          <span className="tile-icon"><Icon name={cat.icon} size={22} /></span>
          <h1>{pick(cat.name, lang)}</h1>
          <p className="lead small-lead">{pick(cat.description, lang)}</p>
        </div>
      </header>

      <Section title={t('cat.coverage')} hint={t('cat.coverageHint')}>
        <div className="grid grid-4">
          <div className="card stat"><span className="muted small">{t('cat.products')}</span><b>{prods.length}</b></div>
          <div className="card stat"><span className="muted small">{t('cat.completeness')}</span><b>{pct}%</b><span className="muted small">{comp.f}/{comp.t} {t('cat.fields')}</span></div>
          <div className="card stat"><span className="muted small">{t('cat.needReview')}</span><b>{review}</b><span className="muted small">{t('cat.claims')}</span></div>
          <div className="card stat"><span className="muted small">{t('cat.tzEvidence')}</span><b>{withTz}/{prods.length}</b><span className="muted small">{t('cat.brandLevel')}</span></div>
        </div>
        <div className="grid grid-2 mt">
          <article className="card">
            <h3 className="card-title">{t('cat.weHave')}</h3>
            <ul className="plain checklist">
              <li><Icon name="check" size={16} /> {t('cat.have.products', { n: prods.length, b: brands.length })}</li>
              <li><Icon name="check" size={16} /> {t('cat.have.locals', { n: locals.length })}</li>
              <li><Icon name="check" size={16} /> {t('cat.have.offers', { n: offers.length })}</li>
            </ul>
          </article>
          <article className="card">
            <h3 className="card-title">{t('cat.weLack')}</h3>
            <ul className="plain checklist miss">
              <li><Icon name="alert" size={16} /> {t('cat.lack.tzPrices')}</li>
              <li><Icon name="alert" size={16} /> {t('cat.lack.tzStock')}</li>
              {withoutTz.length > 0 && <li><Icon name="alert" size={16} /> {t('cat.lack.noTz', { names: withoutTz.map((p) => p.name).join(', ') })}</li>}
              <li><Icon name="alert" size={16} /> {t('cat.lack.coverage')}</li>
            </ul>
          </article>
        </div>
        <Notice tone="info" icon="info">{t('cat.gapNote')}</Notice>
      </Section>

      <Section title={t('cat.products')} action={<A to={`/search?type=product&cat=${id}`} className="btn btn-ghost btn-sm">{t('cat.searchAll')}</A>}>
        <div className="grid grid-3">{prods.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      </Section>

      <Section title={t('cat.matrixTitle')} hint={t('cat.matrixHint')}>
        <div className="table-wrap">
          <table className="matrix">
            <thead>
              <tr>
                <th scope="col">{t('cat.localSupplier')}</th>
                {brands.map((b) => <th scope="col" key={b.id}><A to={`/org/${b.id}`}>{b.name.split(' (')[0].replace(' B.V.', '').replace(' GmbH & Co. KG', '')}</A></th>)}
              </tr>
            </thead>
            <tbody>
              {locals.map((o) => (
                <tr key={o.id}>
                  <th scope="row"><A to={`/org/${o.id}`}>{o.name}</A><div className="muted small">{o.city} · {o.roles.map((r) => t(`role.${r.role}`)).join(', ')}</div></th>
                  {brands.map((b) => {
                    const rel = o.brands.find((x) => x.brand === b.id);
                    return <td key={b.id}>{rel ? <StatusBadge status={rel.status} compact /> : <span className="muted" aria-label={t('na.label')}>-</span>}</td>;
                  })}
                </tr>
              ))}
              {locals.length === 0 && <tr><td colSpan={brands.length + 1}><span className="muted">{t('org.noLocal')}</span></td></tr>}
            </tbody>
          </table>
        </div>
        <p className="muted small">{t('cat.matrixCaveat')}</p>
      </Section>

      <Section title={t('cat.adjacent')} hint={t('cat.adjacentHint')}>
        <div className="row gap wrap">{cat.adjacent.map((a, i) => <span key={i} className="na">{pick(a, lang)}</span>)}</div>
      </Section>

      {problems.length > 0 && (
        <Section title={t('cat.problems')} hint={t('problem.hypothesis')}>
          <ul className="plain">
            {problems.map((pr) => <li key={pr.id}><A to={`/problem/${pr.id}`}>{pick(pr.title, lang)}</A></li>)}
          </ul>
        </Section>
      )}
    </div>
  );
}
