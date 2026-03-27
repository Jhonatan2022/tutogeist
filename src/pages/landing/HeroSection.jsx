import React from 'react';

const HeroSection = ({ t, session, onGoToApp, onGoToLogin }) => (
  <section id="hero" className="tg-hero">
    <div className="tg-hero__bg">
      <div className="tg-hero__orb tg-hero__orb--1" />
      <div className="tg-hero__orb tg-hero__orb--2" />
      <div className="tg-hero__orb tg-hero__orb--3" />
      <svg className="tg-hero__net" viewBox="0 0 800 600" fill="none">
        <circle cx="400" cy="300" r="240" stroke="#2dabb9" strokeWidth="0.8" fill="none" opacity="0.15"/>
        <circle cx="400" cy="300" r="160" stroke="#4c4eb3" strokeWidth="0.8" fill="none" opacity="0.15"/>
        <line x1="160" y1="120" x2="640" y2="480" stroke="#87c7d1" strokeWidth="0.8" opacity="0.1"/>
        <line x1="640" y1="120" x2="160" y2="480" stroke="#2dabb9"  strokeWidth="0.8" opacity="0.1"/>
        <circle cx="160" cy="120" r="6" fill="#2dabb9" opacity="0.35"/>
        <circle cx="640" cy="120" r="8" fill="#4c4eb3" opacity="0.35"/>
        <circle cx="640" cy="480" r="6" fill="#87c7d1" opacity="0.35"/>
        <circle cx="160" cy="480" r="7" fill="#2dabb9" opacity="0.35"/>
        <circle cx="400" cy="60"  r="5" fill="#4c4eb3" opacity="0.35"/>
        <circle cx="400" cy="540" r="5" fill="#87c7d1" opacity="0.35"/>
      </svg>
    </div>

    <div className="tg-hero__content">
      <div className="tg-hero__badge">{t.hero.badge}</div>

      <h1 className="tg-hero__title">
        {t.hero.title1}<br />
        <span className="tg-hero__accent">{t.hero.title2}</span>
      </h1>

      <p className="tg-hero__subtitle">{t.hero.subtitle}</p>

      <div className="tg-hero__ctas">
        {session ? (
          <button className="tg-btn tg-btn--hero" onClick={onGoToApp}>
            {t.hero.ctaLogin}
          </button>
        ) : (
          <button className="tg-btn tg-btn--hero" onClick={onGoToLogin}>
            {t.hero.cta}
          </button>
        )}
        <button
          className="tg-btn tg-btn--outline"
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          {t.hero.scroll} ↓
        </button>
      </div>

      {/* Tarjeta "Probar IA" — solo cuando hay sesión */}
      {session && (
        <div className="tg-hero__try-card" onClick={onGoToApp}>
          <div className="tg-hero__try-icon">🤖</div>
          <div>
            <div className="tg-hero__try-title">{t.hero.ctaLogin}</div>
            <div className="tg-hero__try-sub">{t.hero.subtitle.slice(0, 55)}…</div>
          </div>
          <span className="tg-hero__try-arrow">→</span>
        </div>
      )}
    </div>
  </section>
);

export default HeroSection;