import React from 'react';

const Header = ({ theme, toggleTheme, onLogout, onBackToLanding }) => {
  return (
    <header className="header">
      <div className="logo" style={{ cursor: onBackToLanding ? 'pointer' : 'default' }} onClick={onBackToLanding}>
        <img
          src={require('../assets/logo.png')}
          alt="TutorGeist"
          style={{ height: '120px', objectFit: 'contain' }}
        />
      </div>

      <div className="header-actions">
        {onBackToLanding && (
          <button
            onClick={onBackToLanding}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
              fontSize: '0.875rem', fontWeight: 600, padding: '6px 12px',
              borderRadius: '8px', transition: 'all 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.color = 'var(--teal-primary)'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            ← Inicio
          </button>
        )}

        <span className="header-config">Configuración</span>

        <div className="theme-toggle">
          <button
            className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
            onClick={() => toggleTheme('light')}
            title="Modo claro"
          >
            ☀️
          </button>
          <button
            className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => toggleTheme('dark')}
            title="Modo oscuro"
          >
            🌙
          </button>
        </div>

        <button className="export-btn">
          Exportar
          <span>↑</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'none', border: '1.5px solid rgba(229,62,62,0.3)',
              cursor: 'pointer', color: '#e53e3e', fontFamily: 'var(--font-body)',
              fontSize: '0.8rem', fontWeight: 700, padding: '6px 14px',
              borderRadius: '8px', transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(229,62,62,0.08)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'none'; }}
          >
            Salir
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;