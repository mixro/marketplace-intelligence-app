import React, { useEffect } from 'react';
import { useApp } from '../lib/store.jsx';
import { fmtMoney, fmtNumber, pick } from '../lib/format.js';
import { A, Breadcrumb, Empty, Icon, NotAvailable, Notice, StatusBadge } from '../components/ui.jsx';
import { ClaimValue } from '../components/Cards.jsx';

export default function Compare({ route }) {
  const { data, compare, setCompare, toggleCompare, clearCompare, t, lang } = useApp();
  const [onlyDiff, setOnlyDiff] = React.useState(false);

  // Allow shareable links: /compare?ids=a,b,c
  useEffect(() => {
    const ids = (route.query.ids || '').split(',').filter((id) => data.productsById[id]).slice(0, 3);
    if (ids.length) setCompare(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.raw]);

  const prods = compare.map((id) => data.productsById[id]).filter(Boolean);

  if (prods.length === 0) {
    return (
      <div className="container page">
        <h1 className="page-title">{t('compare.title')}</h1>
        <Empty title={t('compare.emptyTitle')}>
          {t('compare.emptyBody')}
          <div className="row gap wrap center-row mt">
            {Object.values(data.categories).map((c) => <A key={c.id} to={`/search?type=product&cat=${c.id}`} className="btn btn-ghost">{pick(c.short, lang)}</A>)}
          </div>
        </Empty>
      </div>
    );
  }

  const catId = prods[0].category;
  const defs = data.attrDefs[catId];
  const options = data.products.filter((p) => p.category === catId && !compare.includes(p.id));

  const rows = defs.map((d) => {
    const cells = prods.map((p) => p.claims[d.key]);
    const present = cells.filter((c) => c && c.v !== undefined && c.v !== null && c.v !== '');
    const distinct = new Set(present.map((c) => String(c.v)));
    const differs = present.length !== cells.length || distinct.size > 1;
    let bestIdx = [];
    if (d.better === 'high' && d.kind === 'num' && present.length >= 2) {
      const nums = cells.map((c) => (c && typeof c.v === 'number' ? c.v : -Infinity));
      const max = Math.max(...nums);
      if (distinct.size > 1) bestIdx = nums.map((n, i) => (n === max ? i : -1)).filter((i) => i >= 0);
    }
    return { d, cells, differs, bestIdx };
  });
  const shown = onlyDiff ? rows.filter((r) => r.differs) : rows;

  return (
    <div className="container page">
      <Breadcrumb items={[{ label: t('nav.home'), to: '/' }, { label: t('compare.title') }]} />
      <div className="row between gap wrap">
        <div>
          <h1 className="page-title">{t('compare.title')}</h1>
          <p className="muted">{pick(data.categories[catId].name, lang)} · {t('compare.hint')}</p>
        </div>
        <div className="row gap wrap">
          <label className="check">
            <input type="checkbox" checked={onlyDiff} onChange={(e) => setOnlyDiff(e.target.checked)} />
            <span>{t('compare.onlyDiff')}</span>
          </label>
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearCompare}>{t('compare.clear')}</button>
        </div>
      </div>

      {prods.length < 2 && <Notice tone="info" icon="info">{t('compare.needTwo')}</Notice>}
      <Notice tone="info" icon="info">{t('compare.highlightNote')}</Notice>

      <div className="table-wrap mt">
        <table className="compare-table">
          <thead>
            <tr>
              <th scope="col" className="sticky-col">{t('table.attribute')}</th>
              {prods.map((p) => (
                <th scope="col" key={p.id}>
                  <div className="cmp-head">
                    <A to={`/product/${p.id}`}><b>{data.orgsById[p.brand].name.split(' (')[0]}</b><br />{p.name}</A>
                    <button type="button" className="icon-btn" onClick={() => toggleCompare(p.id)} aria-label={`${t('compare.remove')} ${p.name}`}><Icon name="close" size={16} /></button>
                  </div>
                </th>
              ))}
              {prods.length < 3 && options.length > 0 && (
                <th scope="col" className="add-col">
                  <label className="select">
                    <span>{t('compare.addAnother')}</span>
                    <select value="" onChange={(e) => e.target.value && toggleCompare(e.target.value)}>
                      <option value="">{t('compare.choose')}</option>
                      {options.map((p) => <option key={p.id} value={p.id}>{data.orgsById[p.brand].name.split(' (')[0]} {p.name}</option>)}
                    </select>
                  </label>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {shown.map(({ d, cells, differs, bestIdx }) => (
              <tr key={d.key} className={differs ? 'differs' : ''}>
                <th scope="row" className="sticky-col">{pick(d.label, lang)}{differs && <span className="diff-dot" title={t('compare.differs')} />}</th>
                {cells.map((c, i) => (
                  <td key={i} className={bestIdx.includes(i) ? 'best' : ''}>
                    <ClaimValue product={prods[i]} def={d} claim={c} />
                    {bestIdx.includes(i) && <span className="best-tag"><Icon name="arrow" size={12} /> {t('compare.highest')}</span>}
                  </td>
                ))}
                {prods.length < 3 && options.length > 0 && <td className="add-col" />}
              </tr>
            ))}
            <tr className="group-row"><th scope="row" className="sticky-col" colSpan={1}>{t('compare.availability')}</th>{prods.map((p) => <td key={p.id} />)}{prods.length < 3 && options.length > 0 && <td className="add-col" />}</tr>
            <tr>
              <th scope="row" className="sticky-col">{t('compare.tzEvidence')}</th>
              {prods.map((p) => {
                const s = data.localSuppliersFor(p);
                return (
                  <td key={p.id}>
                    {s.length ? (
                      <div>
                        <b>{t('card.tzSuppliers', { n: s.length })}</b>
                        <div className="muted small">{s.map((x) => x.org.name).join(', ')}</div>
                        <div className="muted small">{t('product.brandLevel')}</div>
                      </div>
                    ) : <NotAvailable>{t('card.noTz')}</NotAvailable>}
                  </td>
                );
              })}
              {prods.length < 3 && options.length > 0 && <td className="add-col" />}
            </tr>
            <tr>
              <th scope="row" className="sticky-col">{t('compare.refPrice')}</th>
              {prods.map((p) => {
                const o = data.offers.filter((x) => x.product === p.id);
                return (
                  <td key={p.id}>
                    {o.length ? o.map((x) => (
                      <div key={x.id}>
                        <span className="claim-v">{fmtMoney(x.price, x.currency)}</span>
                        <div className="muted small">{x.supplier} · {x.market}</div>
                      </div>
                    )) : <NotAvailable />}
                  </td>
                );
              })}
              {prods.length < 3 && options.length > 0 && <td className="add-col" />}
            </tr>
            <tr>
              <th scope="row" className="sticky-col">{t('compare.overall')}</th>
              {prods.map((p) => <td key={p.id}><StatusBadge status={data.productStatus(p)} /></td>)}
              {prods.length < 3 && options.length > 0 && <td className="add-col" />}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="muted small mt">{t('compare.footnote', { n: fmtNumber(prods.length) })}</p>
    </div>
  );
}
