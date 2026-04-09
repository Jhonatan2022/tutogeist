// src/pages/landing/ContactModal.jsx
import React, { useState } from 'react';
import { supabase } from '../../supabase';

const ContactModal = ({ instructor, session, profile, onClose, onSent }) => {
  const [fichaSeleccionada, setFichaSeleccionada] = useState('');
  const [mensaje, setMensaje]   = useState('');
  const [sending, setSending]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  // Fichas disponibles = las que aún no tienen solicitud
  const fichasDisponibles = instructor.fichasDisponibles || [];

  const fichaObj = fichasDisponibles.find(f => f.id === fichaSeleccionada);

  const handleSend = async () => {
    if (!fichaSeleccionada) { setError('Selecciona una ficha.'); return; }
    if (!mensaje.trim())    { setError('Escribe un mensaje.'); return; }
    setSending(true); setError('');

    try {
      const studentName = profile?.full_name || session.user.email;

      const { error: fnError } = await supabase.functions.invoke(
        'send-contact-email',
        {
          body: {
            studentName,
            fichaCodigo:    fichaObj?.codigo,
            fichaNombre:    fichaObj?.nombre,
            instructorName: instructor.full_name,
            mensaje,
            studentEmail:   session.user.email,
            studentId:      session.user.id,
            fichaId:        fichaSeleccionada,
          },
        }
      );

      if (fnError) throw new Error(fnError.message);

      setSent(true);
      onSent?.(); // refrescar lista de instructores
    } catch (err) {
      setError(err.message || 'No se pudo enviar. Intenta de nuevo.');
    } finally {
      setSending(false);
    }
  };

  React.useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="tg-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="tg-modal tg-contact-modal">
        <button className="tg-modal__close" onClick={onClose}>✕</button>

        {sent ? (
          <div className="tg-contact-sent">
            <div className="tg-contact-sent__icon">✅</div>
            <h3>¡Solicitud enviada!</h3>
            <p>Tu mensaje al instructor <strong>{instructor.full_name}</strong> fue enviado.</p>
            <p className="tg-contact-sent__sub">Recibirás respuesta cuando el instructor acepte tu solicitud.</p>
            <button className="tg-btn tg-btn--primary" onClick={onClose}>Cerrar</button>
          </div>
        ) : (
          <>
            {/* Header instructor */}
            <div className="tg-contact-header">
              <img
                src={instructor.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.full_name)}&size=80&background=4c4eb3&color=fff&bold=true&rounded=true`}
                alt={instructor.full_name}
                className="tg-contact-avatar"
              />
              <div>
                <h2 className="tg-modal__title" style={{ marginBottom: 4 }}>Contactar instructor</h2>
                <p className="tg-contact-instructor-name">{instructor.full_name}</p>
                <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
                  {instructor.especialidades?.join(' · ')}
                </p>
              </div>
            </div>

            {/* Asunto automático */}
            {fichaObj && (
              <div className="tg-contact-info">
                <span className="tg-contact-info__label">Asunto (automático):</span>
                <span className="tg-contact-info__value">
                  Estudiante {profile?.full_name || session.user.email} — Ficha {fichaObj.codigo}
                </span>
              </div>
            )}

            {/* Selector de ficha */}
            <div className="tg-profile__field">
              <label>Ficha a la que quieres aplicar *</label>
              {fichasDisponibles.length === 0 ? (
                <div style={{
                  padding: '12px 16px', background: '#f7f6ff', borderRadius: 10,
                  fontSize: '0.875rem', color: '#6b7280',
                }}>
                  Ya tienes solicitudes activas en todas las fichas de este instructor.
                </div>
              ) : (
                <select
                  value={fichaSeleccionada}
                  onChange={e => setFichaSeleccionada(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 16px',
                    background: '#f0eef8', border: '1.5px solid rgba(76,78,179,0.2)',
                    borderRadius: 10, fontFamily: "'Nunito', sans-serif",
                    fontSize: '0.9rem', color: '#2d2d4e', outline: 'none',
                    cursor: 'pointer', appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234c4eb3' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: 36,
                  }}
                >
                  <option value="">— Selecciona una ficha —</option>
                  {fichasDisponibles.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.codigo} — {f.nombre}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Mensaje */}
            <div className="tg-profile__field">
              <label>Razón del mensaje *</label>
              <textarea
                className="tg-contact-textarea"
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder="Escribe el motivo por el que quieres contactar a este instructor..."
                rows={4}
                autoFocus
              />
            </div>

            {error && <div className="tg-contact-error">{error}</div>}

            <div className="tg-profile__actions">
              <button
                className="tg-btn tg-btn--primary"
                onClick={handleSend}
                disabled={sending || !mensaje.trim() || !fichaSeleccionada || fichasDisponibles.length === 0}
              >
                {sending ? 'Enviando...' : '📨 Enviar mensaje'}
              </button>
              <button className="tg-btn tg-btn--ghost" onClick={onClose}>Cancelar</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ContactModal;