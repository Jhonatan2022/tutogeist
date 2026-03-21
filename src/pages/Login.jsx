import React, { useState } from 'react';
import { supabase } from '../supabase';
import '../styles/Login.css';

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    setError('');
    setMessage('');
    setLoading(true);

    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      setLoading(false);
      return;
    }

    if (isRegister) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      });
      if (error) setError(error.message);
      else setMessage('¡Registro exitoso! Revisa tu correo para confirmar.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('Correo o contraseña incorrectos.');
      else onLogin();
    }

    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Escribe tu correo primero.');
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setMessage('Te enviamos un correo para restablecer tu contraseña.');
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* Panel izquierdo */}
        <div className="login-left">
          <div className="login-logo">
            <img src={require('../assets/tutorgeist_logo.png')} alt="TutorGeist" />
          </div>

          <h2 className="login-title">
            {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
          </h2>
          <p className="login-subtitle">
            {isRegister
              ? 'Regístrate para comenzar a aprender'
              : 'Usa tu correo electrónico y contraseña'}
          </p>

          {isRegister && (
            <input
              className="login-input"
              type="text"
              placeholder="Nombre completo"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <input
            className="login-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />

          {!isRegister && (
            <button className="forgot-btn" onClick={handleForgotPassword}>
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {error && <p className="login-error">{error}</p>}
          {message && <p className="login-success">{message}</p>}

          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Cargando...' : isRegister ? 'REGISTRARSE' : 'INICIAR SESIÓN'}
          </button>
        </div>

        {/* Panel derecho */}
        <div className="login-right">
          <h1 className="welcome-title">
            {isRegister ? '¡Hola!' : '¡Bienvenido!'}
          </h1>
          <p className="welcome-subtitle">
            {isRegister
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : 'Ingresa tus datos personales para usar todas las funciones del sitio'}
          </p>
          <button
            className="switch-btn"
            onClick={() => { setIsRegister(!isRegister); setError(''); setMessage(''); }}
          >
            {isRegister ? 'INICIAR SESIÓN' : 'Registrarse'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;