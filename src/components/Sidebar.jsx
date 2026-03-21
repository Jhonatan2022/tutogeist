import React, { useState } from 'react';

const navItems = ['Ai Chat', 'Generador de imagen', 'Generador de código', 'Historial', 'Biblioteca'];
const materias = ['Creación de empresas', 'Virtual English', 'Matemáticas', 'Historia Universal'];

const Sidebar = ({ onNewChat, activeItem, setActiveItem }) => {
  return (
    <aside className="sidebar">
      <button className="new-chat-btn" onClick={onNewChat}>
        <span>+</span>
        Nuevo Chat
      </button>

      <div className="sidebar-section">
        {navItems.map((item) => (
          <button
            key={item}
            className={`sidebar-item ${activeItem === item ? 'active' : ''}`}
            onClick={() => setActiveItem(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">Mis materias</div>
        {materias.map((materia) => (
          <button
            key={materia}
            className={`sidebar-item ${activeItem === materia ? 'active' : ''}`}
            onClick={() => setActiveItem(materia)}
          >
            {materia}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
