// src/pages/landing/InstructoresSection.jsx
import React, { useState } from 'react';
import { useInstructores } from '../../hooks/useInstructores';
import ContactModal from './ContactModal';

const SkeletonCard = () => (
  <div className="tg-instructor-card tg-instructor-card--skeleton">
    <div className="tg-instructor-avatar-wrap">
      <div className="tg-skel tg-skel--circle" />
    </div>
    <div style={{ padding: '8px 20px 24px' }}>
      <div className="tg-skel tg-skel--line" style={{ width: '60%', marginBottom: 8 }} />
      <div className="tg-skel tg-skel--line" style={{ width: '80%', marginBottom: 4 }} />
      <div className="tg-skel tg-skel--line" style={{ width: '50%', marginBottom: 16 }} />
      <div className="tg-skel tg-skel--line" style={{ width: '40%' }} />
    </div>
  </div>
);

const InstructorCard = ({ instructor, session, profile, onContact }) => {
  const { tieneAceptacion, fichasDisponibles, fichas } = instructor;

  // Agrupar fichas por estado para mostrarlas
  const fichasAceptadas  = fichas.filter(f => f.estado === 'accepted');
  const fichasPendientes = fichas.filter(f => f.estado === 'pending');
  const fichasNuevas     = fichas.filter(f => !f.estado);

  return (
    <div className={`tg-instructor-card ${tieneAceptacion ? 'tg-instructor-card--accepted' : ''}`}>
      {/* Badge aceptado */}
      {tieneAceptacion && (
        <div className="tg-instructor-accepted-badge">✓ Te ha aceptado</div>
      )}

      <div className="tg-instructor-avatar-wrap">
        <img
          src={instructor.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.full_name)}&size=100&background=4c4eb3&color=fff&bold=true&rounded=true`}
          alt={instructor.full_name}
          className="tg-instructor-avatar"
        />
      </div>

      <div className="tg-instructor-body">
        <h3 className="tg-instructor-name">{instructor.full_name}</h3>

        <div className="tg-instructor-specs">
          {instructor.especialidades?.map((esp, i) => <span key={i}>{esp}</span>)}
        </div>

        <div className="tg-instructor-email">
          ✉️ {instructor.email_visible || 'correo@tutorgeist.edu.co'}
        </div>

        {/* Fichas con estado visual */}
        <div className="tg-instructor-fichas">
          <span className="tg-instructor-fichas__label">Fichas:</span>
          <ul>
            {fichasAceptadas.map(f => (
              <li key={f.id} style={{ color: '#2dabb9', fontWeight: 700 }}>
                ✓ {f.codigo} <span style={{ fontWeight: 400, color: '#374151' }}>— {f.nombre}</span>
              </li>
            ))}
            {fichasPendientes.map(f => (
              <li key={f.id} style={{ color: '#f59e0b', fontWeight: 600 }}>
                ⏳ {f.codigo} <span style={{ fontWeight: 400, color: '#374151' }}>— {f.nombre}</span>
              </li>
            ))}
            {fichasNuevas.map(f => (
              <li key={f.id} style={{ color: '#6b7280' }}>
                • {f.codigo} <span>— {f.nombre}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Botón contactar */}
        {session ? (
          fichasDisponibles.length > 0 ? (
            <button
              className="tg-instructor-btn"
              onClick={() => onContact(instructor)}
            >
              {tieneAceptacion ? 'Solicitar otra ficha' : 'Contactar instructor'}
            </button>
          ) : (
            <button className="tg-instructor-btn tg-instructor-btn--disabled" disabled>
              {fichasPendientes.length > 0 ? '⏳ Solicitud pendiente' : '✓ Todas las fichas solicitadas'}
            </button>
          )
        ) : (
          <button className="tg-instructor-btn tg-instructor-btn--ghost" disabled>
            Inicia sesión para contactar
          </button>
        )}
      </div>
    </div>
  );
};

const InstructoresSection = ({ session, profile }) => {
  const { instructores, fichasAceptadas, loading, refetch } = useInstructores(session);
  const [contactInstructor, setContactInstructor] = useState(null);

  if (!session) return null;

  return (
    <>
      <section id="instructores" className="tg-instructores">
        <div className="tg-instructores__header">
          <h2 className="tg-instructores__title">
            ¡Solicita ayuda del mejor <span>Tutor!</span>
          </h2>
        </div>

        <div className="tg-instructores__body">
          <p className="tg-instructores__subtitle">
            Encuentra tu instructor, elige la ficha y envía tu solicitud.
            Los instructores que ya te aceptaron aparecen resaltados.
          </p>

          {/* Fichas activas del estudiante */}
          {fichasAceptadas.length > 0 && (
            <div className="tg-instructores__fichas-badge">
              <span>Tus fichas activas:</span>
              {fichasAceptadas.map(f => (
                <span key={f.id} className="tg-ficha-chip">
                  ✓ {f.codigo} — {f.nombre}
                </span>
              ))}
            </div>
          )}

          <div className="tg-instructores__grid">
            {loading ? (
              [1,2,3,4].map(i => <SkeletonCard key={i} />)
            ) : instructores.length === 0 ? (
              <div className="tg-instructores__empty">
                <p>No hay instructores disponibles aún.</p>
              </div>
            ) : (
              instructores.map(inst => (
                <InstructorCard
                  key={inst.id}
                  instructor={inst}
                  session={session}
                  profile={profile}
                  onContact={setContactInstructor}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal de contacto */}
      {contactInstructor && (
        <ContactModal
          instructor={contactInstructor}
          session={session}
          profile={profile}
          onClose={() => setContactInstructor(null)}
          onSent={() => { setContactInstructor(null); refetch(); }}
        />
      )}
    </>
  );
};

export default InstructoresSection;