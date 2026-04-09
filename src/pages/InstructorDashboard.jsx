// src/pages/InstructorDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';

// ── Helpers ──────────────────────────────────────────────────
const ESTADO_CFG = {
  pending:  { label: 'Pendiente', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  accepted: { label: 'Aceptado',  color: '#2dabb9', bg: 'rgba(45,171,185,0.1)'  },
  rejected: { label: 'Rechazado', color: '#e53e3e', bg: 'rgba(229,62,62,0.1)'   },
};

// ── Subcomponente: tarjeta de solicitud ──────────────────────
const SolicitudCard = ({ sol, onAccept, onReject, loading }) => {
  const cfg = ESTADO_CFG[sol.estado];
  return (
    <div style={styles.solCard}>
      <div style={styles.solCardLeft}>
        <img
          src={sol.profiles?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(sol.profiles?.full_name || 'U')}&size=80&background=4c4eb3&color=fff&bold=true&rounded=true`}
          alt={sol.profiles?.full_name}
          style={styles.solAvatar}
        />
        <div>
          <div style={styles.solName}>{sol.profiles?.full_name || sol.profiles?.email}</div>
          <div style={styles.solEmail}>{sol.profiles?.email}</div>
          <div style={styles.solFicha}>
            Ficha <strong>{sol.fichas?.codigo}</strong> — {sol.fichas?.nombre}
          </div>
          {sol.mensaje && (
            <div style={styles.solMensaje}>💬 "{sol.mensaje}"</div>
          )}
          <div style={styles.solFecha}>
            {new Date(sol.created_at).toLocaleDateString('es-CO', {
              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>
      </div>
      <div style={styles.solCardRight}>
        <span style={{ ...styles.estadoBadge, color: cfg.color, background: cfg.bg }}>
          {cfg.label}
        </span>
        {sol.estado === 'pending' && (
          <div style={styles.solActions}>
            <button
              style={styles.btnAceptar}
              onClick={() => onAccept(sol.id)}
              disabled={loading}
            >
              ✓ Aceptar
            </button>
            <button
              style={styles.btnRechazar}
              onClick={() => onReject(sol.id)}
              disabled={loading}
            >
              ✕ Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Subcomponente: configuración de prompt por ficha ─────────
const PromptEditor = ({ fichaRel, onSave }) => {
  const [prompt, setPrompt]   = useState(fichaRel.ai_prompt || '');
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(fichaRel.ficha_id, prompt);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={styles.promptCard}>
      <div style={styles.promptHeader} onClick={() => setExpanded(v => !v)}>
        <div>
          <div style={styles.promptFichaCodigo}>Ficha {fichaRel.fichas?.codigo}</div>
          <div style={styles.promptFichaNombre}>{fichaRel.fichas?.nombre}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {fichaRel.ai_prompt
            ? <span style={styles.promptConfigured}>✓ Configurado</span>
            : <span style={styles.promptPending}>Sin configurar</span>
          }
          <span style={{ color: '#9ca3af', fontSize: '1.1rem' }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={styles.promptBody}>
          <label style={styles.promptLabel}>
            System prompt — instrucciones para la IA de esta ficha
          </label>
          <textarea
            style={styles.promptTextarea}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={`Ej: Eres un tutor de ${fichaRel.fichas?.nombre}. Responde siempre en español, de forma clara y con ejemplos prácticos. No respondas preguntas fuera del tema de la materia.`}
            rows={5}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12, alignItems: 'center' }}>
            <button
              style={saving ? styles.btnSavingPrompt : styles.btnSavePrompt}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Guardando...' : '💾 Guardar prompt'}
            </button>
            {saved && <span style={styles.savedMsg}>✓ Guardado</span>}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Componente principal ─────────────────────────────────────
const InstructorDashboard = ({ session, profile, onBack }) => {
  const [tab, setTab]               = useState('solicitudes'); // 'solicitudes' | 'prompts'
  const [solicitudes, setSolicitudes] = useState([]);
  const [fichasRel, setFichasRel]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter]         = useState('pending');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Solicitudes de mis fichas
      const { data: sols } = await supabase
        .from('solicitudes')
        .select(`
          id, estado, mensaje, created_at,
          profiles:estudiante_id ( id, full_name, email, avatar_url ),
          fichas:ficha_id ( id, codigo, nombre )
        `)
        .in('ficha_id',
          (await supabase
            .from('instructor_fichas')
            .select('ficha_id')
            .eq('instructor_id', session.user.id)
          ).data?.map(r => r.ficha_id) || []
        )
        .order('created_at', { ascending: false });

      setSolicitudes(sols || []);

      // Mis fichas con su prompt
      const { data: fichas } = await supabase
        .from('instructor_fichas')
        .select(`
          ficha_id, ai_prompt, ai_prompt_updated_at,
          fichas:ficha_id ( codigo, nombre )
        `)
        .eq('instructor_id', session.user.id);

      setFichasRel(fichas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleEstado = async (solId, nuevoEstado) => {
    setActionLoading(true);
    await supabase
      .from('solicitudes')
      .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
      .eq('id', solId);
    await fetchData();
    setActionLoading(false);
  };

  const handleSavePrompt = async (fichaId, prompt) => {
    await supabase
      .from('instructor_fichas')
      .update({ ai_prompt: prompt, ai_prompt_updated_at: new Date().toISOString() })
      .eq('instructor_id', session.user.id)
      .eq('ficha_id', fichaId);
    await fetchData();
  };

  const solicitudesFiltradas = solicitudes.filter(s =>
    filter === 'all' ? true : s.estado === filter
  );

  const pendingCount = solicitudes.filter(s => s.estado === 'pending').length;

  return (
    <div style={styles.wrapper}>
      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={onBack}>← Volver</button>
          <div>
            <h1 style={styles.headerTitle}>Dashboard Instructor</h1>
            <p style={styles.headerSub}>
              Hola, {profile?.full_name?.split(' ')[0] || 'Instructor'} 👋
            </p>
          </div>
        </div>
        <img
          src={profile?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || 'I')}&size=80&background=4c4eb3&color=fff&bold=true&rounded=true`}
          alt="avatar"
          style={styles.headerAvatar}
        />
      </div>

      {/* ── Stats ── */}
      <div style={styles.statsRow}>
        {[
          { label: 'Pendientes', value: solicitudes.filter(s=>s.estado==='pending').length,  color: '#f59e0b' },
          { label: 'Aceptados',  value: solicitudes.filter(s=>s.estado==='accepted').length, color: '#2dabb9' },
          { label: 'Rechazados', value: solicitudes.filter(s=>s.estado==='rejected').length, color: '#e53e3e' },
          { label: 'Mis fichas', value: fichasRel.length,                                    color: '#4c4eb3' },
        ].map((stat, i) => (
          <div key={i} style={styles.statCard}>
            <div style={{ ...styles.statNum, color: stat.color }}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={styles.tabs}>
        <button
          style={tab === 'solicitudes' ? styles.tabActive : styles.tab}
          onClick={() => setTab('solicitudes')}
        >
          Solicitudes
          {pendingCount > 0 && (
            <span style={styles.tabBadge}>{pendingCount}</span>
          )}
        </button>
        <button
          style={tab === 'prompts' ? styles.tabActive : styles.tab}
          onClick={() => setTab('prompts')}
        >
          Configurar IA por ficha
        </button>
      </div>

      {/* ── Contenido ── */}
      <div style={styles.content}>

        {/* Tab: Solicitudes */}
        {tab === 'solicitudes' && (
          <>
            {/* Filtros */}
            <div style={styles.filterRow}>
              {['pending','accepted','rejected','all'].map(f => (
                <button
                  key={f}
                  style={filter === f ? styles.filterActive : styles.filterBtn}
                  onClick={() => setFilter(f)}
                >
                  {{ pending:'Pendientes', accepted:'Aceptados', rejected:'Rechazados', all:'Todos' }[f]}
                </button>
              ))}
            </div>

            {loading ? (
              <div style={styles.emptyMsg}>Cargando solicitudes...</div>
            ) : solicitudesFiltradas.length === 0 ? (
              <div style={styles.emptyMsg}>
                {filter === 'pending'
                  ? '🎉 No hay solicitudes pendientes'
                  : 'No hay solicitudes en esta categoría'}
              </div>
            ) : (
              <div style={styles.solList}>
                {solicitudesFiltradas.map(sol => (
                  <SolicitudCard
                    key={sol.id}
                    sol={sol}
                    onAccept={(id) => handleEstado(id, 'accepted')}
                    onReject={(id) => handleEstado(id, 'rejected')}
                    loading={actionLoading}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Tab: Prompts */}
        {tab === 'prompts' && (
          <>
            <p style={styles.promptsDesc}>
              Configura las instrucciones que usará la IA cuando un estudiante
              aceptado entre al chat de cada ficha.
            </p>
            {fichasRel.length === 0 ? (
              <div style={styles.emptyMsg}>No tienes fichas asignadas aún.</div>
            ) : (
              <div style={styles.promptList}>
                {fichasRel.map(fr => (
                  <PromptEditor
                    key={fr.ficha_id}
                    fichaRel={fr}
                    onSave={handleSavePrompt}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ── Estilos ──────────────────────────────────────────────────
const styles = {
  wrapper: {
    minHeight: '100vh',
    background: '#f7f6ff',
    fontFamily: "'Nunito', sans-serif",
  },
  header: {
    background: 'linear-gradient(135deg, #1a1a3e 0%, #0f3460 60%, #377e80 100%)',
    padding: '24px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 16 },
  backBtn: {
    background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.3)',
    color: 'white', padding: '8px 16px', borderRadius: 10,
    cursor: 'pointer', fontFamily: "'Nunito', sans-serif",
    fontSize: '0.875rem', fontWeight: 700, transition: 'all 0.2s',
  },
  headerTitle: {
    fontFamily: "'Poppins', sans-serif", fontSize: '1.5rem',
    fontWeight: 800, color: 'white', margin: 0,
  },
  headerSub: { color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontSize: '0.9rem' },
  headerAvatar: { width: 52, height: 52, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.3)' },

  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16, padding: '24px 32px 0',
    maxWidth: 1100, margin: '0 auto',
  },
  statCard: {
    background: 'white', borderRadius: 16, padding: '20px 24px',
    boxShadow: '0 2px 12px rgba(76,78,179,0.07)',
    textAlign: 'center',
  },
  statNum: { fontFamily: "'Poppins', sans-serif", fontSize: '2rem', fontWeight: 800 },
  statLabel: { color: '#6b7280', fontSize: '0.85rem', fontWeight: 600, marginTop: 4 },

  tabs: {
    display: 'flex', gap: 8, padding: '24px 32px 0',
    maxWidth: 1100, margin: '0 auto',
  },
  tab: {
    padding: '10px 22px', borderRadius: 10, border: 'none',
    background: 'white', color: '#6b7280', fontWeight: 700,
    fontFamily: "'Nunito', sans-serif", cursor: 'pointer',
    fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  tabActive: {
    padding: '10px 22px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #4c4eb3, #2dabb9)',
    color: 'white', fontWeight: 700,
    fontFamily: "'Nunito', sans-serif", cursor: 'pointer',
    fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8,
    boxShadow: '0 4px 14px rgba(76,78,179,0.3)',
  },
  tabBadge: {
    background: '#f59e0b', color: 'white',
    borderRadius: '50%', width: 20, height: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.75rem', fontWeight: 800,
  },

  content: { padding: '20px 32px 48px', maxWidth: 1100, margin: '0 auto' },

  filterRow: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: {
    padding: '6px 16px', borderRadius: 20, border: '1.5px solid #e5e7eb',
    background: 'white', color: '#6b7280', fontWeight: 600,
    fontFamily: "'Nunito', sans-serif", cursor: 'pointer', fontSize: '0.85rem',
  },
  filterActive: {
    padding: '6px 16px', borderRadius: 20, border: '1.5px solid #4c4eb3',
    background: 'rgba(76,78,179,0.08)', color: '#4c4eb3', fontWeight: 700,
    fontFamily: "'Nunito', sans-serif", cursor: 'pointer', fontSize: '0.85rem',
  },

  solList: { display: 'flex', flexDirection: 'column', gap: 14 },
  solCard: {
    background: 'white', borderRadius: 16, padding: '20px 24px',
    boxShadow: '0 2px 12px rgba(76,78,179,0.07)',
    display: 'flex', alignItems: 'flex-start',
    justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
  },
  solCardLeft: { display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1 },
  solAvatar: { width: 48, height: 48, borderRadius: '50%', flexShrink: 0 },
  solName: {
    fontFamily: "'Poppins', sans-serif", fontWeight: 700,
    fontSize: '1rem', color: '#2d2d4e', marginBottom: 2,
  },
  solEmail: { color: '#6b7280', fontSize: '0.82rem', marginBottom: 4 },
  solFicha: { color: '#4c4eb3', fontSize: '0.85rem', marginBottom: 4 },
  solMensaje: {
    color: '#374151', fontSize: '0.85rem', fontStyle: 'italic',
    background: '#f7f6ff', padding: '6px 12px', borderRadius: 8,
    borderLeft: '3px solid #4c4eb3', marginBottom: 4,
  },
  solFecha: { color: '#9ca3af', fontSize: '0.78rem' },
  solCardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 },
  estadoBadge: {
    padding: '4px 14px', borderRadius: 20,
    fontSize: '0.78rem', fontWeight: 800,
    fontFamily: "'Poppins', sans-serif",
  },
  solActions: { display: 'flex', gap: 8 },
  btnAceptar: {
    padding: '8px 18px', borderRadius: 10, border: 'none',
    background: '#2dabb9', color: 'white', fontWeight: 700,
    fontFamily: "'Nunito', sans-serif", cursor: 'pointer', fontSize: '0.875rem',
  },
  btnRechazar: {
    padding: '8px 18px', borderRadius: 10, border: '1.5px solid #e53e3e',
    background: 'transparent', color: '#e53e3e', fontWeight: 700,
    fontFamily: "'Nunito', sans-serif", cursor: 'pointer', fontSize: '0.875rem',
  },

  emptyMsg: {
    textAlign: 'center', padding: '48px 24px',
    color: '#9ca3af', fontSize: '1rem',
    background: 'white', borderRadius: 16,
    boxShadow: '0 2px 12px rgba(76,78,179,0.07)',
  },

  promptsDesc: {
    color: '#6b7280', fontSize: '0.95rem', marginBottom: 20, lineHeight: 1.6,
  },
  promptList: { display: 'flex', flexDirection: 'column', gap: 14 },
  promptCard: {
    background: 'white', borderRadius: 16,
    boxShadow: '0 2px 12px rgba(76,78,179,0.07)', overflow: 'hidden',
  },
  promptHeader: {
    padding: '18px 24px', display: 'flex',
    alignItems: 'center', justifyContent: 'space-between',
    cursor: 'pointer',
  },
  promptFichaCodigo: {
    fontFamily: "'Poppins', sans-serif", fontWeight: 800,
    color: '#2d2d4e', fontSize: '1rem',
  },
  promptFichaNombre: { color: '#6b7280', fontSize: '0.875rem', marginTop: 2 },
  promptConfigured: {
    fontSize: '0.78rem', fontWeight: 700, color: '#2dabb9',
    background: 'rgba(45,171,185,0.1)', padding: '3px 12px', borderRadius: 20,
  },
  promptPending: {
    fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b',
    background: 'rgba(245,158,11,0.1)', padding: '3px 12px', borderRadius: 20,
  },
  promptBody: {
    padding: '0 24px 24px',
    borderTop: '1px solid rgba(76,78,179,0.08)',
  },
  promptLabel: {
    display: 'block', fontFamily: "'Poppins', sans-serif",
    fontSize: '0.78rem', fontWeight: 700, color: '#6b7280',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: 10, marginTop: 16,
  },
  promptTextarea: {
    width: '100%', padding: '12px 16px',
    background: '#f0eef8', border: '1.5px solid rgba(76,78,179,0.15)',
    borderRadius: 10, fontFamily: "'Nunito', sans-serif",
    fontSize: '0.9rem', color: '#2d2d4e', resize: 'vertical',
    outline: 'none', boxSizing: 'border-box', lineHeight: 1.6,
  },
  btnSavePrompt: {
    padding: '9px 22px', borderRadius: 10, border: 'none',
    background: 'linear-gradient(135deg, #4c4eb3, #2dabb9)',
    color: 'white', fontWeight: 700, fontFamily: "'Nunito', sans-serif",
    cursor: 'pointer', fontSize: '0.875rem',
  },
  btnSavingPrompt: {
    padding: '9px 22px', borderRadius: 10, border: 'none',
    background: '#e5e7eb', color: '#9ca3af', fontWeight: 700,
    fontFamily: "'Nunito', sans-serif", cursor: 'not-allowed', fontSize: '0.875rem',
  },
  savedMsg: { color: '#2dabb9', fontWeight: 700, fontSize: '0.875rem' },

  // Responsive básico inline
  '@media(max-width:768px)': {
    statsRow: { gridTemplateColumns: '1fr 1fr' },
  },
};

export default InstructorDashboard;