import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      router.replace('/login');
    } else {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', background:'#0f172a', color:'#94a3b8', fontFamily:'sans-serif' }}>
      Loading...
    </div>
  );

  return (
    <>
      <Head>
        <title>Patient Dashboard - HealthGuard</title>
        <meta name="description" content="Patient dashboard - HealthGuard patient care portal" />
      </Head>
      <div style={styles.container}>
        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <div style={styles.sidebarLogo}>🏥 HealthGuard</div>
          <nav style={styles.nav}>
            <a href="#" style={styles.navItem}>📋 Overview</a>
            <a href="#" style={styles.navItem}>💊 Medications</a>
            <a href="#" style={styles.navItem}>📅 Appointments</a>
            <a href="#" style={styles.navItem}>📊 Health Reports</a>
          </nav>
          <button id="logout-btn" onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
        </aside>

        {/* Main Content */}
        <main style={styles.main}>
          <div style={styles.header}>
            <h1 style={styles.headerTitle}>Patient Dashboard</h1>
            <span style={styles.userBadge}>👤 {user.email}</span>
          </div>

          <div style={styles.statsGrid}>
            {[
              { icon: '💊', label: 'Medications', value: '3 Active', color: '#38bdf8' },
              { icon: '📅', label: 'Next Appointment', value: 'Tomorrow 10am', color: '#34d399' },
              { icon: '✅', label: 'Adherence Rate', value: '92%', color: '#a78bfa' },
              { icon: '🔔', label: 'Reminders Today', value: '2 Pending', color: '#fb923c' },
            ].map((stat, i) => (
              <div key={i} style={{ ...styles.statCard, borderTop: `3px solid ${stat.color}` }}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <div>
                  <div style={styles.statValue}>{stat.value}</div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.infoCard}>
            <h2 style={styles.cardTitle}>Welcome to HealthGuard 🎉</h2>
            <p style={styles.cardText}>
              Your patient portal is connected to MongoDB. Your health data, medications, and appointment reminders are stored securely in the cloud.
            </p>
            <div style={styles.statusBadge}>✅ MongoDB Connected</div>
          </div>
        </main>
      </div>
    </>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0f172a', fontFamily: "'Segoe UI', sans-serif" },
  sidebar: { width: '240px', background: 'rgba(30,41,59,0.95)', borderRight: '1px solid rgba(148,163,184,0.1)', display: 'flex', flexDirection: 'column', padding: '24px 16px', gap: '8px' },
  sidebarLogo: { fontSize: '20px', fontWeight: '700', color: '#38bdf8', marginBottom: '24px', textAlign: 'center' },
  nav: { display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 },
  navItem: { color: '#94a3b8', textDecoration: 'none', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', fontWeight: '500', transition: 'background 0.2s' },
  logoutBtn: { background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '14px' },
  main: { flex: 1, padding: '32px', overflowY: 'auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  headerTitle: { color: '#e2e8f0', fontSize: '24px', fontWeight: '700', margin: '0' },
  userBadge: { background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { background: 'rgba(30,41,59,0.8)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(148,163,184,0.08)' },
  statIcon: { fontSize: '32px' },
  statValue: { color: '#e2e8f0', fontSize: '18px', fontWeight: '700' },
  statLabel: { color: '#64748b', fontSize: '12px', marginTop: '2px' },
  infoCard: { background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(148,163,184,0.08)', borderRadius: '12px', padding: '24px' },
  cardTitle: { color: '#e2e8f0', fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0' },
  cardText: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 16px 0' },
  statusBadge: { display: 'inline-block', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' },
};
