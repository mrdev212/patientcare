import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Signup failed');
      } else {
        router.push('/login?registered=true');
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
        <title>Patient Signup - HealthGuard</title>
        <meta name="description" content="Register as a patient on HealthGuard" />
      </Head>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>🏥 HealthGuard</div>
          <h1 style={styles.title}>Create Account</h1>
          <form onSubmit={handleSignup} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <input id="signup-email" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <input id="signup-password" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="Min 6 characters" style={styles.input} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Confirm Password</label>
              <input id="confirm-password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="Repeat password" style={styles.input} />
            </div>
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" id="signup-btn" disabled={loading} style={styles.button}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          <div style={styles.links}>
            <a href="/login" style={styles.link}>Already have an account? Login</a>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'rgba(30, 41, 59, 0.9)', border: '1px solid rgba(148,163,184,0.1)',
    borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '420px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
  },
  logo: { textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#38bdf8', marginBottom: '8px' },
  title: { textAlign: 'center', color: '#e2e8f0', fontSize: '18px', fontWeight: '400', marginBottom: '28px', marginTop: '0' },
  form: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#94a3b8', fontSize: '14px', fontWeight: '500' },
  input: {
    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)',
    borderRadius: '8px', padding: '12px 16px', color: '#e2e8f0', fontSize: '15px', outline: 'none',
  },
  error: { color: '#f87171', fontSize: '13px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', margin: '0' },
  button: { background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: 'none', borderRadius: '8px', padding: '14px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  links: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' },
  link: { color: '#38bdf8', textDecoration: 'none', fontWeight: '500' },
};
