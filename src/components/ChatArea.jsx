import React, { useState, useRef, useEffect } from 'react';
import NetworkDecoration from './NetworkDecoration';

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: 'user',
    text: 'Hola, necesito ayuda con mi solicitud. No tengo muy claro cómo realizar el proceso y me gustaría recibir orientación paso a paso para poder completarlo correctamente.',
  },
  {
    id: 2,
    type: 'bot',
    text: 'Estoy aquí para ayudarte con tu solicitud y acompañarte en todo el proceso. Cuéntame qué necesitas y te brindaré la orientación paso a paso para que puedas resolverlo de forma rápida y sencilla.',
  },
];

const ChatArea = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Entendido, estoy procesando tu solicitud. Dame un momento y te daré una respuesta detallada paso a paso.',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="chat-area">
      <div className="chat-messages">
        <NetworkDecoration />

        {messages.map((msg) =>
          msg.type === 'user' ? (
            <div key={msg.id} className="message-user">
              <span className="user-label">Tú</span>
              <div className="user-avatar">👤</div>
              <div className="msg-content">{msg.text}</div>
            </div>
          ) : (
            <div key={msg.id} className="message-bot">
              <div className="bot-avatar">G</div>
              <div className="msg-wrapper">
                <div className="bot-name">Tutor Geist</div>
                <div className="msg-content">
                  {msg.text}
                  <button
                    className="copy-btn"
                    onClick={() => handleCopy(msg.text)}
                    title="Copiar"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="input-container">
          <textarea
            className="input-field"
            placeholder="Escribe tu promp, TutorGeist estará trabajando para ti"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <div className="input-actions">
            <div className="input-tools">
              <button className="tool-btn" title="Adjuntar archivo">＋</button>
              <button className="tool-btn" title="Editar">✏️</button>
              <button className="tool-btn" title="Documento">📄</button>
            </div>
            <div className="input-right">
              <button className="tool-btn audio-btn" title="Audio">🎙️</button>
              <button className="send-btn" onClick={handleSend} title="Enviar">
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
