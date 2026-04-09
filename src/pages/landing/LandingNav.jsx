import React, { useState, useEffect, useRef } from 'react';

const getAvatarUrl = (name, size = 80) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&size=${size}&background=4c4eb3&color=fff&bold=true&rounded=true`;

const LandingNav = ({
  lang, setLang, t, session, profile,
  onGoToLogin, onGoToApp, onShowProfile, onLogout, onGoToDashboard,
}) => {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [langOpen, setLangOpen]     = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const langFlags = { es: '🇪🇸 ES', en: '🇬🇧 EN', de: '🇩🇪 DE' };

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`tg-nav ${scrolled ? 'tg-nav--scrolled' : ''}`}>
      <div className="tg-nav__inner">

        {/* Logo */}
        <div className="tg-nav__logo" onClick={() => scrollTo('hero')}>
          <img src={require('../../assets/logo.png')} alt="TutorGeist" className="tg-nav__logo-img" />
        </div>

        {/* Desktop links */}
        <ul className="tg-nav__links">
          <li><button onClick={() => scrollTo('about')}>{t.nav.about}</button></li>
          <li><button onClick={() => scrollTo('benefits')}>{t.nav.pricing}</button></li>
          {session && (
            <li>
              <button className="tg-nav__ai-btn" onClick={onGoToApp}>
                {t.nav.goToAI}
              </button>
            </li>
          )}
        </ul>

        {/* Right actions */}
        <div className="tg-nav__actions">

          {/* Lang selector — oculto en móvil, aparece en el menú hamburguesa */}
          <div className="tg-lang tg-lang--desktop" ref={langRef}>
            <button className="tg-lang__btn" onClick={() => setLangOpen(v => !v)}>
              {langFlags[lang]} <span className="tg-lang__arrow">▾</span>
            </button>
            {langOpen && (
              <div className="tg-lang__dropdown">
                {Object.entries(langFlags).map(([code, label]) => (
                  <button
                    key={code}
                    className={`tg-lang__opt ${lang === code ? 'active' : ''}`}
                    onClick={() => { setLang(code); setLangOpen(false); }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth area */}
          {session ? (
            <div className="tg-user" ref={userRef}>
              <button className="tg-user__btn" onClick={() => setUserMenuOpen(v => !v)}>
                <img
                  src={profile?.avatar_url || getAvatarUrl(profile?.full_name || session.user.email)}
                  alt="avatar"
                  className="tg-user__avatar"
                />
                <span className="tg-user__name">
                  {profile?.full_name?.split(' ')[0] || 'Usuario'}
                </span>
                <span>▾</span>
              </button>
              {userMenuOpen && (
                <div className="tg-user__dropdown">
                  <button onClick={() => { onShowProfile(); setUserMenuOpen(false); }}>
                    👤 {t.nav.profile}
                  </button>
                  <button onClick={() => { onGoToApp(); setUserMenuOpen(false); }}>
                    🤖 {t.nav.goToAI}
                  </button>
                  {profile?.role === 'instructor' && (
                    <button onClick={() => { onGoToDashboard(); setUserMenuOpen(false); }}>
                      📊 Mi Dashboard
                    </button>
                  )}
                  <hr />
                  <button className="tg-user__logout" onClick={onLogout}>
                    ↩ {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="tg-nav__auth">
              <button className="tg-btn tg-btn--ghost" onClick={onGoToLogin}>
                {t.nav.login}
              </button>
              <button className="tg-btn tg-btn--primary" onClick={onGoToLogin}>
                {t.nav.register}
              </button>
            </div>
          )}

          {/* Hamburger */}
          <button
            className="tg-nav__hamburger"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="menu"
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="tg-nav__mobile">
          <button onClick={() => scrollTo('about')}>{t.nav.about}</button>
          <button onClick={() => scrollTo('benefits')}>{t.nav.pricing}</button>
          {session ? (
            <>
              <button onClick={() => { onGoToApp(); setMenuOpen(false); }}>{t.nav.goToAI}</button>
              <button onClick={() => { onShowProfile(); setMenuOpen(false); }}>{t.nav.profile}</button>
              <button onClick={onLogout}>{t.nav.logout}</button>
            </>
          ) : (
            <>
              <button onClick={() => { onGoToLogin(); setMenuOpen(false); }}>{t.nav.login}</button>
              <button
                className="mobile-cta"
                onClick={() => { onGoToLogin(); setMenuOpen(false); }}
              >
                {t.nav.register}
              </button>
            </>
          )}
          <div className="tg-nav__mobile-lang">
            {Object.entries(langFlags).map(([code, label]) => (
              <button
                key={code}
                className={lang === code ? 'active' : ''}
                onClick={() => { setLang(code); setMenuOpen(false); }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNav;