import React from 'react';
import { useApp } from '../lib/store.jsx';
import { fmtDate, fmtValue, pick } from '../lib/format.js';
import { A, Icon, NotAvailable, StatusBadge, Tag } from './ui.jsx';

export const KEY_SPECS = {
  inverters: ['rated_ac_power', 'battery_voltage', 'phases'],
  mppt: ['max_pv_voc', 'rated_charge_current', 'battery_voltages'],
  pumps: ['max_flow', 'max_head', 'installation'],
};

// One claim: value + compact status button that opens the evidence drawer.
export function ClaimValue({ product, def, claim }) {
  const { openEvidence, lang, t } = useApp();
  if (!claim || claim.v === undefined || claim.v === null || claim.v === '') return <NotAvailable />;
  const open = () => openEvidence({
    title: `${pick(def.label, lang)} - ${product.name}`,
    value: fmtValue(def, claim.v),
    status: claim.status, note: claim.note, src: claim.src, edited: claim.edited,
  });
  return (
    <span className="claim">
      <span className="claim-v">{fmtValue(def, claim.v)}</span>
      <StatusBadge status={claim.status} compact onClick={open} title={t('evidence.open')} />
    </span>
  );
}

export function CompareToggle({ id, small = true }) {
  const { compare, toggleCompare, t } = useApp();
  const on = compare.includes(id);
  return (
    <button type="button" className={`btn ${on ? 'btn-primary' : 'btn-ghost'}${small ? ' btn-sm' : ''}`} onClick={() => toggleCompare(id)} aria-pressed={on}>
      <Icon name={on ? 'check' : 'compare'} size={16} /> {on ? t('compare.added') : t('compare.add')}
    </button>
  );
}

export function ProductCard({ p }) {
  const { data, lang, t } = useApp();
  const brand = data.orgsById[p.brand];
  const cat = data.categories[p.category];
  const specs = KEY_SPECS[p.category] || [];
  const defs = data.attrDefs[p.category];
  const status = data.productStatus(p);
  const review = Object.values(p.claims).filter((c) => c.status === 'needs_review').length;
  const tz = data.localSuppliersFor(p).length;
  return (
    <article className="card product-card">
      <div className="card-top">
        <Tag tone="brand">{t('type.product')}</Tag>
        <Tag>{pick(cat.short, lang)}</Tag>
      </div>
      <h3 className="card-title"><A to={`/product/${p.id}`}>{brand.name.split(' (')[0]} {p.name}</A></h3>
      <p className="muted small">{p.type}</p>
      <p className="card-text">{p.summary}</p>
      <dl className="mini-specs">
        {specs.map((k) => {
          const def = defs.find((d) => d.key === k);
          const claim = p.claims[k];
          return (
            <div key={k}>
              <dt>{pick(def.label, lang)}</dt>
              <dd>{claim && claim.v !== undefined ? fmtValue(def, claim.v) : <NotAvailable />}</dd>
            </div>
          );
        })}
      </dl>
      <div className="card-foot">
        <div className="row gap wrap">
          <StatusBadge status={status} />
          {review > 0 && <span className="muted small">{t('card.reviewCount', { n: review })}</span>}
        </div>
        <div className="row gap wrap between">
          <span className="muted small"><Icon name="clock" size={14} /> {t('evidence.checked')} {fmtDate(p.checked || '2026-10-15', lang)}</span>
          <span className="muted small"><Icon name="pin" size={14} /> {tz ? t('card.tzSuppliers', { n: tz }) : t('card.noTz')}</span>
        </div>
        <CompareToggle id={p.id} />
      </div>
    </article>
  );
}

export function RoleBadges({ org }) {
  const { t } = useApp();
  return (
    <div className="row gap wrap">
      {org.roles.map((r, i) => (
        <span key={i} className={`role role-${r.status}`} title={t(`status.${r.status}`)}>
          {t(`role.${r.role}`)}
          <Icon name={r.status === 'needs_review' ? 'alert' : r.status === 'confirmed' ? 'checks' : r.status === 'submitted' ? 'circle' : 'check'} size={12} />
        </span>
      ))}
    </div>
  );
}

export function OrgCard({ o }) {
  const { data, lang, t } = useApp();
  const prods = data.productsForOrg(o);
  const brands = o.kind === 'local' ? o.brands.map((b) => data.orgsById[b.brand].name) : [];
  return (
    <article className="card org-card">
      <div className="card-top">
        <Tag tone="accent">{t('type.org')}</Tag>
        <Tag>{o.kind === 'manufacturer' ? t('org.kindManufacturer') : t('org.kindLocal')}</Tag>
      </div>
      <h3 className="card-title"><A to={`/org/${o.id}`}>{o.name}</A></h3>
      {o.legalName && <p className="muted small">{o.legalName}</p>}
      <p className="muted small"><Icon name="pin" size={14} /> {[o.city, o.country].filter(Boolean).join(', ') || <NotAvailable />}</p>
      <p className="card-text">{pick(o.description, lang)}</p>
      <RoleBadges org={o} />
      <div className="card-foot">
        {brands.length > 0 && <p className="small"><b>{t('org.brands')}:</b> {brands.join(', ')}</p>}
        <p className="muted small">{t('org.productsLinked', { n: prods.length })}</p>
      </div>
    </article>
  );
}

export function ProblemCard({ pr }) {
  const { lang, t, data } = useApp();
  return (
    <article className="card problem-card">
      <div className="card-top">
        <Tag tone="warn">{t('type.problem')}</Tag>
        <StatusBadge status="submitted" />
      </div>
      <h3 className="card-title"><A to={`/problem/${pr.id}`}>{pick(pr.title, lang)}</A></h3>
      <p className="card-text">{pick(pr.description, lang)}</p>
      <p className="muted small">{t('problem.hypothesis')}</p>
      <div className="card-foot">
        <p className="small"><b>{t('problem.related')}:</b> {pr.related.map((id) => data.productsById[id]).filter(Boolean).length} {t('problem.relatedProducts')}</p>
      </div>
    </article>
  );
}

export function CategoryCard({ c }) {
  const { data, lang, t } = useApp();
  const n = data.products.filter((p) => p.category === c.id).length;
  return (
    <article className="card category-card">
      <div className="card-top"><Tag>{t('type.category')}</Tag></div>
      <h3 className="card-title"><A to={`/category/${c.id}`}>{pick(c.name, lang)}</A></h3>
      <p className="card-text">{pick(c.description, lang)}</p>
      <div className="card-foot"><p className="muted small">{t('home.productsCount', { n })}</p></div>
    </article>
  );
}
