import React from 'react';

const Header = ({ theme, toggleTheme, onLogout, onBackToLanding, isInstructor, onGoToDashboard, onExport }) => {
  return (
    <header className="header">
      <div className="logo" style={{ cursor: 'pointer' }} onClick={onBackToLanding}>
        <img
          src={require('../assets/logo.png')}
          alt="TutorGeist"
          style={{ height: '120px', objectFit: 'contain' }}
        />
      </div>

      <div className="header-actions">
        {isInstructor && (
          <button
            onClick={onGoToDashboard}
            style={{
              background: 'linear-gradient(135deg, #4c4eb3, #2dabb9)',
              color: 'white', border: 'none', borderRadius: 10,
              padding: '8px 16px', fontFamily: 'var(--font-heading)',
              fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            📊 Mi Dashboard
          </button>
        )}

        <button
          onClick={onBackToLanding}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
            fontSize: '0.875rem', fontWeight: 600, padding: '6px 12px', borderRadius: 8,
          }}
        >
          ← Inicio
        </button>

        <span className="header-config">Configuración</span>

        <div className="theme-toggle">
          <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => toggleTheme('light')} title="Modo claro">☀️</button>
          <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => toggleTheme('dark')} title="Modo oscuro">🌙</button>
        </div>

        {/* Exportar — llama a la función del App */}
        <button className="export-btn" onClick={onExport}>
          Exportar <span>↑</span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              background: 'none', border: '1.5px solid rgba(229,62,62,0.3)',
              cursor: 'pointer', color: '#e53e3e', fontFamily: 'var(--font-body)',
              fontSize: '0.8rem', fontWeight: 700, padding: '6px 14px', borderRadius: 8,
            }}
          >
            Salir
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;