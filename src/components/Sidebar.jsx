import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const navItems = ['Ai Chat', 'Generador de imagen', 'Generador de código', 'Historial', 'Biblioteca'];

const Sidebar = ({ session, onNewChat, activeItem, setActiveItem }) => {
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    if (!session) return;
    supabase
      .from('solicitudes')
      .select('estado, fichas:ficha_id ( id, codigo, nombre )')
      .eq('estudiante_id', session.user.id)
      .in('estado', ['accepted', 'rejected'])
      .then(({ data }) => {
        if (data) setSolicitudes(data.filter(s => s.fichas));
      });
  }, [session]);

  const accepted = solicitudes.filter(s => s.estado === 'accepted');
  const rejected  = solicitudes.filter(s => s.estado === 'rejected');

  return (
    <>
      <style>{`
        .sidebar-item--ficha {
          display: flex !important;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px !important;
          line-height: 1.3;
          cursor: pointer;
        }
        .sidebar-item--rejected {
          cursor: default !important;
          opacity: 0.85;
          text-decoration: underline;
          text-decoration-color: #e53e3e;
          text-underline-offset: 3px;
        }
        .sidebar-item--rejected:hover {
          background: rgba(229,62,62,0.06) !important;
          color: #e53e3e !important;
        }
        .sidebar-ficha-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0; margin-top: 5px;
        }
        .sidebar-ficha-dot--green { background: #10b981; box-shadow: 0 0 0 2px rgba(16,185,129,0.2); }
        .sidebar-ficha-dot--red   { background: #e53e3e; box-shadow: 0 0 0 2px rgba(229,62,62,0.2); }
        .sidebar-ficha-text { font-size: 0.82rem; color: inherit; }
        .sidebar-ficha-nombre { font-weight: 600; font-size: 0.88rem; }
        .sidebar-item--ficha.active .sidebar-ficha-dot--green {
          box-shadow: 0 0 0 3px rgba(16,185,129,0.35);
        }
      `}</style>

      <aside className="sidebar">
        <button className="new-chat-btn" onClick={onNewChat}>
          <span>+</span> Nuevo Chat
        </button>

        <div className="sidebar-section">
          {navItems.map(item => (
            <button
              key={item}
              className={`sidebar-item ${activeItem === item ? 'active' : ''}`}
              onClick={() => setActiveItem(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ── Fichas aceptadas ── */}
        {accepted.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-heading">Mis materias</div>
            {accepted.map(s => (
              <button
                key={s.fichas.id}
                className={`sidebar-item sidebar-item--ficha ${activeItem === s.fichas.nombre ? 'active' : ''}`}
                onClick={() => setActiveItem(s.fichas.nombre)}
                title={`Ficha ${s.fichas.codigo} — Activa ✓`}
              >
                <span className="sidebar-ficha-dot sidebar-ficha-dot--green" />
                <span className="sidebar-ficha-text">
                  Ficha {s.fichas.codigo}
                  <br />
                  <span className="sidebar-ficha-nombre">{s.fichas.nombre}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── Fichas rechazadas ── */}
        {rejected.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-heading" style={{ color: '#e53e3e' }}>
              Rechazadas
            </div>
            {rejected.map(s => (
              <div
                key={s.fichas.id}
                className="sidebar-item sidebar-item--ficha sidebar-item--rejected"
                title={`Ficha ${s.fichas.codigo} — Solicitud rechazada`}
              >
                <span className="sidebar-ficha-dot sidebar-ficha-dot--red" />
                <span className="sidebar-ficha-text">
                  Ficha {s.fichas.codigo}
                  <br />
                  <span className="sidebar-ficha-nombre">{s.fichas.nombre}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;