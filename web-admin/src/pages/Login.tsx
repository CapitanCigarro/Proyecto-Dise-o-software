import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonHover, setButtonHover] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica real de autenticación
    navigate('/dashboard');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Iniciar Sesión</h1>
      <p style={styles.subtitle}>Accede al panel de administración</p>
      <form onSubmit={handleLogin}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>Correo:</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              ...styles.input,
              ...(emailFocused ? styles.inputFocus : {}),
            }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            autoComplete="username"
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>Contraseña:</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              ...styles.input,
              ...(passwordFocused ? styles.inputFocus : {}),
            }}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          style={{
            ...styles.button,
            ...(buttonHover ? styles.buttonHover : {}),
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
        >
          Ingresar
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 400,
    margin: '4rem auto',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    textAlign: 'center' as const,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center' as const,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    marginBottom: 8,
    fontWeight: 600,
    color: '#343a40',
    fontSize: 14,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: 16,
    borderRadius: 12,
    border: '1px solid #ced4da',
    backgroundColor: '#f8f9fa',
    color: '#343a40',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  },
  inputFocus: {
    borderColor: '#007AFF',
    backgroundColor: '#ffffff',
    boxShadow: '0 0 8px rgba(0, 122, 255, 0.3)',
  },
  button: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#007AFF',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    padding: '14px',
    borderRadius: 12,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 122, 255, 0.4)',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#005ecb',
  },
};

export default Login;
