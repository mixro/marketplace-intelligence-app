import React, { useMemo, useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { fmtValue, pick, STATUS_KEYS } from '../lib/format.js';
import { A, Empty, Icon, Notice, StatusBadge } from '../components/ui.jsx';

const today = () => new Date().toISOString().slice(0, 10);

function ReviewRow({ row }) {
  const { setOverride, clearOverride, openEvidence, notify, t, lang } = useApp();
  const { p, d, claim } = row;
  const [v, setV] = useState(String(claim.v));
  const [status, setStatus] = useState(claim.status);
  const [note, setNote] = useState(claim.note || '');
  const dirty = v !== String(claim.v) || status !== claim.status || note !== (claim.note || '');

  const save = () => {
    const val = d.kind === 'num' && v.trim() !== '' && !Number.isNaN(Number(v)) ? Number(v) : v;
    setOverride(p.id, d.key, { v: val, status, note });
    notify(t('admin.saved'));
  };

  return (
    <tr>
      <th scope="row">
        <A to={`/product/${p.id}`}>{p.name}</A>
        <div className="muted small">{pick(d.label, lang)}{d.unit ? ` (${d.unit})` : ''}</div>
      </th>
      <td><input className="in" value={v} onChange={(e) => setV(e.target.value)} aria-label={t('table.value')} /></td>
      <td>
        <select className="in" value={status} onChange={(e) => setStatus(e.target.value)} aria-label={t('admin.status')}>
          {STATUS_KEYS.map((s) => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
        </select>
      </td>
      <td><textarea className="in" rows={2} value={note} onChange={(e) => setNote(e.target.value)} aria-label={t('admin.note')} /></td>
      <td>
        <div className="stack tight">
          <button type="button" className="btn btn-primary btn-sm" disabled={!dirty} onClick={save}>{t('common.save')}</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => openEvidence({ title: `${pick(d.label, lang)} - ${p.name}`, value: fmtValue(d, claim.v), status: claim.status, note: claim.note, src: claim.src, edited: claim.edited })}>{t('evidence.open')}</button>
          {claim.edited && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { clearOverride(p.id, d.key); notify(t('admin.reverted')); }}>{t('admin.revert')}</button>}
        </div>
      </td>
    </tr>
  );
}

function ReviewTab() {
  const { data, t } = useApp();
  const [all, setAll] = useState(false);
  const rows = useMemo(() => {
    const out = [];
    data.products.forEach((p) => {
      data.attrDefs[p.category].forEach((d) => {
        const claim = p.claims[d.key];
        if (!claim || claim.v === undefined) return;
        if (all || claim.status === 'needs_review' || claim.status === 'submitted') out.push({ p, d, claim });
      });
    });
    const rank = { needs_review: 0, submitted: 1, source_checked: 2, confirmed: 3 };
    return out.sort((a, b) => rank[a.claim.status] - rank[b.claim.status]);
  }, [data, all]);

  return (
    <div>
      <div className="row between gap wrap">
        <p className="muted">{t('admin.reviewHint')}</p>
        <label className="check"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} /><span>{t('admin.showAll')}</span></label>
      </div>
      {rows.length === 0 ? <Empty title={t('admin.queueEmpty')} /> : (
        <div className="table-wrap">
          <table className="spec-table admin-table">
            <thead><tr><th scope="col">{t('admin.claim')}</th><th scope="col">{t('table.value')}</th><th scope="col">{t('admin.status')}</th><th scope="col">{t('admin.note')}</th><th scope="col" /></tr></thead>
            <tbody>{rows.map((r) => <ReviewRow key={`${r.p.id}.${r.d.key}.${r.claim.status}.${r.claim.edited}`} row={r} />)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddTab() {
  const { data, addProduct, removeProduct, customProducts, notify, t, lang } = useApp();
  const mfrs = data.orgs.filter((o) => o.kind === 'manufacturer');
  const [category, setCategory] = useState('inverters');
  const [brand, setBrand] = useState(mfrs[0].id);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [summary, setSummary] = useState('');
  const [vals, setVals] = useState({});
  const defs = data.attrDefs[category];
  const set = (k, patch) => setVals((o) => ({ ...o, [k]: { ...(o[k] || {}), ...patch } }));

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const stamp = Date.now();
    const attrs = {};
    const extraSources = [];
    defs.forEach((d) => {
      const e1 = vals[d.key];
      if (!e1 || !String(e1.v || '').trim()) return;
      const raw = String(e1.v).trim();
      const v = d.kind === 'num' && !Number.isNaN(Number(raw)) ? Number(raw) : raw;
      const src = [];
      if (e1.url && e1.url.trim()) {
        const sid = `custom-${stamp}-${d.key}`;
        extraSources.push({ id: sid, title: e1.url.trim(), publisher: 'Admin entry', type: 'user_submitted', url: e1.url.trim(), supports: `${pick(d.label, 'en')} entered through the prototype admin form.`, checked: today() });
        src.push(sid);
      }
      // without a source the claim can only be "submitted"
      attrs[d.key] = { v, status: src.length ? e1.status || 'submitted' : 'submitted', src, ...(e1.note ? { note: e1.note } : {}) };
    });
    addProduct({
      id: `custom-${stamp}`, custom: true, category, brand, name: name.trim(), type: type.trim() || '-',
      summary: summary.trim() || '-', applications: [], keywords: `${name} ${type} ${summary}`, attrs, extraSources, checked: today(),
    });
    notify(t('admin.productAdded'));
    setName(''); setType(''); setSummary(''); setVals({});
  };

  return (
    <div className="grid grid-2 start">
      <form className="card" onSubmit={submit}>
        <h3 className="card-title">{t('admin.addProduct')}</h3>
        <div className="form-grid">
          <label className="field"><span>{t('filter.category')}</span>
            <select value={category} onChange={(e) => { setCategory(e.target.value); setVals({}); }}>
              {Object.values(data.categories).map((c) => <option key={c.id} value={c.id}>{pick(c.short, lang)}</option>)}
            </select>
          </label>
          <label className="field"><span>{t('filter.brand')}</span>
            <select value={brand} onChange={(e) => setBrand(e.target.value)}>
              {mfrs.map((m) => <option key={m.id} value={m.id}>{m.name.split(' (')[0]}</option>)}
            </select>
          </label>
          <label className="field wide"><span>{t('admin.productName')}</span><input value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label className="field wide"><span>{t('admin.productType')}</span><input value={type} onChange={(e) => setType(e.target.value)} /></label>
          <label className="field wide"><span>{t('admin.summary')}</span><textarea rows={2} value={summary} onChange={(e) => setSummary(e.target.value)} /></label>
        </div>
        <h4 className="h3">{t('admin.specs')}</h4>
        <p className="muted small">{t('admin.specsHint')}</p>
        {defs.map((d) => (
          <div className="spec-input" key={d.key}>
            <label className="field"><span>{pick(d.label, lang)}{d.unit ? ` (${d.unit})` : ''}</span>
              <input value={(vals[d.key] && vals[d.key].v) || ''} onChange={(e) => set(d.key, { v: e.target.value })} />
            </label>
            <label className="field"><span>{t('admin.sourceUrl')}</span>
              <input type="url" placeholder="https://" value={(vals[d.key] && vals[d.key].url) || ''} onChange={(e) => set(d.key, { url: e.target.value })} />
            </label>
          </div>
        ))}
        <button type="submit" className="btn btn-primary"><Icon name="plus" size={16} /> {t('admin.addProduct')}</button>
      </form>

      <div className="card">
        <h3 className="card-title">{t('admin.customList')}</h3>
        {customProducts.length === 0 ? <p className="muted">{t('admin.noCustom')}</p> : (
          <ul className="plain">
            {customProducts.map((p) => (
              <li key={p.id} className="row between gap">
                <A to={`/product/${p.id}`}>{p.name}</A>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => removeProduct(p.id)}>{t('common.remove')}</button>
              </li>
            ))}
          </ul>
        )}
        <Notice tone="info" icon="info">{t('admin.addNote')}</Notice>
      </div>
    </div>
  );
}

function InboxTab() {
  const { corrections, toggleCorrection, t } = useApp();
  if (!corrections.length) return <Empty title={t('admin.inboxEmpty')}>{t('admin.inboxHint')}</Empty>;
  return (
    <ul className="plain inbox">
      {corrections.map((c) => (
        <li key={c.id} className={`card${c.resolved ? ' done' : ''}`}>
          <div className="row between gap wrap">
            <div className="row gap wrap"><span className="tag">{t(`correction.kind.${c.kind}`)}</span><strong>{c.target || t('correction.general')}</strong></div>
            <span className="muted small">{c.at}</span>
          </div>
          <p>{c.message}</p>
          {c.url && <p className="small"><a href={c.url} target="_blank" rel="noopener noreferrer">{c.url}</a></p>}
          {c.contact && <p className="muted small">{c.contact}</p>}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => toggleCorrection(c.id)}>{c.resolved ? t('admin.reopen') : t('admin.resolve')}</button>
        </li>
      ))}
    </ul>
  );
}

function DataTab() {
  const { overrides, customProducts, corrections, resetLocal, notify, t } = useApp();
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), overrides, customProducts, corrections }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'amip-local-edits.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="grid grid-2 start">
      <div className="card">
        <h3 className="card-title">{t('admin.export')}</h3>
        <p className="muted">{t('admin.exportHint')}</p>
        <p className="small">{t('admin.counts', { a: Object.keys(overrides).length, b: customProducts.length, c: corrections.length })}</p>
        <button type="button" className="btn btn-primary" onClick={exportJson}><Icon name="download" size={16} /> {t('admin.exportBtn')}</button>
      </div>
      <div className="card">
        <h3 className="card-title">{t('admin.reset')}</h3>
        <p className="muted">{t('admin.resetHint')}</p>
        <button type="button" className="btn btn-ghost" onClick={() => { if (window.confirm(t('admin.resetConfirm'))) { resetLocal(); notify(t('admin.resetDone')); } }}>{t('admin.resetBtn')}</button>
      </div>
    </div>
  );
}

export default function Admin() {
  const { t, corrections } = useApp();
  const [tab, setTab] = useState('review');
  const open = corrections.filter((c) => !c.resolved).length;
  const tabs = [['review', t('admin.tab.review')], ['add', t('admin.tab.add')], ['inbox', `${t('admin.tab.inbox')}${open ? ` (${open})` : ''}`], ['data', t('admin.tab.data')]];
  return (
    <div className="container page">
      <h1 className="page-title">{t('admin.title')}</h1>
      <Notice tone="warn" icon="alert" title={t('admin.protoTitle')}>{t('admin.protoBody')}</Notice>
      <div className="seg mt" role="tablist">
        {tabs.map(([k, label]) => <button key={k} type="button" role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{label}</button>)}
      </div>
      <div className="mt">
        {tab === 'review' && <ReviewTab />}
        {tab === 'add' && <AddTab />}
        {tab === 'inbox' && <InboxTab />}
        {tab === 'data' && <DataTab />}
      </div>
    </div>
  );
}
