import React from 'react';
import { useApp } from '../lib/store.jsx';
import { A, Icon } from './ui.jsx';
import EvidenceDrawer from './EvidenceDrawer.jsx';
import CorrectionModal from './CorrectionModal.jsx';
import CompareBar from './CompareBar.jsx';

export default function Layout({ route, children }) {
  const { t, lang, setLang, theme, setTheme, toast, compare, data } = useApp();
  const first = route.segs[0] || 'home';
  const navItems = [
    { to: '/', key: 'home', label: t('nav.home') },
    { to: '/search', key: 'search', label: t('nav.search') },
    { to: '/compare', key: 'compare', label: t('nav.compare') },
    { to: '/about', key: 'about', label: t('nav.about') },
    { to: '/admin', key: 'admin', label: t('nav.admin') },
  ];
  const nextTheme = theme === 'auto' ? 'dark' : theme === 'dark' ? 'light' : 'auto';

  return (
    <div className={`app${compare.length ? ' has-bar' : ''}`}>
      <a className="skip" href="#main">{t('common.skip')}</a>
      <header className="topbar">
        <div className="topbar-inner">
          <A to="/" className="brand" aria-label="AMIP">
            <span className="logo" aria-hidden="true"><Icon name="bolt" size={18} /></span>
            <span className="brand-text">
              <b>AMIP</b>
              <small>{t('brand.tagline')}</small>
            </span>
            <span className="pill pill-proto">{t('brand.prototype')}</span>
          </A>
          <nav className="nav" aria-label="Main">
            {navItems.map((n) => (
              <A key={n.key} to={n.to} className={`nav-link${first === n.key || (n.key === 'home' && first === 'home') ? ' active' : ''}`}>
                {n.label}
                {n.key === 'compare' && compare.length > 0 && <span className="count">{compare.length}</span>}
              </A>
            ))}
          </nav>
          <div className="row gap tools">
            <div className="seg seg-sm" role="group" aria-label={t('common.language')}>
              <button type="button" className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')} aria-pressed={lang === 'en'}>EN</button>
              <button type="button" className={lang === 'sw' ? 'on' : ''} onClick={() => setLang('sw')} aria-pressed={lang === 'sw'}>SW</button>
            </div>
            <button type="button" className="icon-btn" onClick={() => setTheme(nextTheme)} title={`${t('common.theme')}: ${t(`theme.${theme}`)}`} aria-label={`${t('common.theme')}: ${t(`theme.${theme}`)}`}>
              <Icon name={theme === 'dark' ? 'moon' : 'sun'} />
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="main">{children}</main>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <b>AMIP</b>
            <p className="muted small">{t('footer.about')}</p>
          </div>
          <div>
            <p className="small">{t('footer.dataset', { p: data.products.length, o: data.orgs.length, s: data.sources.length })}</p>
            <p className="muted small">{t('footer.disclaimer')}</p>
          </div>
        </div>
      </footer>

      <CompareBar />
      <EvidenceDrawer />
      <CorrectionModal />
      {toast && <div className="toast" role="status" key={toast.id}>{toast.message}</div>}
    </div>
  );
}
