import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function DoctorSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', specialization: '', licenseNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/doctor-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
      } else {
        router.push('/doctor-login?registered=true');
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
        <title>Doctor Registration - HealthGuard</title>
        <meta name="description" content="Register as a doctor on HealthGuard" />
      </Head>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>👨‍⚕️ HealthGuard</div>
          <h1 style={styles.title}>Doctor Registration</h1>
          <form onSubmit={handleSignup} style={styles.form}>
            {[
              { id: 'doc-name', label: 'Full Name', name: 'name', type: 'text', placeholder: 'Dr. John Doe' },
              { id: 'doc-email', label: 'Email', name: 'email', type: 'email', placeholder: 'doctor@hospital.com' },
            ].map(f => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <input id={f.id} type={f.type} name={f.name} value={form[f.name]} onChange={handleChange} required placeholder={f.placeholder} style={styles.input} />
              </div>
            ))}

            {/* Specialization Dropdown */}
            <div style={styles.field}>
              <label style={styles.label}>Specialization</label>
              <select id="doc-specialization" name="specialization" value={form.specialization} onChange={handleChange} required
                style={{ ...styles.input, cursor: 'pointer', appearance: 'auto' }}>
                <option value="">— Select Specialization —</option>
                <optgroup label="Internal Medicine">
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Endocrinology</option>
                  <option>Gastroenterology</option>
                  <option>Hematology</option>
                  <option>Infectious Disease</option>
                  <option>Nephrology</option>
                  <option>Pulmonology</option>
                  <option>Rheumatology</option>
                </optgroup>
                <optgroup label="Surgery">
                  <option>General Surgery</option>
                  <option>Cardiothoracic Surgery</option>
                  <option>Neurosurgery</option>
                  <option>Orthopedic Surgery</option>
                  <option>Plastic & Reconstructive Surgery</option>
                  <option>Urological Surgery</option>
                  <option>Vascular Surgery</option>
                  <option>Laparoscopic Surgery</option>
                </optgroup>
                <optgroup label="Pediatrics & Women's Health">
                  <option>Pediatrics</option>
                  <option>Neonatology</option>
                  <option>Pediatric Surgery</option>
                  <option>Obstetrics & Gynecology</option>
                  <option>Reproductive Medicine</option>
                </optgroup>
                <optgroup label="Neurology & Mental Health">
                  <option>Neurology</option>
                  <option>Psychiatry</option>
                  <option>Psychology</option>
                </optgroup>
                <optgroup label="Cancer & Oncology">
                  <option>Medical Oncology</option>
                  <option>Surgical Oncology</option>
                  <option>Radiation Oncology</option>
                  <option>Hematology-Oncology</option>
                </optgroup>
                <optgroup label="Diagnostics & Imaging">
                  <option>Radiology</option>
                  <option>Nuclear Medicine</option>
                  <option>Pathology</option>
                  <option>Anesthesiology</option>
                </optgroup>
                <optgroup label="Specialty & Sensory">
                  <option>Dermatology</option>
                  <option>Ophthalmology</option>
                  <option>Otolaryngology (ENT)</option>
                  <option>Dentistry</option>
                  <option>Oral & Maxillofacial Surgery</option>
                </optgroup>
                <optgroup label="Emergency & Critical Care">
                  <option>Emergency Medicine</option>
                  <option>Critical Care / ICU</option>
                  <option>Trauma Surgery</option>
                </optgroup>
                <optgroup label="Rehabilitation & Other">
                  <option>Physical Medicine & Rehabilitation</option>
                  <option>Geriatrics</option>
                  <option>Sports Medicine</option>
                  <option>Family Medicine</option>
                  <option>Palliative Care</option>
                  <option>Preventive Medicine</option>
                  <option>Other</option>
                </optgroup>
              </select>
            </div>

            {[
              { id: 'doc-license', label: 'License Number', name: 'licenseNumber', type: 'text', placeholder: 'MCI/12345' },
              { id: 'doc-password', label: 'Password', name: 'password', type: 'password', placeholder: 'Min 6 characters' },
              { id: 'doc-confirm-password', label: 'Confirm Password', name: 'confirmPassword', type: 'password', placeholder: 'Repeat password' },
            ].map(f => (
              <div key={f.name} style={styles.field}>
                <label style={styles.label}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id={f.id}
                    type={f.type === 'password' ? (showPw ? 'text' : 'password') : f.type}
                    name={f.name}
                    value={form[f.name]}
                    onChange={handleChange}
                    required
                    placeholder={f.placeholder}
                    style={{ ...styles.input, width: '100%', paddingRight: f.type === 'password' ? '44px' : '16px', boxSizing: 'border-box' }}
                  />
                  {f.type === 'password' && (
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>
                      {showPw ? '🙈' : '👁️'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {error && <p style={styles.error}>{error}</p>}
            <button type="submit" id="doctor-signup-btn" disabled={loading} style={styles.button}>
              {loading ? 'Registering...' : 'Register as Doctor'}
            </button>
          </form>
          <div style={styles.links}>
            <a href="/doctor-login" style={styles.link}>Already registered? Login</a>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', fontFamily: "'Segoe UI', sans-serif", padding: '20px' },
  card: { background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(148,163,184,0.1)', borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' },
  logo: { textAlign: 'center', fontSize: '28px', fontWeight: '700', color: '#34d399', marginBottom: '8px' },
  title: { textAlign: 'center', color: '#e2e8f0', fontSize: '18px', fontWeight: '400', marginBottom: '28px', marginTop: '0' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#94a3b8', fontSize: '14px', fontWeight: '500' },
  input: { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', borderRadius: '8px', padding: '12px 16px', color: '#e2e8f0', fontSize: '15px', outline: 'none' },
  error: { color: '#f87171', fontSize: '13px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', margin: '0' },
  button: { background: 'linear-gradient(135deg, #059669, #0ea5e9)', border: 'none', borderRadius: '8px', padding: '14px', color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' },
  links: { textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '14px' },
  link: { color: '#34d399', textDecoration: 'none', fontWeight: '500' },
};
