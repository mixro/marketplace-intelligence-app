import React, { useEffect, useState } from 'react';
import { useApp } from '../lib/store.jsx';
import { Icon } from './ui.jsx';

// Suggestions are stored locally in this prototype and appear in the admin inbox.
export default function CorrectionModal() {
  const { modal, closeModal, addCorrection, notify, t } = useApp();
  const [kind, setKind] = useState('correction');
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (modal && modal.kind === 'correction') {
      setKind(modal.type || 'correction');
      setMessage('');
      setUrl('');
      setContact('');
    }
  }, [modal]);

  useEffect(() => {
    if (!modal) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, closeModal]);

  if (!modal || modal.kind !== 'correction') return null;

  const submit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    addCorrection({ kind, target: modal.target || '', message: message.trim(), url: url.trim(), contact: contact.trim() });
    notify(t('correction.saved'));
    closeModal();
  };

  return (
    <div className="overlay center" onClick={closeModal}>
      <form className="modal" onSubmit={submit} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t('correction.suggest')}>
        <header className="drawer-head">
          <div>
            <p className="eyebrow">{t('correction.suggest')}</p>
            <h2>{modal.target || t('correction.general')}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={closeModal} aria-label={t('common.close')}><Icon name="close" /></button>
        </header>
        <div className="drawer-body">
          <fieldset className="seg">
            {['correction', 'outdated', 'missing'].map((k) => (
              <label key={k} className={kind === k ? 'on' : ''}>
                <input type="radio" name="kind" value={k} checked={kind === k} onChange={() => setKind(k)} />
                {t(`correction.kind.${k}`)}
              </label>
            ))}
          </fieldset>
          <label className="field">
            <span>{t('correction.message')}</span>
            <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required placeholder={t('correction.placeholder')} />
          </label>
          <label className="field">
            <span>{t('correction.url')}</span>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://" />
          </label>
          <label className="field">
            <span>{t('correction.contact')}</span>
            <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
          <p className="muted small">{t('correction.localOnly')}</p>
        </div>
        <footer className="drawer-foot">
          <button type="button" className="btn btn-ghost" onClick={closeModal}>{t('common.cancel')}</button>
          <button type="submit" className="btn btn-primary">{t('correction.send')}</button>
        </footer>
      </form>
    </div>
  );
}
