import React from 'react';

const Header = ({ theme, toggleTheme, onLogout, onMenuToggle }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="hamburger-btn" onClick={onMenuToggle} title="Menú">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className="logo">
          <img
            src={require('../assets/tutorgeist_logo.png')}
            alt="TutorGeist"
            style={{ height: '120px', objectFit: 'contain' }}
          />
        </div>
      </div>

      <div className="header-actions">
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
          Exportar <span>↑</span>
        </button>

        {onLogout && (
          <button className="logout-btn" onClick={onLogout} title="Cerrar sesión">
            <span className="logout-icon">⏻</span>
            <span className="logout-text">Salir</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;