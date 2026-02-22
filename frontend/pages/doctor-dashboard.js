import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TABS = ['Overview', 'Patients', 'Medications', 'Appointments', 'Reminders'];
const STATUS_COLOR = { scheduled: '#3b82f6', completed: '#10b981', cancelled: '#ef4444' };
const TODAY = new Date().toISOString().split('T')[0];

export default function DoctorDashboard() {
  const router = useRouter();
  const [doctor, setDoctor] = useState(null);
  const [tab, setTab] = useState('Overview');

  // Data
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Modals
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [showAddReport, setShowAddReport] = useState(false);
  const [showAddMed, setShowAddMed] = useState(false);
  const [editPatient, setEditPatient] = useState(null);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);
  const [medTarget, setMedTarget] = useState(null);

  // Forms
  const emptyP = { fullName: '', age: '', gender: 'Male', phone: '', address: '', email: '', medicalHistory: '', password: '' };
  const [pForm, setPForm] = useState(emptyP);
  const [showPassword, setShowPassword] = useState(false);
  const emptyR = { title: '', type: 'Blood Test', medicineRequired: '', notes: '', result: 'Pending', reportDate: TODAY };
  const [reportForm, setReportForm] = useState(emptyR);
  const emptyM = { name: '', dosage: '', frequency: '', duration: '', instructions: '', startDate: TODAY, endDate: '', status: 'active' };
  const [medForm, setMedForm] = useState(emptyM);
  const [aForm, setAForm] = useState({ patientId: '', date: TODAY, time: '09:00', reason: '' });
  const emptyRem = { subject: '', message: '', frequency: 'once', interval: 1, scheduledTime: '09:00' };
  const [rForm, setRForm] = useState(emptyRem);
  const [editingReminder, setEditingReminder] = useState(null);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
    const pwd = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    setPForm(f => ({ ...f, password: pwd }));
    setShowPassword(true);
  };

  const copyPassword = () => {
    if (pForm.password) { navigator.clipboard.writeText(pForm.password); flash('Password copied to clipboard!'); }
  };

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const fetchAll = useCallback(async (docId) => {
    setLoading(true);
    const [pRes, aRes, rRes, mRes] = await Promise.all([
      fetch(`/api/patients?doctorId=${docId}`),
      fetch(`/api/appointments?doctorId=${docId}`),
      fetch(`/api/reminders?doctorId=${docId}`),
      fetch(`/api/medications?doctorId=${docId}`),
    ]);
    const [pd, ad, rd, md] = await Promise.all([pRes.json(), aRes.json(), rRes.json(), mRes.json()]);
    setPatients(pd.patients || []);
    setAppointments(ad.appointments || []);
    setReminders(rd.reminders || []);
    setMedications(md.medications || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('doctor');
    if (!stored) { router.replace('/doctor-login'); return; }
    const doc = JSON.parse(stored);
    setDoctor(doc);
    fetchAll(doc.id);
  }, [fetchAll, router]);

  // ── Patient CRUD
  const addPatient = async (e) => {
    e.preventDefault();
    if (!pForm.password) { flash('Please generate or enter a password first', 'error'); return; }
    const res = await fetch('/api/create-patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pForm, doctorId: doctor.id }),
    });
    const data = await res.json();
    if (!res.ok) { flash(data.error || 'Failed to add patient', 'error'); return; }
    const emailStatus = data.emailSent ? '✉️ Credentials emailed to patient.' : '⚠️ Patient added (email not sent).';
    flash(`Patient added! Password: ${pForm.password} · ${emailStatus}`);
    setShowAddPatient(false); setPForm(emptyP); setShowPassword(false); fetchAll(doctor.id);
  };

  const updatePatient = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/patients?doctorId=${doctor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: editPatient._id, ...pForm }),
    });
    const data = await res.json();
    if (!res.ok) { flash(data.error, 'error'); return; }
    flash('Patient updated successfully');
    setShowEditPatient(false); setEditPatient(null); fetchAll(doctor.id);
  };

  const deletePatient = async (id) => {
    if (!confirm('Delete this patient?')) return;
    const res = await fetch(`/api/patients?doctorId=${doctor.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId: id }),
    });
    if (res.ok) { flash('Patient deleted'); fetchAll(doctor.id); }
  };

  const openEdit = (p) => {
    setEditPatient(p);
    setPForm({ fullName: p.fullName, age: p.age, gender: p.gender, phone: p.phone, address: p.address, email: p.email, medicalHistory: p.medicalHistory || '' });
    setShowEditPatient(true);
  };

  // ── Appointment
  const addAppt = async (e) => {
    e.preventDefault();
    const patient = patients.find(p => p._id === aForm.patientId);
    const res = await fetch(`/api/appointments?doctorId=${doctor.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...aForm, doctorId: doctor.id, patientName: patient?.fullName, patientEmail: patient?.email }),
    });
    const data = await res.json();
    if (!res.ok) { flash(data.error, 'error'); return; }
    flash('Appointment scheduled!'); setShowAddAppt(false); setAForm({ patientId: '', date: TODAY, time: '09:00', reason: '' }); fetchAll(doctor.id);
  };

  const updateApptStatus = async (apptId, status) => {
    await fetch(`/api/appointments?doctorId=${doctor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apptId, status }),
    });
    fetchAll(doctor.id);
  };

  // ── Add Health Report
  const addReport = async (e) => {
    e.preventDefault();
    if (!reportTarget) return;
    const res = await fetch(`/api/health-reports?patientId=${reportTarget._id}&doctorId=${doctor.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reportForm,
        patientId: reportTarget._id,
        doctorId: doctor.id,
        notes: reportForm.medicineRequired
          ? `Medicine Required: ${reportForm.medicineRequired}\n${reportForm.notes}`
          : reportForm.notes,
      }),
    });
    const data = await res.json();
    if (!res.ok) { flash(data.error || 'Failed to add report', 'error'); return; }
    flash(`Report added for ${reportTarget.fullName}!`);
    setShowAddReport(false); setReportForm(emptyR); setReportTarget(null);
    fetchAll(doctor.id);
  };

  // ── Add Medication
  const addMedication = async (e) => {
    e.preventDefault();
    if (!medTarget) return;
    const res = await fetch(`/api/medications?patientId=${medTarget._id}&doctorId=${doctor.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medForm),
    });
    const data = await res.json();
    if (!res.ok) { flash(data.error || 'Failed to add medication', 'error'); return; }
    flash(`Medication prescribed for ${medTarget.fullName}!`);
    setShowAddMed(false); setMedForm(emptyM); setMedTarget(null);
    fetchAll(doctor.id);
  };

  const deleteMedication = async (medId) => {
    if (!confirm('Delete this medication prescription?')) return;
    const res = await fetch('/api/medications', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ medId }),
    });
    if (res.ok) {
      flash('Medication deleted.');
      fetchAll(doctor.id);
    } else {
      flash('Failed to delete medication.', 'error');
    }
  };

  const deleteAppt = async (apptId) => {
    if (!confirm('Delete this appointment?')) return;
    await fetch(`/api/appointments?doctorId=${doctor.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apptId }),
    });
    flash('Appointment deleted'); fetchAll(doctor.id);
  };

  // ── Reminder
  const openReminder = (p) => { 
    setReminderTarget(p); 
    setRForm({ 
      ...emptyRem,
      subject: `Medication Reminder – ${p.fullName}`, 
      message: `Dear ${p.fullName},\n\nThis is a reminder from your doctor to take your prescribed medication on time.\n\nStay healthy!\n\nDr. ${doctor?.name}` 
    }); 
    setEditingReminder(null);
    setShowReminder(true); 
  };

  const sendReminder = async (e) => {
    e.preventDefault();
    const method = editingReminder ? 'PUT' : 'POST';
    const body = editingReminder 
      ? { reminderId: editingReminder._id, ...rForm }
      : { doctorId: doctor.id, patientId: reminderTarget._id, patientEmail: reminderTarget.email, patientName: reminderTarget.fullName, ...rForm };

    const res = await fetch('/api/reminders', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { flash(data.error, 'error'); return; }
    flash(editingReminder ? 'Reminder schedule updated' : `Reminder scheduled for ${reminderTarget.email}`); 
    setShowReminder(false); 
    setEditingReminder(null);
    fetchAll(doctor.id);
  };

  const deleteReminder = async (reminderId) => {
    if (!confirm('Stop and delete this reminder schedule?')) return;
    const res = await fetch('/api/reminders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reminderId }),
    });
    if (res.ok) { flash('Reminder deleted'); fetchAll(doctor.id); }
  };

  // ── Stats
  const todayPatients = appointments.filter(a => a.date === TODAY).length;
  const totalPatients = patients.length;
  const scheduled = appointments.filter(a => a.status === 'scheduled').length;
  const totalReminders = reminders.length;

  if (!doctor) return (
    <>
      <Head>
        <title>Access Dashboard – HealthGuard AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background orbs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(37,99,235,0.08)', filter: 'blur(80px)', top: -100, left: -100 }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: 'rgba(16,185,129,0.07)', filter: 'blur(80px)', bottom: -80, right: -80 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 560, width: '100%' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: 6 }}>🏥 HealthGuard AI</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e2e8f0', marginBottom: 10 }}>Dashboard Access</h1>
          <p style={{ color: '#94a3b8', marginBottom: 36, fontSize: '0.95rem' }}>Please log in to continue to your dashboard</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <a href="/doctor-login" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(16,185,129,0.05))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 16, padding: '28px 20px', textDecoration: 'none', color: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transition: 'all 0.25s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ fontSize: '2.5rem' }}>👨‍⚕️</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Doctor Login</div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Access your patient dashboard</div>
              <div style={{ marginTop: 4, background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: '0.83rem', fontWeight: 700 }}>Login as Doctor →</div>
            </a>
            <a href="/login" style={{ background: 'linear-gradient(135deg,rgba(37,99,235,0.12),rgba(37,99,235,0.05))', border: '1px solid rgba(37,99,235,0.3)', borderRadius: 16, padding: '28px 20px', textDecoration: 'none', color: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, transition: 'all 0.25s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
              <div style={{ fontSize: '2.5rem' }}>🧑‍⚕️</div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>Patient Login</div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>View your health records</div>
              <div style={{ marginTop: 4, background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', color: '#fff', padding: '8px 20px', borderRadius: 50, fontSize: '0.83rem', fontWeight: 700 }}>Login as Patient →</div>
            </a>
          </div>
          <a href="/" style={{ display: 'inline-block', marginTop: 24, color: '#475569', fontSize: '0.85rem', textDecoration: 'none' }}>← Back to Home</a>
        </div>
      </div>
    </>
  );

  return (
    <>
      <Head>
        <title>Doctor Dashboard – HealthGuard AI</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      <style jsx global>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
        :root{--primary:#2563eb;--green:#10b981;--accent:#8b5cf6;--dark:#0f172a;--dark2:#1e293b;--dark3:#334155;--border:rgba(148,163,184,0.12);--muted:#94a3b8;--faint:#475569}
        input,select,textarea{background:#0f172a;border:1px solid var(--border);color:#e2e8f0;border-radius:8px;padding:10px 14px;width:100%;font-size:0.9rem;font-family:'Inter',sans-serif;outline:none;transition:border-color 0.2s}
        input:focus,select:focus,textarea:focus{border-color:#3b82f6}
        textarea{resize:vertical;min-height:100px}
        label{font-size:0.8rem;font-weight:600;color:var(--muted);margin-bottom:5px;display:block;text-transform:uppercase;letter-spacing:0.5px}
        .btn{padding:9px 20px;border-radius:50px;font-size:0.85rem;font-weight:600;cursor:pointer;border:none;display:inline-flex;align-items:center;gap:6px;transition:all 0.2s;text-decoration:none}
        .btn-primary{background:linear-gradient(135deg,#2563eb,#8b5cf6);color:#fff;box-shadow:0 4px 12px rgba(37,99,235,0.3)}
        .btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(37,99,235,0.45)}
        .btn-green{background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 4px 12px rgba(16,185,129,0.3)}
        .btn-green:hover{transform:translateY(-1px)}
        .btn-red{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff}
        .btn-outline{background:transparent;border:1px solid var(--border);color:var(--muted)}
        .btn-outline:hover{border-color:#3b82f6;color:#3b82f6}
        .btn-sm{padding:6px 14px;font-size:0.78rem}
        .card{background:var(--dark2);border:1px solid var(--border);border-radius:16px;padding:24px}
        .badge{padding:3px 10px;border-radius:50px;font-size:0.72rem;font-weight:700;letter-spacing:0.3px}
        .badge-blue{background:rgba(59,130,246,0.15);color:#60a5fa}
        .badge-green{background:rgba(16,185,129,0.15);color:#34d399}
        .badge-red{background:rgba(239,68,68,0.15);color:#f87171}
        /* Overlay */
        .overlay{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:999;padding:20px}
        .modal{background:var(--dark2);border:1px solid var(--border);border-radius:20px;padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto}
        .modal-title{font-size:1.2rem;font-weight:800;margin-bottom:18px;display:flex;align-items:center;gap:10px}
        .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .form-field{display:flex;flex-direction:column;gap:5px}
        .form-field.full{grid-column:1/-1}
        .form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}
        /* Flash */
        .flash{position:fixed;top:80px;right:20px;z-index:9999;padding:12px 20px;border-radius:10px;font-size:0.88rem;font-weight:600;animation:slideIn 0.3s ease}
        .flash-success{background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);color:#34d399}
        .flash-error{background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);color:#f87171}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
        /* Table */
        table{width:100%;border-collapse:collapse}
        th{text-align:left;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--faint);padding:10px 14px;border-bottom:1px solid var(--border)}
        td{padding:12px 14px;font-size:0.87rem;border-bottom:1px solid var(--border);vertical-align:middle}
        tr:last-child td{border-bottom:none}
        tr:hover td{background:rgba(148,163,184,0.03)}
        .td-actions{display:flex;gap:8px;align-items:center}
        /* Scrollbar */
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--dark3);border-radius:4px}
      `}</style>

      {/* Flash Message */}
      {msg.text && <div className={`flash flash-${msg.type}`}>{msg.text}</div>}

      {/* SIDEBAR + MAIN */}
      <div style={{ display: 'flex', minHeight: '100vh' }}>

        {/* SIDEBAR */}
        <aside style={{ width: 240, background: '#0c1525', borderRight: '1px solid var(--border)', position: 'fixed', top: 0, left: 0, height: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 0', zIndex: 100 }}>
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>🏥 HealthGuard AI</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: 4 }}>Doctor Portal</div>
          </div>
          <div style={{ padding: '20px 12px', flex: 1 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ width: '100%', textAlign: 'left', padding: '11px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 4, fontSize: '0.9rem', fontWeight: 600, background: tab === t ? 'rgba(37,99,235,0.15)' : 'transparent', color: tab === t ? '#60a5fa' : 'var(--muted)', transition: 'all 0.2s' }}>
                {t === 'Overview' && '📊 '}{t === 'Patients' && '🧑‍⚕️ '}{t === 'Medications' && '💊 '}{t === 'Appointments' && '📅 '}{t === 'Reminders' && '📧 '}{t}
              </button>
            ))}
          </div>
          <div style={{ padding: '20px 12px', borderTop: '1px solid var(--border)' }}>
            <div style={{ padding: '0 8px', marginBottom: 12 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>Dr. {doctor.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{doctor.specialization}</div>
            </div>
            <button className="btn btn-outline btn-sm" style={{ width: '100%', borderRadius: 10 }} onClick={() => { localStorage.removeItem('doctor'); router.replace('/doctor-login'); }}>
              🚪 Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ marginLeft: 240, flex: 1, padding: '32px 32px 60px' }}>

          {/* Header */}
          <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, marginBottom: 4 }}>
                {tab === 'Overview' && '📊 Dashboard Overview'}
                {tab === 'Patients' && '🧑‍⚕️ Patient Management'}
                {tab === 'Medications' && '💊 Prescribed Medications'}
                {tab === 'Appointments' && '📅 Appointments'}
                {tab === 'Reminders' && '📧 Email Reminders'}
              </h1>
              <p style={{ color: 'var(--muted)', fontSize: '0.87rem' }}>
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {tab === 'Patients' && <button className="btn btn-primary" onClick={() => { setPForm(emptyP); setShowAddPatient(true); }}><i className="fas fa-user-plus"></i> Add Patient</button>}
              {tab === 'Appointments' && <button className="btn btn-green" onClick={() => setShowAddAppt(true)}><i className="fas fa-calendar-plus"></i> Schedule</button>}
            </div>
          </div>

          {/* ── OVERVIEW TAB ── */}
          {tab === 'Overview' && (
            <div>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
                {[
                  { label: 'Total Patients', value: totalPatients, icon: '🧑‍⚕️', color: '#3b82f6' },
                  { label: "Today's Appointments", value: todayPatients, icon: '📅', color: '#10b981' },
                  { label: 'Prescribed Meds', value: medications.length, icon: '💊', color: '#8b5cf6' },
                  { label: 'Reminders Sent', value: totalReminders, icon: '📧', color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} className="card" style={{ borderLeft: `3px solid ${s.color}` }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{s.icon}</div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 6 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Patients + Today's Schedule */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="card">
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Recent Patients</div>
                  {patients.slice(0, 5).length === 0 ? <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No patients yet.</p> : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {patients.slice(0, 5).map(p => (
                        <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.85rem' }}>{p.fullName[0]}</div>
                          <div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.fullName}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.age}y · {p.gender}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="card">
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Today's Schedule</div>
                  {appointments.filter(a => a.date === TODAY).length === 0
                    ? <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No appointments today.</p>
                    : appointments.filter(a => a.date === TODAY).map(a => (
                      <div key={a._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{a.patientName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{a.reason || 'General'}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa' }}>{a.time}</div>
                          <span className={`badge badge-${a.status === 'scheduled' ? 'blue' : a.status === 'completed' ? 'green' : 'red'}`}>{a.status}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PATIENTS TAB ── */}
          {tab === 'Patients' && (
            <div className="card" style={{ overflowX: 'auto' }}>
              {loading ? <p style={{ color: 'var(--muted)' }}>Loading...</p> : patients.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>🧑‍⚕️</div>
                  <p>No patients yet. Add your first patient.</p>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Patient</th><th>Age/Gender</th><th>Phone</th><th>Medical History</th><th>Actions</th></tr></thead>
                  <tbody>
                    {patients.map(p => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{p.fullName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.email}</div>
                        </td>
                        <td>{p.age}y · {p.gender}</td>
                        <td>{p.phone}</td>
                        <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--muted)' }}>{p.medicalHistory || '—'}</td>
                        <td>
                          <div className="td-actions">
                            <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                            <button className="btn btn-sm" style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }} onClick={() => { setReportTarget(p); setShowAddReport(true); }}>📋 Report</button>
                            <button className="btn btn-sm" style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }} onClick={() => { setMedTarget(p); setShowAddMed(true); }}>💊 Meds</button>
                            <button className="btn btn-sm" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }} onClick={() => openReminder(p)}>📧 Remind</button>
                            <button className="btn btn-red btn-sm" onClick={() => deletePatient(p._id)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── MEDICATIONS TAB ── */}
          {tab === 'Medications' && (
            <div className="card" style={{ overflowX: 'auto' }}>
              {loading ? <p style={{ color: 'var(--muted)' }}>Loading medications...</p> : medications.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>💊</div>
                  <p>No medications prescribed yet.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Frequency</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medications.map(m => {
                      const p = patients.find(x => x._id === m.patientId);
                      return (
                        <tr key={m._id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{p?.fullName || 'Unknown'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p?.email || '—'}</div>
                          </td>
                          <td style={{ fontWeight: 700, color: '#60a5fa' }}>{m.name}</td>
                          <td>{m.dosage}</td>
                          <td>{m.frequency}</td>
                          <td>{m.duration}</td>
                          <td>
                            <span className={`badge ${m.status === 'active' ? 'badge-green' : m.status === 'completed' ? 'badge-blue' : 'badge-red'}`}>
                              {m.status}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-red btn-sm" onClick={() => deleteMedication(m._id)} title="Delete Prescription">🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── APPOINTMENTS TAB ── */}
          {tab === 'Appointments' && (
            <div className="card" style={{ overflowX: 'auto' }}>
              {appointments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
                  <p>No appointments yet.</p>
                </div>
              ) : (
                <table>
                  <thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody>
                    {appointments.map(a => (
                      <tr key={a._id}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{a.patientName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{a.patientEmail}</div>
                        </td>
                        <td>{new Date(a.date).toLocaleDateString('en-IN')}</td>
                        <td style={{ fontWeight: 700, color: '#60a5fa' }}>{a.time}</td>
                        <td style={{ color: 'var(--muted)' }}>{a.reason || '—'}</td>
                        <td>
                          <select value={a.status} onChange={e => updateApptStatus(a._id, e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: STATUS_COLOR[a.status], fontWeight: 700, cursor: 'pointer', padding: 0, width: 'auto' }}>
                            <option value="scheduled">Scheduled</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td><button className="btn btn-red btn-sm" onClick={() => deleteAppt(a._id)}>🗑️ Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── REMINDERS TAB ── */}
          {tab === 'Reminders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>Select a patient from the Patients tab to send a reminder, or pick one below.</p>
                <select style={{ width: 'auto', padding: '8px 14px' }} onChange={e => { const p = patients.find(x => x._id === e.target.value); if (p) openReminder(p); }}>
                  <option value="">📧 Quick send to patient…</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.fullName}</option>)}
                </select>
              </div>
              <div className="card" style={{ overflowX: 'auto' }}>
                {reminders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                    <div style={{ fontSize: '3rem', marginBottom: 12 }}>📧</div>
                    <p>No reminders sent yet.</p>
                  </div>
                ) : (
                  <table>
                    <thead><tr><th>Patient</th><th>Schedule</th><th>Subject</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                      {reminders.map(r => (
                        <tr key={r._id}>
                          <td style={{ fontWeight: 600 }}>
                            {r.patientName}
                            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 400 }}>{r.patientEmail}</div>
                          </td>
                          <td style={{ fontSize: '0.85rem' }}>
                            <div style={{ fontWeight: 700, color: '#60a5fa' }}>
                              {r.frequency === 'once' || !r.frequency ? 'Once' : 
                               r.frequency === 'hourly' ? `Every ${r.interval || 1}h` : 
                               r.frequency === 'daily' ? `Daily @ ${r.scheduledTime || '09:00'}` : 
                               `Every ${r.interval || 1} days`}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                              Created {new Date(r.createdAt || r.sentAt || Date.now()).toLocaleDateString()}
                            </div>
                          </td>
                          <td>{r.subject}</td>
                          <td>
                            <span className={`badge badge-${r.status === 'active' ? 'green' : 'red'}`}>{r.status}</span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-outline btn-sm" onClick={() => { setReminderTarget({ _id: r.patientId, fullName: r.patientName, email: r.patientEmail }); setRForm({ subject: r.subject, message: r.message, frequency: r.frequency, interval: r.interval, scheduledTime: r.scheduledTime }); setEditingReminder(r); setShowReminder(true); }}>✏️</button>
                              <button className="btn btn-red btn-sm" onClick={() => deleteReminder(r._id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── ADD PATIENT MODAL ── */}
      {showAddPatient && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAddPatient(false)}>
          <div className="modal">
            <div className="modal-title">🧑‍⚕️ Add New Patient</div>
            <form onSubmit={addPatient}>
              <div className="form-grid">
                <div className="form-field"><label>Full Name *</label><input value={pForm.fullName} onChange={e => setPForm({ ...pForm, fullName: e.target.value })} required placeholder="Ravi Kumar" /></div>
                <div className="form-field"><label>Email *</label><input type="email" value={pForm.email} onChange={e => setPForm({ ...pForm, email: e.target.value })} required placeholder="ravi@email.com" /></div>
                <div className="form-field"><label>Age *</label><input type="number" value={pForm.age} onChange={e => setPForm({ ...pForm, age: e.target.value })} required placeholder="30" /></div>
                <div className="form-field"><label>Gender *</label><select value={pForm.gender} onChange={e => setPForm({ ...pForm, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div className="form-field"><label>Phone *</label><input value={pForm.phone} onChange={e => setPForm({ ...pForm, phone: e.target.value })} required placeholder="+91 98765 43210" /></div>
                <div className="form-field"><label>Address *</label><input value={pForm.address} onChange={e => setPForm({ ...pForm, address: e.target.value })} required placeholder="Mumbai, Maharashtra" /></div>

                {/* Password Generate */}
                <div className="form-field full">
                  <label>Patient Password *</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={pForm.password}
                        onChange={e => setPForm({ ...pForm, password: e.target.value })}
                        placeholder="Click Generate →"
                        required
                        style={{ paddingRight: 40 }}
                      />
                      <button type="button" onClick={() => setShowPassword(v => !v)}
                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: '0.9rem' }}>
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    <button type="button" className="btn btn-green btn-sm" onClick={generatePassword} style={{ borderRadius: 8, whiteSpace: 'nowrap' }}>
                      🔑 Generate
                    </button>
                    {pForm.password && (
                      <button type="button" className="btn btn-outline btn-sm" onClick={copyPassword} style={{ borderRadius: 8 }}>
                        📋 Copy
                      </button>
                    )}
                  </div>
                  {pForm.password && (
                    <div style={{ marginTop: 6, padding: '8px 12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, fontSize: '0.78rem', color: '#34d399' }}>
                      ✅ Password set · Will be emailed to patient automatically after adding.
                    </div>
                  )}
                </div>

                <div className="form-field full"><label>Medical History</label><textarea value={pForm.medicalHistory} onChange={e => setPForm({ ...pForm, medicalHistory: e.target.value })} placeholder="Diabetes, Hypertension..." /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddPatient(false); setShowPassword(false); }}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Patient &amp; Send Credentials</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT PATIENT MODAL ── */}
      {showEditPatient && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowEditPatient(false)}>
          <div className="modal">
            <div className="modal-title">✏️ Edit Patient</div>
            <form onSubmit={updatePatient}>
              <div className="form-grid">
                <div className="form-field"><label>Full Name *</label><input value={pForm.fullName} onChange={e => setPForm({ ...pForm, fullName: e.target.value })} required /></div>
                <div className="form-field"><label>Email</label><input value={pForm.email} disabled style={{ opacity: 0.5 }} /></div>
                <div className="form-field"><label>Age *</label><input type="number" value={pForm.age} onChange={e => setPForm({ ...pForm, age: e.target.value })} required /></div>
                <div className="form-field"><label>Gender *</label><select value={pForm.gender} onChange={e => setPForm({ ...pForm, gender: e.target.value })}><option>Male</option><option>Female</option><option>Other</option></select></div>
                <div className="form-field"><label>Phone *</label><input value={pForm.phone} onChange={e => setPForm({ ...pForm, phone: e.target.value })} required /></div>
                <div className="form-field"><label>Address *</label><input value={pForm.address} onChange={e => setPForm({ ...pForm, address: e.target.value })} required /></div>
                <div className="form-field full"><label>Medical History</label><textarea value={pForm.medicalHistory} onChange={e => setPForm({ ...pForm, medicalHistory: e.target.value })} /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowEditPatient(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── SCHEDULE APPOINTMENT MODAL ── */}
      {showAddAppt && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAddAppt(false)}>
          <div className="modal">
            <div className="modal-title">📅 Schedule Appointment</div>
            <form onSubmit={addAppt}>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Select Patient *</label>
                  <select value={aForm.patientId} onChange={e => setAForm({ ...aForm, patientId: e.target.value })} required>
                    <option value="">— Select Patient —</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.fullName}</option>)}
                  </select>
                </div>
                <div className="form-field"><label>Date *</label><input type="date" value={aForm.date} min={TODAY} onChange={e => setAForm({ ...aForm, date: e.target.value })} required /></div>
                <div className="form-field"><label>Time *</label><input type="time" value={aForm.time} onChange={e => setAForm({ ...aForm, time: e.target.value })} required /></div>
                <div className="form-field full"><label>Reason</label><input value={aForm.reason} onChange={e => setAForm({ ...aForm, reason: e.target.value })} placeholder="Routine checkup, Follow-up..." /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddAppt(false)}>Cancel</button>
                <button type="submit" className="btn btn-green">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── REMINDER MODAL ── */}
      {showReminder && reminderTarget && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowReminder(false)}>
          <div className="modal">
            <div className="modal-title">📧 Send Email Reminder</div>
            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem' }}>
              To: <strong>{reminderTarget.fullName}</strong> &lt;{reminderTarget.email}&gt;
            </div>
            <form onSubmit={sendReminder}>
              <div className="form-grid">
                <div className="form-field full"><label>Subject *</label><input value={rForm.subject} onChange={e => setRForm({ ...rForm, subject: e.target.value })} required /></div>
                <div className="form-field full"><label>Message *</label><textarea rows={3} value={rForm.message} onChange={e => setRForm({ ...rForm, message: e.target.value })} required /></div>
                
                <div className="form-field">
                  <label>Frequency</label>
                  <select value={rForm.frequency} onChange={e => setRForm({ ...rForm, frequency: e.target.value })}>
                    <option value="once">Send Once (Now)</option>
                    <option value="hourly">Hourly Interval</option>
                    <option value="daily">Daily Schedule</option>
                    <option value="custom-days">Custom Days Interval</option>
                  </select>
                </div>

                {rForm.frequency === 'hourly' && (
                  <div className="form-field">
                    <label>Every X Hours</label>
                    <input type="number" min="1" max="24" value={rForm.interval} onChange={e => setRForm({ ...rForm, interval: parseInt(e.target.value) })} />
                  </div>
                )}
                {rForm.frequency === 'daily' && (
                  <div className="form-field">
                    <label>Time of Day</label>
                    <input type="time" value={rForm.scheduledTime} onChange={e => setRForm({ ...rForm, scheduledTime: e.target.value })} />
                  </div>
                )}
                {rForm.frequency === 'custom-days' && (
                  <div className="form-field">
                    <label>Every X Days</label>
                    <input type="number" min="1" max="365" value={rForm.interval} onChange={e => setRForm({ ...rForm, interval: parseInt(e.target.value) })} />
                  </div>
                )}
              </div>
              <div className="form-actions" style={{ marginTop: 24 }}>
                <button type="button" className="btn btn-outline" onClick={() => { setShowReminder(false); setEditingReminder(null); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg,#8b5cf6,#6366f1)' }}>
                  {editingReminder ? '💾 Update Schedule' : rForm.frequency === 'once' ? '📤 Send Now' : '📅 Set Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ADD REPORT MODAL ── */}
      {showAddReport && reportTarget && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAddReport(false)}>
          <div className="modal">
            <div className="modal-title">📋 Add Health Report</div>
            <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem' }}>
              Patient: <strong>{reportTarget.fullName}</strong> &lt;{reportTarget.email}&gt;
            </div>
            <form onSubmit={addReport}>
              <div className="form-grid">
                <div className="form-field"><label>Report Title *</label><input value={reportForm.title} onChange={e => setReportForm({ ...reportForm, title: e.target.value })} required placeholder="Blood Test Report, X-Ray, ECG..." /></div>
                <div className="form-field">
                  <label>Report Type</label>
                  <select value={reportForm.type} onChange={e => setReportForm({ ...reportForm, type: e.target.value })}>
                    {['Blood Test','Urine Test','X-Ray','ECG','MRI','CT Scan','Ultrasound','Biopsy','General','Other'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field full">
                  <label>💊 Medicines Required</label>
                  <textarea value={reportForm.medicineRequired} onChange={e => setReportForm({ ...reportForm, medicineRequired: e.target.value })} placeholder="e.g. Paracetamol 500mg twice daily, Metformin 1g after meals..." rows={3} />
                </div>
                <div className="form-field full"><label>Doctor&apos;s Notes</label><textarea value={reportForm.notes} onChange={e => setReportForm({ ...reportForm, notes: e.target.value })} placeholder="Observations, instructions, follow-up advice..." rows={3} /></div>
                <div className="form-field">
                  <label>Result</label>
                  <select value={reportForm.result} onChange={e => setReportForm({ ...reportForm, result: e.target.value })}>
                    <option>Pending</option><option>Normal</option><option>Abnormal</option>
                  </select>
                </div>
                <div className="form-field"><label>Report Date</label><input type="date" value={reportForm.reportDate} onChange={e => setReportForm({ ...reportForm, reportDate: e.target.value })} /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddReport(false); setReportForm(emptyR); }}>Cancel</button>
                <button type="submit" className="btn btn-green">📋 Save Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── ADD MEDICATION MODAL ── */}
      {showAddMed && medTarget && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowAddMed(false)}>
          <div className="modal">
            <div className="modal-title">💊 Prescribe Medication</div>
            <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: '0.85rem' }}>
              Patient: <strong>{medTarget.fullName}</strong> &lt;{medTarget.email}&gt;
            </div>
            <form onSubmit={addMedication}>
              <div className="form-grid">
                <div className="form-field full">
                  <label>Medication Name *</label>
                  <input value={medForm.name} onChange={e => setMedForm({ ...medForm, name: e.target.value })} required placeholder="e.g. Amoxicillin, Metformin..." />
                </div>
                <div className="form-field">
                  <label>Dosage</label>
                  <input value={medForm.dosage} onChange={e => setMedForm({ ...medForm, dosage: e.target.value })} placeholder="e.g. 500mg, 1 tablet" />
                </div>
                <div className="form-field">
                  <label>Frequency</label>
                  <input value={medForm.frequency} onChange={e => setMedForm({ ...medForm, frequency: e.target.value })} placeholder="e.g. Twice daily, Once at night" />
                </div>
                <div className="form-field">
                  <label>Duration</label>
                  <input value={medForm.duration} onChange={e => setMedForm({ ...medForm, duration: e.target.value })} placeholder="e.g. 7 days, 1 month" />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select value={medForm.status} onChange={e => setMedForm({ ...medForm, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="stopped">Stopped</option>
                  </select>
                </div>
                <div className="form-field full">
                  <label>Usage Instructions</label>
                  <textarea value={medForm.instructions} onChange={e => setMedForm({ ...medForm, instructions: e.target.value })} placeholder="e.g. Take after meals, Avoid dairy..." rows={2} />
                </div>
                <div className="form-field">
                  <label>Start Date</label>
                  <input type="date" value={medForm.startDate} onChange={e => setMedForm({ ...medForm, startDate: e.target.value })} />
                </div>
                <div className="form-field">
                  <label>End Date (Optional)</label>
                  <input type="date" value={medForm.endDate} onChange={e => setMedForm({ ...medForm, endDate: e.target.value })} />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-outline" onClick={() => { setShowAddMed(false); setMedForm(emptyM); }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>💊 Prescribe Medicine</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
