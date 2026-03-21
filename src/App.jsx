import React, { useState, useEffect } from 'react';
import './styles/global.css';
import './styles/App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Login from './pages/Login';
import { supabase } from './supabase';

function App() {
  const [theme, setTheme] = useState('light');
  const [activeItem, setActiveItem] = useState('Ai Chat');
  const [session, setSession] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    // Verificar sesión activa al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = (newTheme) => setTheme(newTheme);

  const handleNewChat = () => setActiveItem('Ai Chat');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  if (loadingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)' }}>
        <p style={{ color: 'white', fontFamily: 'var(--font-body)' }}>Cargando...</p>
      </div>
    );
  }

  if (!session) {
    return <Login onLogin={() => {}} />;
  }

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <Header theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
        <div className="main-content">
          <Sidebar
            onNewChat={handleNewChat}
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