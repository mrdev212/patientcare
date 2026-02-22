import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setErrorCode('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorCode(data.code || 'generic');
        setError(data.error || 'Login failed');
      } else if (data.patient) {
        localStorage.setItem('patient', JSON.stringify(data.patient));
        router.push('/patient-dashboard');
      } else {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/patient-dashboard');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Patient Login - HealthGuard</title>
        <meta name="description" content="Login to HealthGuard patient care portal" />
      </Head>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>🏥 HealthGuard</div>
          <h1 style={styles.title}>Patient Login</h1>
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ ...styles.input, width: '100%', paddingRight: '44px', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>
                  {showPw ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            {error && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                background: errorCode === 'email_not_found' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${errorCode === 'email_not_found' ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)'}`,
                color: errorCode === 'email_not_found' ? '#fbbf24' : '#f87171',
              }}>
                <span style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>
                  {errorCode === 'email_not_found' ? '⚠️' : errorCode === 'wrong_password' ? '🔒' : '❌'}
                </span>
                <span>{error}</span>
              </div>
            )}
            <button type="submit" id="login-btn" disabled={loading} style={styles.button}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div style={styles.links}>
            
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(30, 41, 59, 0.9)',
    border: '1px solid rgba(148, 163, 184, 0.1)',
    borderRadius: '16px',
    padding: '40px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  logo: {
    textAlign: 'center',
    fontSize: '28px',
    fontWeight: '700',
    color: '#38bdf8',
    marginBottom: '8px',
  },
  title: {
    textAlign: 'center',
    color: '#e2e8f0',
    fontSize: '18px',
    fontWeight: '400',
    marginBottom: '28px',
    marginTop: '0',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#94a3b8', fontSize: '14px', fontWeight: '500' },
  input: {
    background: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: '15px',
    outline: 'none',
    transition: 'border 0.2s',
  },
  error: {
    color: '#f87171',
    fontSize: '13px',
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '8px',
    padding: '10px 14px',
    margin: '0',
  },
  button: {
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    border: 'none',
    borderRadius: '8px',
    padding: '14px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '4px',
  },
  links: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#64748b',
    fontSize: '14px',
  },
  link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '500' },
};
