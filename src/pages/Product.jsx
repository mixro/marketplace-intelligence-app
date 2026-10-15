import React from 'react';
import { useApp } from '../lib/store.jsx';
import { fmtDate, fmtMoney, fmtValue, pick } from '../lib/format.js';
import { SOURCE_TYPES } from '../data/sources.js';
import { A, Breadcrumb, Empty, Icon, Notice, NotAvailable, Section, StatusBadge, Tag } from '../components/ui.jsx';
import { ClaimValue, CompareToggle, ProductCard, RoleBadges } from '../components/Cards.jsx';

export default function Product({ id }) {
  const { data, lang, t, openEvidence, openModal } = useApp();
  const p = data.productsById[id];
  if (!p) return <div className="container page"><Empty title={t('common.notFound')}><A to="/search" className="btn btn-ghost">{t('nav.search')}</A></Empty></div>;

  const brand = data.orgsById[p.brand];
  const cat = data.categories[p.category];
  const defs = data.attrDefs[p.category];
  const status = data.productStatus(p);
  const suppliers = data.localSuppliersFor(p);
  const offers = data.offers.filter((o) => o.product === p.id);
  const similar = data.products.filter((x) => x.category === p.category && x.id !== p.id);
  const problems = data.problems.filter((pr) => pr.related.includes(p.id));
  const missing = defs.filter((d) => !p.claims[d.key] || p.claims[d.key].v === undefined || p.claims[d.key].v === null || p.claims[d.key].v === '');
  const { filled, total } = data.completeness(p);

  const srcIds = [...new Set(Object.values(p.claims).flatMap((c) => c.src || []))];
  const srcs = srcIds.map((s) => data.sourcesById[s]).filter(Boolean)
    .sort((a, b) => (a.type === 'manufacturer_datasheet' ? -1 : 0) - (b.type === 'manufacturer_datasheet' ? -1 : 0));

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: t('nav.home'), to: '/' }, { label: pick(cat.short, lang), to: `/category/${cat.id}` }, { label: p.name }]} />

      <header className="detail-head">
        <div>
          <div className="row gap wrap">
            <Tag tone="brand">{t('type.product')}</Tag>
            <Tag>{pick(cat.name, lang)}</Tag>
            {p.custom && <Tag tone="warn">{t('admin.customTag')}</Tag>}
          </div>
          <h1>{brand.name.split(' (')[0]} {p.name}</h1>
          <p className="muted">{p.type} · <A to={`/org/${brand.id}`}>{brand.name}</A></p>
          <p className="lead small-lead">{p.summary}</p>
          <div className="row gap wrap">
            {(p.applications || []).map((a) => <Tag key={a}>{a}</Tag>)}
          </div>
        </div>
        <aside className="card detail-side">
          <div className="row gap wrap"><StatusBadge status={status} /></div>
          <p className="muted small"><Icon name="clock" size={14} /> {t('evidence.checked')} {fmtDate(p.checked || '2026-10-15', lang)}</p>
          <p className="muted small">{t('product.completeness', { a: filled, b: total })}</p>
          <div className="stack">
            <CompareToggle id={p.id} small={false} />
            <button type="button" className="btn btn-ghost" onClick={() => openModal({ kind: 'correction', target: `${brand.name.split(' (')[0]} ${p.name}` })}>
              <Icon name="flag" size={16} /> {t('correction.suggest')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => openModal({ kind: 'correction', type: 'outdated', target: `${brand.name.split(' (')[0]} ${p.name}` })}>
              <Icon name="clock" size={16} /> {t('correction.reportOutdated')}
            </button>
          </div>
        </aside>
      </header>

      <Section title={t('product.specs')} hint={t('product.specsHint')}>
        <div className="table-wrap">
          <table className="spec-table">
            <thead><tr><th scope="col">{t('table.attribute')}</th><th scope="col">{t('table.value')}</th><th scope="col">{t('table.evidence')}</th></tr></thead>
            <tbody>
              {defs.map((d) => {
                const claim = p.claims[d.key];
                const has = claim && claim.v !== undefined && claim.v !== null && claim.v !== '';
                return (
                  <tr key={d.key}>
                    <th scope="row">{pick(d.label, lang)}</th>
                    <td className="num">{has ? <span className="claim-v">{fmtValue(d, claim.v)}</span> : <NotAvailable />}</td>
                    <td>
                      {has ? (
                        <div className="row gap wrap">
                          <StatusBadge
                            status={claim.status}
                            onClick={() => openEvidence({ title: `${pick(d.label, lang)} - ${p.name}`, value: fmtValue(d, claim.v), status: claim.status, note: claim.note, src: claim.src, edited: claim.edited })}
                          />
                          <span className="muted small">{t('evidence.sourceCount', { n: (claim.src || []).length })}</span>
                          {claim.note && <span className="muted small note-dot" title={claim.note}><Icon name="alert" size={14} /> {t('evidence.hasNote')}</span>}
                        </div>
                      ) : <span className="muted small">{t('product.noEvidence')}</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title={t('product.availability')} hint={t('product.availabilityHint')}>
        <h3 className="h3">{t('product.tzSuppliers')}</h3>
        {suppliers.length === 0 ? (
          <Notice tone="warn" icon="alert" title={t('product.noTzTitle')}>{t('product.noTzBody')}</Notice>
        ) : (
          <>
            <Notice tone="info" icon="info">{t('product.tzCaveat')}</Notice>
            <div className="grid grid-2 mt">
              {suppliers.map(({ org, rel }) => (
                <article className="card" key={org.id}>
                  <div className="row between gap wrap">
                    <h4 className="card-title"><A to={`/org/${org.id}`}>{org.name}</A></h4>
                    <StatusBadge
                      status={rel.status}
                      onClick={() => openEvidence({ title: `${org.name} / ${brand.name.split(' (')[0]}`, value: t('product.brandLevel'), status: rel.status, note: rel.note, src: rel.src })}
                    />
                  </div>
                  <p className="muted small"><Icon name="pin" size={14} /> {[org.city, org.country].filter(Boolean).join(', ')}</p>
                  <RoleBadges org={org} />
                  <p className="small mt-sm">{rel.note}</p>
                </article>
              ))}
            </div>
          </>
        )}

        <h3 className="h3 mt">{t('product.offers')}</h3>
        {offers.length === 0 ? (
          <p className="muted"><NotAvailable /> {t('product.noOffers')}</p>
        ) : (
          <div className="table-wrap">
            <table className="spec-table">
              <thead>
                <tr>
                  <th scope="col">{t('offer.supplier')}</th><th scope="col">{t('offer.market')}</th>
                  <th scope="col">{t('offer.price')}</th><th scope="col">{t('offer.availability')}</th>
                  <th scope="col">{t('offer.checked')}</th><th scope="col">{t('table.evidence')}</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o) => (
                  <tr key={o.id}>
                    <th scope="row">{o.supplier}</th>
                    <td>{o.market}</td>
                    <td className="num">{fmtMoney(o.price, o.currency)} <span className="muted small">({o.basis})</span>{o.note && <div className="muted small">{o.note}</div>}</td>
                    <td>{o.availability}</td>
                    <td>{fmtDate(o.checked, lang)}</td>
                    <td>
                      <StatusBadge status="source_checked" compact onClick={() => openEvidence({ title: `${t('offer.price')} - ${o.supplier}`, value: fmtMoney(o.price, o.currency), status: 'source_checked', note: t('offer.caveat'), src: o.src })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="muted small">{t('offer.caveat')}</p>
      </Section>

      <Section title={t('product.docs')} hint={t('product.docsHint')}>
        <ul className="source-list compact">
          {srcs.map((s) => (
            <li key={s.id} className="source">
              <div className="source-top">
                <a href={s.url} target="_blank" rel="noopener noreferrer"><strong>{s.title}</strong> <Icon name="external" size={14} /></a>
                <span className="tag">{pick(SOURCE_TYPES[s.type] || SOURCE_TYPES.user_submitted, lang)}</span>
              </div>
              <div className="muted small">{s.publisher} · {t('evidence.checked')} {fmtDate(s.checked, lang)}</div>
            </li>
          ))}
        </ul>
      </Section>

      {missing.length > 0 && (
        <Section title={t('product.gaps')} hint={t('product.gapsHint')}>
          <div className="row gap wrap">{missing.map((d) => <span key={d.key} className="na">{pick(d.label, lang)}</span>)}</div>
        </Section>
      )}

      {problems.length > 0 && (
        <Section title={t('product.problems')}>
          <ul className="plain">
            {problems.map((pr) => <li key={pr.id}><A to={`/problem/${pr.id}`}>{pick(pr.title, lang)}</A></li>)}
          </ul>
        </Section>
      )}

      {similar.length > 0 && (
        <Section title={t('product.similar')} hint={t('product.similarHint')}>
          <div className="grid grid-3">{similar.slice(0, 3).map((x) => <ProductCard key={x.id} p={x} />)}</div>
        </Section>
      )}
    </div>
  );
}
