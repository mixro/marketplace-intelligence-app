import React from 'react';
import { useApp } from '../lib/store.jsx';
import { href } from '../lib/router.js';

const ICONS = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-4.3-4.3',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  checks: 'M2 13l4 4 8-9M10 16l1 1 9-10',
  alert: 'M12 3l10 18H2L12 3zM12 10v5M12 18v.5',
  circle: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  clock: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 8v4l3 2',
  compare: 'M4 5h6v14H4zM14 5h6v14h-6z',
  close: 'M6 6l12 12M18 6L6 18',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z',
  chat: 'M4 20l1.5-4A8 8 0 1 1 9 19.5L4 20z',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  pin: 'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  plus: 'M12 5v14M5 12h14',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
  moon: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z',
  layers: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  building: 'M4 21V5l8-2v18M12 9h8v12M7 8h2M7 12h2M7 16h2M15 13h2M15 17h2',
  bolt: 'M13 2L5 14h6l-1 8 8-12h-6l1-8z',
  drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  filter: 'M4 5h16l-6 7v6l-4 2v-8L4 5z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  info: 'M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM12 11v5M12 8v.5',
  tool: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4 2.6-2.6z',
};

export function Icon({ name, size = 18, className = '' }) {
  return (
    <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={ICONS[name] || ICONS.circle} />
    </svg>
  );
}

export function A({ to, children, className = '', ...rest }) {
  return <a href={href(to)} className={className} {...rest}>{children}</a>;
}

const STATUS_ICON = { submitted: 'circle', source_checked: 'check', confirmed: 'checks', needs_review: 'alert' };

// Status is conveyed by icon + text + colour, never colour alone.
export function StatusBadge({ status, onClick, compact = false, title }) {
  const { t } = useApp();
  const label = t(`status.${status}`);
  const inner = (
    <>
      <Icon name={STATUS_ICON[status] || 'circle'} size={14} />
      {!compact && <span>{label}</span>}
    </>
  );
  const cls = `badge badge-${status}${compact ? ' badge-compact' : ''}`;
  if (onClick) {
    return (
      <button type="button" className={cls} onClick={onClick} title={title || label} aria-label={`${label}. ${t('evidence.open')}`}>
        {inner}
      </button>
    );
  }
  return <span className={cls} title={title || label} aria-label={compact ? label : undefined}>{inner}</span>;
}

export function NotAvailable({ children }) {
  const { t } = useApp();
  return <span className="na" title={t('na.hint')}>{children || t('na.label')}</span>;
}

export function Notice({ tone = 'info', icon = 'info', title, children }) {
  return (
    <div className={`notice notice-${tone}`} role={tone === 'warn' ? 'note' : undefined}>
      <Icon name={icon} size={18} />
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function Empty({ title, children, action }) {
  return (
    <div className="empty">
      <Icon name="search" size={28} />
      <h3>{title}</h3>
      {children && <div className="empty-body">{children}</div>}
      {action}
    </div>
  );
}

export function Section({ title, hint, action, children, id }) {
  return (
    <section className="section" id={id}>
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {hint && <p className="muted">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Tag({ children, tone }) {
  return <span className={`tag${tone ? ` tag-${tone}` : ''}`}>{children}</span>;
}

export function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span aria-hidden="true">/</span>}
          {it.to ? <A to={it.to}>{it.label}</A> : <span aria-current="page">{it.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}
