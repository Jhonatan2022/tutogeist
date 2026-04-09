import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { TRANSLATIONS } from '../../utils/language';
import '../../styles/landing.css';

import LandingNav         from './LandingNav';
import HeroSection        from './HeroSection';
import AboutSection       from './AboutSection';
import BenefitsSection    from './BenefitsSection';
import InstructoresSection from './InstructoresSection';
import ProfileModal       from './ProfileModal';

const getAvatarUrl = (name, size = 200) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&size=${size}&background=4c4eb3&color=fff&bold=true&rounded=true`;

const LandingPage = ({ session, profile: profileProp, onGoToApp, onGoToLogin, onGoToDashboard }) => {
  const [lang, setLang]               = useState('es');
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile]         = useState(profileProp || null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (!session) { setProfile(null); return; }
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
      .then(async ({ data }) => {
        if (data) {
          if (!data.avatar_url) {
            const avatarUrl = getAvatarUrl(data.full_name || data.email);
            await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', session.user.id);
            setProfile({ ...data, avatar_url: avatarUrl });
          } else {
            setProfile(data);
          }
        }
      });
  }, [session]);

  const handleLogout = async () => { await supabase.auth.signOut(); };

  return (
    <>
      <LandingNav
        lang={lang} setLang={setLang} t={t}
        session={session} profile={profile}
        onGoToLogin={onGoToLogin} onGoToApp={onGoToApp}
        onShowProfile={() => setShowProfile(true)}
        onLogout={handleLogout}
        onGoToDashboard={onGoToDashboard}
      />

      <main>
        <HeroSection t={t} session={session} onGoToApp={onGoToApp} onGoToLogin={onGoToLogin} />
        <AboutSection t={t} />

        {/* Sección instructores — solo si hay sesión activa */}
        <InstructoresSection session={session} profile={profile} />

        <BenefitsSection t={t} session={session} onGoToLogin={onGoToLogin} onGoToApp={onGoToApp} />
      </main>

      <footer className="tg-footer">
        <div className="tg-container">
          <div className="tg-footer__inner">
            <div className="tg-nav__brand"><span>Tutor</span><span>Geist</span></div>
            <p className="tg-footer__copy">{t.footer.copy}</p>
          </div>
        </div>
      </footer>

      {showProfile && session && (
        <ProfileModal session={session} t={t} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
};

export default LandingPage;