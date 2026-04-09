import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

const getAvatarUrl = (name, size = 200) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&size=${size}&background=4c4eb3&color=fff&bold=true&rounded=true`;

const ProfileModal = ({ session, t, onClose }) => {
  const [profile, setProfile]     = useState(null);
  const [fichas, setFichas]       = useState([]);
  const [editing, setEditing]     = useState(false);
  const [editName, setEditName]   = useState('');
  const [saving, setSaving]       = useState(false);
  const [saveMsg, setSaveMsg]     = useState('');

  useEffect(() => {
    if (!session) return;
    // Cargar perfil
    supabase.from('profiles').select('*').eq('id', session.user.id).single()
      .then(({ data }) => {
        if (data) { setProfile(data); setEditName(data.full_name || ''); }
      });
    // Cargar fichas aceptadas
    supabase.from('solicitudes')
      .select('estado, ficha:fichas(codigo, nombre)')
      .eq('estudiante_id', session.user.id)
      .then(({ data }) => { if (data) setFichas(data); });
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    const newAvatar = getAvatarUrl(editName || profile?.email);
    const { error } = await supabase.from('profiles')
      .update({ full_name: editName, avatar_url: newAvatar, updated_at: new Date().toISOString() })
      .eq('id', session.user.id);
    if (!error) {
      setProfile(p => ({ ...p, full_name: editName, avatar_url: newAvatar }));
      setSaveMsg(t.profile.success);
      setEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
    setSaving(false);
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const estadoColor = { accepted: '#2dabb9', pending: '#f59e0b', rejected: '#e53e3e' };
  const estadoLabel = { accepted: 'Aceptada', pending: 'Pendiente', rejected: 'Rechazada' };

  return (
    <div className="tg-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tg-modal">
        <button className="tg-modal__close" onClick={onClose}>✕</button>
        <h2 className="tg-modal__title">{t.profile.title}</h2>

        <div className="tg-profile">
          <div className="tg-profile__avatar-wrap">
            <img
              src={profile?.avatar_url || getAvatarUrl(profile?.full_name || session.user.email)}
              alt="avatar" className="tg-profile__avatar"
            />
            <div className="tg-profile__avatar-badge">🤖</div>
          </div>

          {saveMsg && <div className="tg-profile__success">{saveMsg}</div>}

          <div className="tg-profile__field">
            <label>{t.profile.name}</label>
            {editing
              ? <input className="tg-profile__input" value={editName}
                  onChange={e => setEditName(e.target.value)} autoFocus />
              : <div className="tg-profile__value">{profile?.full_name || '—'}</div>
            }
          </div>

          <div className="tg-profile__field">
            <label>{t.profile.email}</label>
            <div className="tg-profile__value tg-profile__value--muted">{session.user.email}</div>
          </div>

          <div className="tg-profile__field">
            <label>{t.profile.joined}</label>
            <div className="tg-profile__value tg-profile__value--muted">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
            </div>
          </div>

          {/* Fichas del estudiante */}
          {fichas.length > 0 && (
            <div className="tg-profile__field">
              <label>Mis Fichas</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {fichas.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 14px', background: '#f7f6ff', borderRadius: 10,
                  }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d2d4e' }}>
                      {s.ficha?.codigo} — {s.ficha?.nombre}
                    </span>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700, padding: '2px 10px',
                      borderRadius: 20, background: estadoColor[s.estado] + '18',
                      color: estadoColor[s.estado],
                    }}>
                      {estadoLabel[s.estado]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="tg-profile__actions">
            {editing ? (
              <>
                <button className="tg-btn tg-btn--primary" onClick={handleSave} disabled={saving}>
                  {saving ? t.profile.saving : t.profile.save}
                </button>
                <button className="tg-btn tg-btn--ghost"
                  onClick={() => { setEditing(false); setEditName(profile?.full_name || ''); }}>
                  {t.profile.cancel}
                </button>
              </>
            ) : (
              <button className="tg-btn tg-btn--primary" onClick={() => setEditing(true)}>
                ✏️ {t.profile.edit}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;  