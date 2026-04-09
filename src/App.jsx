import React, { useState, useEffect, useRef } from 'react';
import './styles/global.css';
import './styles/App.css';
import Header              from './components/Header';
import Sidebar             from './components/Sidebar';
import ChatArea            from './components/ChatArea';
import Login               from './pages/Login';
import LandingPage         from './pages/landing/LandingPage';
import InstructorDashboard from './pages/InstructorDashboard';
import { supabase }        from './supabase';

function App() {
  const [theme, setTheme]             = useState('light');
  const [activeItem, setActiveItem]   = useState('Ai Chat');
  const [session, setSession]         = useState(null);
  const [profile, setProfile]         = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [view, setView]               = useState('landing');

  // Ref para llamar handleExport del ChatArea
  const chatExportRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) { fetchProfile(session.user.id); setView('landing'); }
      else { setProfile(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null); setProfile(null); setView('landing');
  };

  // Exportar: llama al método del ChatArea via ref
  const handleExport = () => {
    if (chatExportRef.current) chatExportRef.current();
  };

  if (loadingAuth) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a3e 0%, #0f3460 40%, #377e80 100%)',
    }}>
      <p style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem' }}>
        Cargando TutorGeist...
      </p>
    </div>
  );

  if (view === 'landing') return (
    <LandingPage
      session={session} profile={profile}
      onGoToApp={() => setView('app')}
      onGoToLogin={() => setView('login')}
      onGoToDashboard={() => setView('dashboard')}
    />
  );

  if (view === 'login') return (
    <Login onLogin={() => setView('landing')} onBackToLanding={() => setView('landing')} />
  );

  if (view === 'dashboard') return (
    <InstructorDashboard session={session} profile={profile} onBack={() => setView('landing')} />
  );

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header
          theme={theme}
          toggleTheme={(t) => setTheme(t)}
          onLogout={handleLogout}
          onBackToLanding={() => setView('landing')}
          isInstructor={profile?.role === 'instructor'}
          onGoToDashboard={() => setView('dashboard')}
          onExport={handleExport}
        />
        <div className="main-content">
          <Sidebar
            session={session}
            onNewChat={() => setActiveItem('Ai Chat')}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
          <ChatArea
            key={activeItem}
            session={session}
            activeItem={activeItem}
            exportRef={chatExportRef}
          />
        </div>
      </div>
    </div>
  );
}

export default App;