import React from 'react';
import { useApp } from '../lib/store.jsx';
import { STATUS_KEYS } from '../lib/format.js';
import { Notice, Section, StatusBadge } from '../components/ui.jsx';

export default function About() {
  const { t } = useApp();
  return (
    <div className="container page prose">
      <h1 className="page-title">{t('about.title')}</h1>
      <p className="lead small-lead">{t('about.intro')}</p>

      <Section title={t('about.statusTitle')} id="evidence" hint={t('about.statusHint')}>
        <div className="grid grid-2">
          {STATUS_KEYS.map((s) => (
            <div className="card legend" key={s}>
              <StatusBadge status={s} />
              <p>{t(`statusHelp.${s}`)}</p>
            </div>
          ))}
        </div>
        <Notice tone="info" icon="info">{t('about.statusScope')}</Notice>
      </Section>

      <Section title={t('about.methodTitle')}>
        <ul className="plain bullets">
          <li>{t('about.method1')}</li>
          <li>{t('about.method2')}</li>
          <li>{t('about.method3')}</li>
          <li>{t('about.method4')}</li>
        </ul>
      </Section>

      <Section title={t('about.limitsTitle')}>
        <Notice tone="warn" icon="alert">{t('about.limits')}</Notice>
        <ul className="plain bullets mt">
          <li>{t('about.limit1')}</li>
          <li>{t('about.limit2')}</li>
          <li>{t('about.limit3')}</li>
          <li>{t('about.limit4')}</li>
        </ul>
      </Section>

      <Section title={t('about.modelTitle')}>
        <p>{t('about.model')}</p>
      </Section>

      <Section title={t('about.nextTitle')}>
        <ol className="bullets">
          <li>{t('about.next1')}</li>
          <li>{t('about.next2')}</li>
          <li>{t('about.next3')}</li>
          <li>{t('about.next4')}</li>
        </ol>
      </Section>
    </div>
  );
}
