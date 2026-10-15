import React, { useEffect, useRef } from 'react';
import { useApp } from '../lib/store.jsx';
import { fmtDate, pick } from '../lib/format.js';
import { SOURCE_TYPES } from '../data/sources.js';
import { Icon, StatusBadge } from './ui.jsx';

// Opens from any claim: what the source supports, when it was checked and what it does NOT prove.
export default function EvidenceDrawer() {
  const { drawer, closeEvidence, data, t, lang, openModal } = useApp();
  const closeRef = useRef(null);

  useEffect(() => {
    if (!drawer) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeEvidence(); };
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer, closeEvidence]);

  if (!drawer) return null;
  const srcs = (drawer.src || []).map((id) => data.sourcesById[id]).filter(Boolean);

  return (
    <div className="overlay" onClick={closeEvidence}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={t('evidence.title')} onClick={(e) => e.stopPropagation()}>
        <header className="drawer-head">
          <div>
            <p className="eyebrow">{t('evidence.title')}</p>
            <h2>{drawer.title}</h2>
          </div>
          <button ref={closeRef} type="button" className="icon-btn" onClick={closeEvidence} aria-label={t('common.close')}>
            <Icon name="close" />
          </button>
        </header>

        <div className="drawer-body">
          {drawer.value && <p className="drawer-value">{drawer.value}</p>}
          <div className="row gap">
            <StatusBadge status={drawer.status} />
            {drawer.edited && <span className="tag">{t('evidence.edited')}</span>}
          </div>
          <p className="muted small">{t(`statusHelp.${drawer.status}`)}</p>
          {drawer.note && (
            <div className="notice notice-warn"><Icon name="alert" /><div>{drawer.note}</div></div>
          )}

          <h3>{t('evidence.sources', { n: srcs.length })}</h3>
          {srcs.length === 0 && <p className="muted">{t('evidence.none')}</p>}
          <ul className="source-list">
            {srcs.map((s) => (
              <li key={s.id} className="source">
                <div className="source-top">
                  <strong>{s.title}</strong>
                  <span className="tag">{pick(SOURCE_TYPES[s.type] || SOURCE_TYPES.user_submitted, lang)}</span>
                </div>
                <div className="muted small">{s.publisher}</div>
                <p className="small"><b>{t('evidence.supports')}:</b> {s.supports}</p>
                <p className="small caveat"><Icon name="info" size={14} /> {t(`caveat.${s.type}`)}</p>
                <div className="row gap between">
                  <span className="muted small"><Icon name="clock" size={14} /> {t('evidence.checked')} {fmtDate(s.checked, lang)}</span>
                  <a className="btn btn-ghost btn-sm" href={s.url} target="_blank" rel="noopener noreferrer">
                    {t('evidence.openSource')} <Icon name="external" size={14} />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <footer className="drawer-foot">
          <button type="button" className="btn btn-ghost" onClick={() => { closeEvidence(); openModal({ kind: 'correction', target: drawer.title }); }}>
            <Icon name="flag" size={16} /> {t('correction.suggest')}
          </button>
        </footer>
      </aside>
    </div>
  );
}
