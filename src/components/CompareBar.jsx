import React from 'react';
import { useApp } from '../lib/store.jsx';
import { A, Icon } from './ui.jsx';

export default function CompareBar() {
  const { compare, data, toggleCompare, clearCompare, t } = useApp();
  if (!compare.length) return null;
  const ids = compare.join(',');
  return (
    <div className="comparebar" role="region" aria-label={t('compare.title')}>
      <div className="comparebar-inner">
        <div className="chips">
          {compare.map((id) => {
            const p = data.productsById[id];
            if (!p) return null;
            return (
              <span className="chip" key={id}>
                {data.orgsById[p.brand].name.split(' ')[0]} {p.name}
                <button type="button" onClick={() => toggleCompare(id)} aria-label={`${t('compare.remove')} ${p.name}`}><Icon name="close" size={14} /></button>
              </span>
            );
          })}
        </div>
        <div className="row gap">
          <button type="button" className="btn btn-ghost btn-sm" onClick={clearCompare}>{t('compare.clear')}</button>
          <A to={`/compare?ids=${ids}`} className={`btn btn-primary btn-sm${compare.length < 2 ? ' disabled' : ''}`} aria-disabled={compare.length < 2}>
            <Icon name="compare" size={16} /> {t('compare.open', { n: compare.length })}
          </A>
        </div>
      </div>
    </div>
  );
}
