import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TABS = ['Overview', 'Medications', 'Appointments', 'Health Reports'];
const TODAY = new Date().toISOString().split('T')[0];

export default function PatientDashboard() {
  const router = useRouter();
  const [patient, setPatient] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [tab, setTab] = useState('Overview');
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Change password
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false });
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [prevTab, setPrevTab] = useState('Overview');

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const fetchAll = useCallback(async (pid) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/patient-dashboard?patientId=${pid}`);
      const data = await res.json();
      if (!res.ok) { flash(data.error || 'Failed to load data', 'error'); return; }
      setPatient(data.patient);
      setDoctor(data.doctor);
      setAppointments(data.appointments || []);
      setMedications(data.medications || []);
      setReports(data.reports || []);
    } catch { flash('Network error', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('patient');
    if (!stored) { router.replace('/login'); return; }
    const p = JSON.parse(stored);
    fetchAll(p.id || p._id);
  }, [fetchAll, router]);

  // Stats
  const upcomingAppts = appointments.filter(a => a.date >= TODAY && a.status === 'scheduled');
  const activeMeds = medications.filter(m => m.status === 'active');
  const todayAppts = appointments.filter(a => a.date === TODAY);

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { flash('New passwords do not match', 'error'); return; }
    if (pwForm.newPw.length < 6) { flash('Password must be at least 6 characters', 'error'); return; }
    setChangePwLoading(true);
    const stored = JSON.parse(localStorage.getItem('patient') || '{}');
    const patientId = stored.id || stored._id;
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (!res.ok) { flash(data.error || 'Failed to change password', 'error'); }
      else {
        flash(data.emailSent
          ? '✅ Password changed! Confirmation email sent to your inbox.'
          : '✅ Password changed! (Email notification could not be sent)', 'success');
        setPwForm({ current: '', newPw: '', confirm: '' });
        setShowChangePw(false);
      }
    } catch { flash('Network error, try again', 'error'); }
    finally { setChangePwLoading(false); }
  };

  // ── If not logged in yet
  if (!patient && !loading) return (
    <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', color: '#94a3b8' }}>
      Redirecting to login...
    </div>
  );

  return (
    <>
      <Head>
        <title>Patient Dashboard – HealthGuard AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
        :root{--primary:#2563eb;--green:#10b981;--purple:#8b5cf6;--dark:#0f172a;--dark2:#1e293b;--dark3:#334155;--border:rgba(148,163,184,0.12);--muted:#94a3b8;--faint:#475569}
        .card{background:var(--dark2);border:1px solid var(--border);border-radius:16px;padding:24px}
        .badge{padding:3px 10px;border-radius:50px;font-size:0.72rem;font-weight:700}
        .badge-blue{background:rgba(59,130,246,0.15);color:#60a5fa}
        .badge-green{background:rgba(16,185,129,0.15);color:#34d399}
        .badge-red{background:rgba(239,68,68,0.15);color:#f87171}
        .badge-yellow{background:rgba(245,158,11,0.15);color:#fbbf24}
        .badge-purple{background:rgba(139,92,246,0.15);color:#a78bfa}
        .btn{padding:9px 20px;border-radius:50px;font-size:0.85rem;font-weight:600;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s}
        .btn-primary{background:linear-gradient(135deg,#2563eb,#8b5cf6);color:#fff;box-shadow:0 4px 12px rgba(37,99,235,0.3)}
        .btn-primary:hover{transform:translateY(-1px)}
        .btn-outline{background:transparent;border:1px solid var(--border);color:var(--muted)}
        .btn-outline:hover{border-color:#3b82f6;color:#3b82f6}
        .btn-sm{padding:6px 14px;font-size:0.78rem}
        .flash{position:fixed;top:80px;right:20px;z-index:9999;padding:12px 20px;border-radius:10px;font-size:0.88rem;font-weight:600;animation:slideIn 0.3s ease}
        .flash-success{background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#34d399}
        .flash-error{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#f87171}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        table{width:100%;border-collapse:collapse}
        th{text-align:left;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--faint);padding:10px 14px;border-bottom:1px solid var(--border)}
        td{padding:12px 14px;font-size:0.87rem;border-bottom:1px solid var(--border);vertical-align:middle}
        tr:last-child td{border-bottom:none}
        tr:hover td{background:rgba(148,163,184,0.03)}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--dark3);border-radius:4px}
      `}</style>

      {msg.text && <div className={`flash flash-${msg.type}`}>{msg.text}</div>}

      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* SIDEBAR */}
        <aside style={{ width: 240, background: '#0c1525', borderRight: '1px solid var(--border)', position: 'fixed', top: 0, left: 0, height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 100 }}>
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>🏥 HealthGuard AI</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>Patient Portal</div>
          </div>
          <div style={{ padding: '20px 12px', flex: 1 }}>
            {[
              { name: 'Overview', icon: '📋' },
              { name: 'Medications', icon: '💊' },
              { name: 'Appointments', icon: '📅' },
              { name: 'Health Reports', icon: '📊' },
            ].map(t => (
              <button key={t.name} onClick={() => { setPrevTab(t.name); setTab(t.name); setShowChangePw(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '11px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, fontSize: '0.9rem', fontWeight: 600, background: tab === t.name && !showChangePw ? 'rgba(37,99,235,0.15)' : 'transparent', color: tab === t.name && !showChangePw ? '#60a5fa' : 'var(--muted)', transition: 'all 0.2s' }}>
                {t.icon} {t.name}
              </button>
            ))}
            <button onClick={() => {
                if (showChangePw) {
                  // toggle OFF — restore previous tab
                  setShowChangePw(false);
                  setTab(prevTab);
                } else {
                  // toggle ON — remember current tab
                  setPrevTab(tab);
                  setShowChangePw(true);
                }
              }}
              style={{ width: '100%', textAlign: 'left', padding: '11px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', marginTop: 8, fontSize: '0.9rem', fontWeight: 600, background: showChangePw ? 'rgba(239,68,68,0.12)' : 'transparent', color: showChangePw ? '#f87171' : 'var(--muted)', transition: 'all 0.2s' }}>
              🔒 Change Password
            </button>
          </div>
          <div style={{ padding: '20px 12px', borderTop: '1px solid var(--border)' }}>
            {patient && (
              <div style={{ padding: '0 8px', marginBottom: 12 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>{patient.fullName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{patient.email}</div>
              </div>
            )}
            <button className="btn btn-outline btn-sm" style={{ width: '100%', borderRadius: 10 }}
              onClick={() => { localStorage.removeItem('patient'); router.replace('/login'); }}>
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ marginLeft: 240, flex: 1, padding: '32px 32px 60px' }}>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 4 }}>
              {tab === 'Overview' && '📋 Overview'}
              {tab === 'Medications' && '💊 My Medications'}
              {tab === 'Appointments' && '📅 My Appointments'}
              {tab === 'Health Reports' && '📊 Health Reports'}
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: '0.87rem' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* ── CHANGE PASSWORD PANEL ── */}
          {showChangePw && (
            <div className="card" style={{ maxWidth: 480, border: '1px solid rgba(239,68,68,0.2)' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 6 }}>🔒 Change Password</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: 20 }}>
                After changing, you will receive a confirmation email with your new password.
              </p>
              <form onSubmit={changePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[{ key: 'current', label: 'Current Password' }, { key: 'newPw', label: 'New Password' }, { key: 'confirm', label: 'Confirm New Password' }].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPw[f.key] ? 'text' : 'password'}
                        value={pwForm[f.key]}
                        onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                        required
                        placeholder="••••••••"
                        style={{ width: '100%', background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: 10, padding: '11px 42px 11px 14px', color: '#e2e8f0', fontSize: '0.9rem', outline: 'none' }}
                      />
                      <button type="button" onClick={() => setShowPw(p => ({ ...p, [f.key]: !p[f.key] }))}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.9rem' }}>
                        {showPw[f.key] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button type="submit" disabled={changePwLoading}
                    style={{ flex: 1, padding: '11px', borderRadius: 10, border: 'none', cursor: changePwLoading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg,#ef4444,#b91c1c)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', opacity: changePwLoading ? 0.7 : 1 }}>
                    {changePwLoading ? '⏳ Changing...' : '🔑 Change Password'}
                  </button>
                  <button type="button" onClick={() => { setShowChangePw(false); setTab(prevTab); setPwForm({ current: '', newPw: '', confirm: '' }); }}
                    style={{ padding: '11px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--muted)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {!showChangePw && loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--muted)' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
              <p>Loading your health data...</p>
            </div>
          ) : !showChangePw ? (
            <>
              {/* ── OVERVIEW TAB ── */}
              {tab === 'Overview' && (
                <div>
                  {/* Stat cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
                    {[
                      { label: 'Active Medications', value: activeMeds.length, icon: '💊', color: '#10b981' },
                      { label: "Today's Appointments", value: todayAppts.length, icon: '📅', color: '#3b82f6' },
                      { label: 'Upcoming Appointments', value: upcomingAppts.length, icon: '⏳', color: '#f59e0b' },
                      { label: 'Health Reports', value: reports.length, icon: '📊', color: '#8b5cf6' },
                    ].map(s => (
                      <div key={s.label} className="card" style={{ borderLeft: `3px solid ${s.color}` }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 6 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Profile */}
                    <div className="card">
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>👤 My Profile</div>
                      {[
                        { label: 'Full Name', val: patient?.fullName },
                        { label: 'Age', val: `${patient?.age} years` },
                        { label: 'Gender', val: patient?.gender },
                        { label: 'Phone', val: patient?.phone },
                        { label: 'Address', val: patient?.address },
                      ].map(r => (
                        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.86rem' }}>
                          <span style={{ color: 'var(--muted)' }}>{r.label}</span>
                          <span style={{ fontWeight: 600 }}>{r.val || '—'}</span>
                        </div>
                      ))}
                      {patient?.medicalHistory && (
                        <div style={{ marginTop: 12, padding: 12, background: 'rgba(245,158,11,0.08)', borderRadius: 10, fontSize: '0.83rem', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
                          <strong>Medical History:</strong> {patient.medicalHistory}
                        </div>
                      )}
                    </div>

                    {/* Doctor info */}
                    <div className="card">
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>👨‍⚕️ My Doctor</div>
                      {doctor ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
                              {doctor.name?.[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700 }}>Dr. {doctor.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{doctor.specialization}</div>
                            </div>
                          </div>
                          {doctor.email && <div style={{ fontSize: '0.83rem', color: 'var(--muted)', marginBottom: 6 }}>📧 {doctor.email}</div>}
                          {doctor.phone && <div style={{ fontSize: '0.83rem', color: 'var(--muted)' }}>📞 {doctor.phone}</div>}
                        </>
                      ) : (
                        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No doctor assigned yet.</p>
                      )}

                      {/* Today's schedule */}
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', margin: '20px 0 12px' }}>Today's Schedule</div>
                      {todayAppts.length === 0
                        ? <p style={{ color: 'var(--muted)', fontSize: '0.83rem' }}>No appointments today.</p>
                        : todayAppts.map(a => (
                          <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.84rem' }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{a.reason || 'General Checkup'}</div>
                              <div style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>Dr. {doctor?.name}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, color: '#60a5fa' }}>{a.time}</div>
                              <span className={`badge badge-${a.status === 'scheduled' ? 'blue' : a.status === 'completed' ? 'green' : 'red'}`}>{a.status}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Active Medications Quick View */}
                  {activeMeds.length > 0 && (
                    <div className="card" style={{ marginTop: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 14 }}>💊 Active Medications</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                        {activeMeds.slice(0, 6).map(m => (
                          <div key={m._id} style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 12, padding: '14px 16px' }}>
                            <div style={{ fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{m.dosage} · {m.frequency}</div>
                            {m.instructions && <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: 4 }}>ℹ️ {m.instructions}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── MEDICATIONS TAB ── */}
              {tab === 'Medications' && (
                <div className="card" style={{ overflowX: 'auto' }}>
                  {medications.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: 12 }}>💊</div>
                      <p>No medications prescribed yet.</p>
                      <p style={{ fontSize: '0.83rem', marginTop: 6 }}>Your doctor will add prescriptions here.</p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Medication</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Duration</th>
                          <th>Instructions</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medications.map(m => (
                          <tr key={m._id}>
                            <td style={{ fontWeight: 700 }}>{m.name}</td>
                            <td>{m.dosage || '—'}</td>
                            <td>{m.frequency || '—'}</td>
                            <td>{m.duration || '—'}</td>
                            <td style={{ color: 'var(--muted)', maxWidth: 180 }}>{m.instructions || '—'}</td>
                            <td>
                              <span className={`badge ${m.status === 'active' ? 'badge-green' : m.status === 'completed' ? 'badge-blue' : 'badge-red'}`}>
                                {m.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ── APPOINTMENTS TAB ── */}
              {tab === 'Appointments' && (
                <div className="card" style={{ overflowX: 'auto' }}>
                  {appointments.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
                      <p>No appointments scheduled yet.</p>
                      <p style={{ fontSize: '0.83rem', marginTop: 6 }}>Your doctor will schedule appointments here.</p>
                    </div>
                  ) : (
                    <>
                      {/* Upcoming section */}
                      {upcomingAppts.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12, color: '#60a5fa' }}>📌 Upcoming</div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                            {upcomingAppts.map(a => (
                              <div key={a._id} style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 12, padding: '16px 18px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                  <span style={{ fontWeight: 700 }}>{a.reason || 'General Checkup'}</span>
                                  <span className="badge badge-blue">{a.status}</span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>📅 {new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'long' })}</div>
                                <div style={{ fontSize: '0.82rem', color: '#60a5fa', fontWeight: 700, marginTop: 4 }}>🕐 {a.time}</div>
                                {doctor && <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>Dr. {doctor.name}</div>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* All appointments table */}
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12 }}>All Appointments</div>
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Doctor</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map(a => (
                            <tr key={a._id}>
                              <td style={{ fontWeight: 600 }}>{new Date(a.date).toLocaleDateString('en-IN')}</td>
                              <td style={{ color: '#60a5fa', fontWeight: 700 }}>{a.time}</td>
                              <td>{a.reason || 'General Checkup'}</td>
                              <td style={{ color: 'var(--muted)' }}>{doctor ? `Dr. ${doctor.name}` : '—'}</td>
                              <td>
                                <span className={`badge badge-${a.status === 'scheduled' ? 'blue' : a.status === 'completed' ? 'green' : 'red'}`}>
                                  {a.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </>
                  )}
                </div>
              )}

              {/* ── HEALTH REPORTS TAB ── */}
              {tab === 'Health Reports' && (
                <div>
                  {reports.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: 12 }}>📊</div>
                      <p>No health reports yet.</p>
                      <p style={{ fontSize: '0.83rem', marginTop: 6 }}>Your doctor will upload reports here.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
                      {reports.map(r => (
                        <div key={r._id} className="card" style={{ borderTop: `3px solid ${r.result === 'Normal' ? '#10b981' : r.result === 'Abnormal' ? '#ef4444' : '#f59e0b'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div style={{ fontWeight: 700, fontSize: '1rem' }}>{r.title}</div>
                            <span className={`badge ${r.result === 'Normal' ? 'badge-green' : r.result === 'Abnormal' ? 'badge-red' : 'badge-yellow'}`}>
                              {r.result || 'Pending'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 6 }}>
                            🏷️ {r.type || 'General'} · 📅 {r.reportDate ? new Date(r.reportDate).toLocaleDateString('en-IN') : new Date(r.createdAt).toLocaleDateString('en-IN')}
                          </div>
                          {r.notes && (
                            <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(148,163,184,0.05)', borderRadius: 8, fontSize: '0.83rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                              {r.notes}
                            </div>
                          )}
                          {r.fileUrl && (
                            <a href={r.fileUrl} target="_blank" rel="noreferrer"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, color: '#60a5fa', fontSize: '0.82rem', textDecoration: 'none' }}>
                              📎 View Report File
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : null}
        </main>
      </div>
    </>
  );
}
