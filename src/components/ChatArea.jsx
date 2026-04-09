import React, { useState, useRef, useEffect, useImperativeHandle } from 'react';
import NetworkDecoration from './NetworkDecoration';
import { supabase } from '../supabase';

const ChatArea = ({ session, activeItem, exportRef }) => {
  const [messages, setMessages]     = useState([]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(true);
  const [fichaInfo, setFichaInfo]   = useState(null);
  const [isRejected, setIsRejected] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef        = useRef(null);

  useEffect(() => {
    setMessages([]); setFichaInfo(null); setIsRejected(false);
    loadContext();
  }, [activeItem, session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadContext = async () => {
    setLoading(true);
    try {
      if (!session || activeItem === 'Ai Chat') {
        setMessages([{ id: 1, type: 'bot', text: 'Hola 👋 Soy Tutor Geist, tu asistente de aprendizaje. ¿En qué puedo ayudarte hoy?' }]);
        setLoading(false);
        return;
      }

      // Paso 1: buscar la solicitud del estudiante que coincida con el activeItem
      const { data: solicitudes } = await supabase
        .from('solicitudes')
        .select('estado, fichas:ficha_id ( id, codigo, nombre )')
        .eq('estudiante_id', session.user.id);

      const match = solicitudes?.find(s =>
        s.fichas?.nombre === activeItem || s.fichas?.codigo === activeItem
      );

      if (!match) {
        setMessages([{ id: 1, type: 'bot', text: 'Hola 👋 Soy Tutor Geist. ¿En qué puedo ayudarte?' }]);
        setLoading(false);
        return;
      }

      if (match.estado === 'rejected') {
        setIsRejected(true);
        setFichaInfo({ ficha: match.fichas, instructorNombre: '' });
        setMessages([{
          id: 1, type: 'bot', isRejectedMsg: true,
          text: `Lo sentimos 😔\n\nTu solicitud para la ficha **${match.fichas?.codigo} — ${match.fichas?.nombre}** fue **rechazada** por el instructor.\n\nPuedes contactar al instructor para más información o aplicar a otra ficha disponible.`,
        }]);
        setLoading(false);
        return;
      }

      if (match.estado === 'accepted') {
        const fichaId = match.fichas?.id;

        // Paso 2: obtener el prompt del instructor para esta ficha
        const { data: instrFicha } = await supabase
          .from('instructor_fichas')
          .select('ai_prompt, profiles:instructor_id ( full_name )')
          .eq('ficha_id', fichaId)
          .single();

        const instructorNombre = instrFicha?.profiles?.full_name || 'tu instructor';
        const materiaNombre    = match.fichas?.nombre || activeItem;
        const prompt           = instrFicha?.ai_prompt || null;

        setFichaInfo({ ficha: match.fichas, instructorNombre, prompt });

        const welcomeMsg = {
          id: 1, type: 'bot',
          text: `¡Bienvenido! 🎉\n\nEl instructor **${instructorNombre}** te ha aceptado para usar su IA entrenada para la materia de **${materiaNombre}**.\n\nEstoy aquí para ayudarte con todos los temas de esta materia. ¿En qué puedo orientarte hoy?`,
        };

        if (prompt) {
          setMessages([
            welcomeMsg,
            { id: 2, type: 'system', text: `📋 **Instrucciones del instructor:**\n${prompt}` },
          ]);
        } else {
          setMessages([welcomeMsg]);
        }
        setLoading(false);
        return;
      }

      setMessages([{ id: 1, type: 'bot', text: 'Hola 👋 Soy Tutor Geist. ¿En qué puedo ayudarte?' }]);
    } catch (err) {
      console.error(err);
      setMessages([{ id: 1, type: 'bot', text: 'Hola 👋 ¿En qué puedo ayudarte?' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isRejected) return;
    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, type: 'bot',
        text: fichaInfo
          ? `Entendido. Como tutor de **${fichaInfo.ficha?.nombre}**, te ayudo con tu consulta. Dame un momento.`
          : 'Entendido, estoy procesando tu solicitud. Dame un momento.',
      }]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // ── Exportar chat como PDF ──────────────────────────────────
  const handleExport = () => {
    const titulo   = fichaInfo ? `Chat — ${fichaInfo.ficha?.nombre}` : 'Chat — TutorGeist';
    const fecha    = new Date().toLocaleString('es-CO');
    const chatHtml = messages
      .filter(m => m.type !== 'system')
      .map(m => {
        const quien = m.type === 'user' ? 'Tú' : 'Tutor Geist';
        const color = m.type === 'user' ? '#4c4eb3' : '#2dabb9';
        return `
          <div style="margin-bottom:16px;">
            <div style="font-weight:700;color:${color};font-size:0.85rem;margin-bottom:4px;">${quien}</div>
            <div style="background:${m.type==='user'?'#f0eef8':'#e8f7f9'};padding:12px 16px;border-radius:10px;font-size:0.9rem;line-height:1.6;white-space:pre-wrap;">${m.text.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>')}</div>
          </div>`;
      }).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${titulo}</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; max-width: 720px; margin: 0 auto; padding: 32px; color: #2d2d4e; }
          .header { background: linear-gradient(135deg,#4c4eb3,#2dabb9); color:white; padding:24px; border-radius:12px; margin-bottom:24px; }
          .header h1 { margin:0; font-size:1.4rem; }
          .header p  { margin:6px 0 0; opacity:0.8; font-size:0.85rem; }
          @media print { body { padding:16px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TutorGeist — ${titulo}</h1>
          <p>Exportado el ${fecha}</p>
          ${fichaInfo ? `<p>Ficha ${fichaInfo.ficha?.codigo} | Instructor: ${fichaInfo.instructorNombre}</p>` : ''}
        </div>
        ${chatHtml}
      </body>
      </html>`;

    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  // Exponer handleExport al padre via ref
  useImperativeHandle(exportRef, () => handleExport, [messages, fichaInfo]);

  const renderText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i}>{part.slice(2,-2)}</strong>
        : part.split('\n').map((line, j) => (
            <React.Fragment key={`${i}-${j}`}>{j > 0 && <br />}{line}</React.Fragment>
          ))
    );
  };

  return (
    <div className="chat-area" ref={chatRef}>

      {/* ── Banner ficha activa ── */}
      {fichaInfo && (
        <div style={{
          padding: '8px 24px',
          background: isRejected
            ? 'rgba(229,62,62,0.07)'
            : 'linear-gradient(90deg,rgba(45,171,185,0.1),rgba(76,78,179,0.08))',
          borderBottom: `1px solid ${isRejected ? 'rgba(229,62,62,0.2)' : 'rgba(45,171,185,0.15)'}`,
          display: 'flex', alignItems: 'center', gap: 10,
          fontSize: '0.82rem',
          color: isRejected ? '#e53e3e' : '#4c4eb3',
          fontWeight: 700, fontFamily: 'var(--font-heading)',
        }}>
          <span>{isRejected ? '🚫' : '📚'}</span>
          <span>Ficha {fichaInfo.ficha?.codigo} — {fichaInfo.ficha?.nombre}</span>
          <span style={{
            marginLeft: 'auto', fontSize: '0.76rem', padding: '2px 10px',
            borderRadius: 20, fontWeight: 700,
            background: isRejected ? 'rgba(229,62,62,0.1)' : 'rgba(45,171,185,0.1)',
            color: isRejected ? '#e53e3e' : '#2dabb9',
          }}>
            {isRejected ? '✕ Rechazada' : (fichaInfo.prompt ? '✓ IA configurada' : '✓ Activa')}
          </span>
        </div>
      )}

      {/* ── Mensajes ── */}
      <div className="chat-messages">
        <NetworkDecoration />
        {loading ? (
          <div style={{ textAlign:'center', color:'var(--text-secondary)', padding:40 }}>Cargando...</div>
        ) : messages.map(msg => {
          if (msg.type === 'system') return (
            <div key={msg.id} style={{
              background: 'rgba(76,78,179,0.06)', border: '1px dashed rgba(76,78,179,0.2)',
              borderRadius: 12, padding: '12px 18px', fontSize: '0.85rem',
              color: '#4c4eb3', lineHeight: 1.6,
            }}>
              {renderText(msg.text)}
            </div>
          );
          if (msg.type === 'user') return (
            <div key={msg.id} className="message-user">
              <span className="user-label">Tú</span>
              <div className="user-avatar">👤</div>
              <div className="msg-content">{msg.text}</div>
            </div>
          );
          return (
            <div key={msg.id} className="message-bot">
              <div className="bot-avatar" style={msg.isRejectedMsg ? { background:'#e53e3e' } : {}}>G</div>
              <div className="msg-wrapper">
                <div className="bot-name">Tutor Geist</div>
                <div className="msg-content" style={msg.isRejectedMsg ? { background:'rgba(229,62,62,0.06)' } : {}}>
                  {renderText(msg.text)}
                  <button className="copy-btn" onClick={() => navigator.clipboard.writeText(msg.text)} title="Copiar">📋</button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="chat-input-area">
        {isRejected && (
          <div style={{
            textAlign:'center', padding:'10px', marginBottom:8,
            background:'rgba(229,62,62,0.08)', borderRadius:10,
            color:'#e53e3e', fontSize:'0.85rem', fontWeight:600,
          }}>
            🚫 No puedes escribir en este chat — tu solicitud fue rechazada
          </div>
        )}
        <div className="input-container" style={isRejected ? { opacity:0.5, pointerEvents:'none' } : {}}>
          <textarea
            className="input-field"
            placeholder={
              isRejected
                ? 'Chat bloqueado — solicitud rechazada'
                : fichaInfo
                  ? `Pregunta sobre ${fichaInfo.ficha?.nombre}...`
                  : 'Escribe tu prompt, TutorGeist estará trabajando para ti'
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isRejected}
          />
          <div className="input-actions">
            <div className="input-tools">
              <button className="tool-btn" title="Adjuntar">＋</button>
              <button className="tool-btn" title="Editar">✏️</button>
              <button className="tool-btn" title="Documento">📄</button>
            </div>
            <div className="input-right">
              <button className="tool-btn audio-btn" title="Audio">🎙️</button>
              <button className="send-btn" onClick={handleSend} title="Enviar">➤</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Exponemos handleExport para que el Header pueda llamarlo
export { ChatArea as default };