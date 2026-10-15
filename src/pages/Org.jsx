import React from 'react';
import { useApp } from '../lib/store.jsx';
import { fmtDate, pick } from '../lib/format.js';
import { A, Breadcrumb, Empty, Icon, Notice, NotAvailable, Section, StatusBadge, Tag } from '../components/ui.jsx';
import { ProductCard } from '../components/Cards.jsx';

export default function Org({ id }) {
  const { data, lang, t, openEvidence, openModal } = useApp();
  const o = data.orgsById[id];
  if (!o) return <div className="container page"><Empty title={t('common.notFound')}><A to="/search?type=org" className="btn btn-ghost">{t('nav.search')}</A></Empty></div>;
  const prods = data.productsForOrg(o);
  const srcIds = [...new Set([...o.roles.flatMap((r) => r.src), ...o.brands.flatMap((b) => b.src)])];
  const srcs = srcIds.map((s) => data.sourcesById[s]).filter(Boolean);
  const supplied = o.kind === 'manufacturer' ? data.orgs.filter((x) => x.kind === 'local' && x.brands.some((b) => b.brand === o.id)) : [];

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: t('nav.home'), to: '/' }, { label: t('nav.search'), to: '/search?type=org' }, { label: o.name }]} />
      <header className="detail-head">
        <div>
          <div className="row gap wrap">
            <Tag tone="accent">{t('type.org')}</Tag>
            <Tag>{o.kind === 'manufacturer' ? t('org.kindManufacturer') : t('org.kindLocal')}</Tag>
          </div>
          <h1>{o.name}</h1>
          {o.legalName && <p className="muted">{t('org.legalName')}: {o.legalName}</p>}
          <p className="lead small-lead">{pick(o.description, lang)}</p>
        </div>
        <aside className="card detail-side">
          <ul className="plain contact">
            <li><Icon name="pin" size={16} /> {o.address ? o.address : [o.city, o.country].filter(Boolean).join(', ') || <NotAvailable />}</li>
            <li><Icon name="globe" size={16} /> {o.website ? <a href={o.website} target="_blank" rel="noopener noreferrer">{o.website.replace(/^https?:\/\//, '')}</a> : <NotAvailable />}</li>
            <li><Icon name="phone" size={16} /> {o.phone ? <a href={`tel:${o.phone}`}>{o.phone}</a> : <><NotAvailable /> <span className="muted small">{t('org.phoneHint')}</span></>}</li>
            <li><Icon name="chat" size={16} /> {o.whatsapp ? <a href={`https://wa.me/${o.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp</a> : <><NotAvailable /> <span className="muted small">WhatsApp</span></>}</li>
          </ul>
          <button type="button" className="btn btn-ghost" onClick={() => openModal({ kind: 'correction', target: o.name })}>
            <Icon name="flag" size={16} /> {t('correction.suggest')}
          </button>
        </aside>
      </header>

      <Section title={t('org.roles')} hint={t('org.rolesHint')}>
        <div className="grid grid-2">
          {o.roles.map((r, i) => (
            <article className="card" key={i}>
              <div className="row between gap wrap">
                <h3 className="card-title">{t(`role.${r.role}`)}</h3>
                <StatusBadge status={r.status} onClick={() => openEvidence({ title: `${o.name} - ${t(`role.${r.role}`)}`, value: t(`role.${r.role}`), status: r.status, note: r.note, src: r.src })} />
              </div>
              <p className="small">{r.note}</p>
              <p className="muted small">{t('evidence.sourceCount', { n: r.src.length })}</p>
            </article>
          ))}
        </div>
      </Section>

      {o.kind === 'local' && (
        <Section title={t('org.brandsTitle')} hint={t('org.brandsHint')}>
          {o.brands.length === 0 ? (
            <Notice tone="warn" icon="alert">{t('org.noBrands')}</Notice>
          ) : (
            <div className="grid grid-2">
              {o.brands.map((b) => {
                const m = data.orgsById[b.brand];
                return (
                  <article className="card" key={b.brand}>
                    <div className="row between gap wrap">
                      <h3 className="card-title"><A to={`/org/${m.id}`}>{m.name}</A></h3>
                      <StatusBadge status={b.status} onClick={() => openEvidence({ title: `${o.name} / ${m.name.split(' (')[0]}`, value: t('product.brandLevel'), status: b.status, note: b.note, src: b.src })} />
                    </div>
                    <p className="small">{b.note}</p>
                  </article>
                );
              })}
            </div>
          )}
        </Section>
      )}

      {o.kind === 'manufacturer' && (
        <Section title={t('org.localSuppliers')} hint={t('org.localSuppliersHint')}>
          {supplied.length === 0 ? (
            <Notice tone="warn" icon="alert" title={t('product.noTzTitle')}>{t('org.noLocal')}</Notice>
          ) : (
            <div className="grid grid-3">
              {supplied.map((s) => (
                <article className="card" key={s.id}>
                  <h3 className="card-title"><A to={`/org/${s.id}`}>{s.name}</A></h3>
                  <p className="muted small"><Icon name="pin" size={14} /> {[s.city, s.country].join(', ')}</p>
                  <p className="small">{s.roles.map((r) => t(`role.${r.role}`)).join(', ')}</p>
                </article>
              ))}
            </div>
          )}
        </Section>
      )}

      <Section title={t('org.products')} hint={o.kind === 'local' ? t('org.productsHintLocal') : undefined}>
        {prods.length === 0 ? <p className="muted"><NotAvailable /> {t('org.noProducts')}</p> : (
          <div className="grid grid-3">{prods.map((p) => <ProductCard key={p.id} p={p} />)}</div>
        )}
      </Section>

      <Section title={t('org.sources')}>
        <ul className="source-list compact">
          {srcs.map((s) => (
            <li key={s.id} className="source">
              <a href={s.url} target="_blank" rel="noopener noreferrer"><strong>{s.title}</strong> <Icon name="external" size={14} /></a>
              <div className="muted small">{s.publisher} · {t('evidence.checked')} {fmtDate(s.checked, lang)}</div>
              <p className="small">{s.supports}</p>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
