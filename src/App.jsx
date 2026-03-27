import { useState, useEffect } from 'react';
import './styles/global.css';
import './styles/App.css';
import Header   from './components/Header';
import Sidebar  from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Login    from './pages/Login';
import LandingPage from './pages/landing/LandingPage';
import { supabase } from './supabase';

function App() {
  const [theme, setTheme]           = useState('light');
  const [activeItem, setActiveItem] = useState('Ai Chat');
  const [session, setSession]       = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [view, setView]             = useState('landing');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) setView('landing');
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setView('landing');
  };

  if (loadingAuth) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a1a3e 0%, #0f3460 40%, #377e80 100%)',
      }}>
        <p style={{ color: 'white', fontFamily: 'Poppins, sans-serif', fontSize: '1.1rem' }}>
          Cargando TutorGeist...
        </p>
      </div>
    );
  }

  if (view === 'landing') {
    return (
      <LandingPage
        session={session}
        onGoToApp={() => setView('app')}
        onGoToLogin={() => setView('login')}
      />
    );
  }

  if (view === 'login') {
    return (
      <Login
        onLogin={() => setView('landing')}
        onBackToLanding={() => setView('landing')}
      />
    );
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header
          theme={theme}
          toggleTheme={(t) => setTheme(t)}
          onLogout={handleLogout}
          onBackToLanding={() => setView('landing')}
        />
        <div className="main-content">
          <Sidebar
            onNewChat={() => setActiveItem('Ai Chat')}
            activeItem={activeItem}
            setActiveItem={setActiveItem}
          />
          <ChatArea key={activeItem} />
        </div>
      </div>
    </div>
  );
}

export default App;