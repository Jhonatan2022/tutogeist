import React from 'react';

const BenefitsSection = ({ t, session, onGoToLogin, onGoToApp }) => (
  <>
    {/* ── PLANES ── */}
    <section id="benefits" className="tg-benefits">
      <div className="tg-container">
        <div className="tg-section-badge">{t.benefits.badge}</div>
        <h2 className="tg-section-title">{t.benefits.title}</h2>
        <p className="tg-section-sub">{t.benefits.subtitle}</p>

        <div className="tg-plans">

          {/* Card Esencial */}
          <div className="tg-plan">
            <div className="tg-plan__header">
              <h3 className="tg-plan__name">{t.benefits.card1.name}</h3>
              <div className="tg-plan__price">
                <span className="tg-plan__amount">—</span>
              </div>
              <p className="tg-plan__desc">{t.benefits.card1.desc}</p>
            </div>
            <ul className="tg-plan__features">
              {t.benefits.card1.features.map((f, i) => (
                <li key={i}>
                  <span className="tg-plan__check">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              className="tg-btn tg-btn--plan"
              onClick={session ? onGoToApp : onGoToLogin}
            >
              {t.benefits.card1.cta}
            </button>
          </div>

          {/* Card Pro — Destacada */}
          <div className="tg-plan tg-plan--featured">
            <div className="tg-plan__badge">{t.benefits.card2.badge}</div>
            <div className="tg-plan__header">
              <h3 className="tg-plan__name">{t.benefits.card2.name}</h3>
              <div className="tg-plan__price">
                <span className="tg-plan__amount">—</span>
              </div>
              <p className="tg-plan__desc">{t.benefits.card2.desc}</p>
            </div>
            <ul className="tg-plan__features">
              {t.benefits.card2.features.map((f, i) => (
                <li key={i}>
                  <span className="tg-plan__check">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              className="tg-btn tg-btn--plan-featured"
              onClick={session ? onGoToApp : onGoToLogin}
            >
              {t.benefits.card2.cta}
            </button>
          </div>

        </div>
      </div>
    </section>

    {/* ── CTA "Probar IA" (solo logueados) ── */}
    {session && (
      <section className="tg-try-cta">
        <div className="tg-container">
          <div className="tg-try-cta__inner">
            <h2>{t.tryCta.title}</h2>
            <p>{t.tryCta.subtitle}</p>
            <button className="tg-btn tg-btn--hero" onClick={onGoToApp}>
              {t.tryCta.btn}
            </button>
          </div>
        </div>
      </section>
    )}
  </>
);

export default BenefitsSection;