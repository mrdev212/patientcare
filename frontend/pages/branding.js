import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function BrandingPage() {
  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));

    // Navbar scroll effect
    const handleScroll = () => {
      const nav = document.querySelector('.hg-navbar');
      if (nav) {
        nav.style.background = window.scrollY > 60
          ? 'rgba(15,23,42,0.98)'
          : 'rgba(15,23,42,0.85)';
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>HealthGuard AI | Patient Engagement &amp; Reminder Solutions</title>
        <meta name="description" content="HealthGuard AI - LSTM-based personalized patient engagement, medication reminders, and adherence tracking for doctors and patients." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <style jsx global>{`
        .hg-page *, .hg-page *::before, .hg-page *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --hg-primary: #2563eb; --hg-primary-light: #3b82f6;
          --hg-secondary: #10b981; --hg-secondary-light: #34d399;
          --hg-accent: #8b5cf6; --hg-dark: #0f172a; --hg-dark2: #1e293b;
          --hg-dark3: #334155; --hg-text: #e2e8f0; --hg-muted: #94a3b8;
          --hg-faint: #475569; --hg-border: rgba(148,163,184,0.1);
        }
        .hg-page { font-family:'Inter',sans-serif; background:var(--hg-dark); color:var(--hg-text); overflow-x:hidden; line-height:1.6; }

        /* NAVBAR */
        .hg-navbar { position:fixed; top:0; left:0; right:0; z-index:1000; padding:16px 0; background:rgba(15,23,42,0.85); backdrop-filter:blur(16px); border-bottom:1px solid var(--hg-border); transition:background 0.3s; }
        .hg-nav-inner { max-width:1200px; margin:0 auto; padding:0 2rem; display:flex; align-items:center; justify-content:space-between; }
        .hg-logo { display:flex; align-items:center; gap:10px; font-size:1.4rem; font-weight:800; color:var(--hg-secondary); text-decoration:none; }
        .hg-logo span { color:var(--hg-text); }
        .hg-nav-links { display:flex; align-items:center; gap:2rem; list-style:none; }
        .hg-nav-links a { color:var(--hg-muted); text-decoration:none; font-size:0.9rem; font-weight:500; transition:color 0.2s; }
        .hg-nav-links a:hover { color:var(--hg-secondary); }
        .hg-nav-cta { display:flex; gap:10px; }

        /* BUTTONS */
        .hg-btn { padding:9px 22px; border-radius:50px; font-size:0.9rem; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:all 0.25s ease; cursor:pointer; border:none; }
        .hg-btn-outline { color:var(--hg-text); border:1.5px solid var(--hg-border); background:transparent; }
        .hg-btn-outline:hover { border-color:var(--hg-secondary); color:var(--hg-secondary); }
        .hg-btn-primary { background:linear-gradient(135deg,var(--hg-primary),var(--hg-accent)); color:#fff; box-shadow:0 4px 15px rgba(37,99,235,0.35); }
        .hg-btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(37,99,235,0.5); }
        .hg-btn-green { background:linear-gradient(135deg,var(--hg-secondary),#059669); color:#fff; box-shadow:0 4px 15px rgba(16,185,129,0.35); }
        .hg-btn-green:hover { transform:translateY(-2px); box-shadow:0 8px 25px rgba(16,185,129,0.5); }
        .hg-btn-lg { padding:14px 32px; font-size:1rem; }

        /* HERO */
        .hg-hero { min-height:100vh; display:flex; align-items:center; justify-content:center; text-align:center; position:relative; overflow:hidden; padding:120px 2rem 80px; }
        .hg-hero-bg { position:absolute; inset:0; background:radial-gradient(ellipse 80% 60% at 50% 20%,rgba(37,99,235,0.18) 0%,transparent 70%),radial-gradient(ellipse 60% 50% at 80% 80%,rgba(16,185,129,0.12) 0%,transparent 70%),radial-gradient(ellipse 50% 50% at 10% 70%,rgba(139,92,246,0.1) 0%,transparent 70%); }
        .hg-hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(148,163,184,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(148,163,184,0.04) 1px,transparent 1px); background-size:60px 60px; }
        .hg-orb { position:absolute; border-radius:50%; filter:blur(80px); animation:hgOrbFloat 12s ease-in-out infinite alternate; }
        .hg-orb-1 { width:400px; height:400px; background:rgba(37,99,235,0.15); top:-100px; left:-100px; }
        .hg-orb-2 { width:350px; height:350px; background:rgba(16,185,129,0.1); bottom:-80px; right:-80px; animation-delay:-4s; }
        .hg-orb-3 { width:250px; height:250px; background:rgba(139,92,246,0.12); top:50%; left:70%; animation-delay:-8s; }
        @keyframes hgOrbFloat { from { transform:translate(0,0) scale(1); } to { transform:translate(30px,20px) scale(1.1); } }
        .hg-hero-content { position:relative; z-index:2; max-width:850px; }
        .hg-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); color:var(--hg-secondary-light); padding:6px 16px; border-radius:50px; font-size:0.82rem; font-weight:600; margin-bottom:24px; letter-spacing:0.5px; }
        .hg-badge-dot { width:6px; height:6px; background:var(--hg-secondary); border-radius:50%; animation:hgBlink 1.5s infinite; }
        @keyframes hgBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .hg-hero-title { font-size:clamp(2.4rem,6vw,4.2rem); font-weight:800; line-height:1.12; margin-bottom:20px; animation:hgFadeUp 0.8s ease forwards; }
        .hg-gradient { background:linear-gradient(135deg,var(--hg-primary-light),var(--hg-secondary-light),var(--hg-accent)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .hg-hero-sub { font-size:clamp(1rem,2.5vw,1.2rem); color:var(--hg-muted); margin-bottom:36px; max-width:640px; margin-left:auto; margin-right:auto; animation:hgFadeUp 0.8s 0.15s ease both; }
        .hg-hero-actions { display:flex; flex-wrap:wrap; gap:14px; justify-content:center; animation:hgFadeUp 0.8s 0.3s ease both; }
        @keyframes hgFadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .hg-stats { display:flex; justify-content:center; gap:40px; flex-wrap:wrap; margin-top:56px; padding-top:40px; border-top:1px solid var(--hg-border); animation:hgFadeUp 0.8s 0.5s ease both; }
        .hg-stat-value { font-size:2rem; font-weight:800; color:var(--hg-secondary-light); line-height:1; }
        .hg-stat-label { font-size:0.8rem; color:var(--hg-faint); margin-top:4px; letter-spacing:0.5px; text-transform:uppercase; }

        /* SECTIONS */
        .hg-section { padding:90px 2rem; }
        .hg-section-inner { max-width:1200px; margin:0 auto; }
        .hg-label { text-align:center; font-size:0.78rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--hg-secondary); margin-bottom:12px; }
        .hg-title { text-align:center; font-size:clamp(1.8rem,4vw,2.6rem); font-weight:800; margin-bottom:14px; }
        .hg-sub { text-align:center; color:var(--hg-muted); font-size:1rem; max-width:600px; margin:0 auto 56px; }

        /* FEATURES */
        .hg-features-bg { background:var(--hg-dark2); }
        .hg-features-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:20px; }
        .hg-feature-card { background:var(--hg-dark); border:1px solid var(--hg-border); border-radius:16px; padding:28px; transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s; }
        .hg-feature-card:hover { transform:translateY(-6px); border-color:rgba(16,185,129,0.3); box-shadow:0 20px 40px rgba(0,0,0,0.3); }
        .hg-feature-icon { width:52px; height:52px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.4rem; margin-bottom:18px; }
        .hg-feature-card h3 { font-size:1.05rem; font-weight:700; margin-bottom:8px; }
        .hg-feature-card p { font-size:0.88rem; color:var(--hg-muted); line-height:1.65; }
        .ic-blue { background:rgba(37,99,235,0.15); color:#60a5fa; }
        .ic-green { background:rgba(16,185,129,0.15); color:#34d399; }
        .ic-purple { background:rgba(139,92,246,0.15); color:#a78bfa; }
        .ic-orange { background:rgba(249,115,22,0.15); color:#fb923c; }
        .ic-pink { background:rgba(236,72,153,0.15); color:#f472b6; }
        .ic-teal { background:rgba(20,184,166,0.15); color:#2dd4bf; }

        /* HOW IT WORKS */
        .hg-steps { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:0; position:relative; }
        .hg-steps::before { content:''; position:absolute; top:32px; left:10%; right:10%; height:2px; background:linear-gradient(90deg,var(--hg-primary),var(--hg-secondary)); opacity:0.3; }
        .hg-step { text-align:center; padding:24px 20px; }
        .hg-step-num { width:64px; height:64px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.4rem; font-weight:800; margin:0 auto 18px; position:relative; z-index:1; }
        .sn-1{background:linear-gradient(135deg,#1d4ed8,#3b82f6)} .sn-2{background:linear-gradient(135deg,#059669,#10b981)} .sn-3{background:linear-gradient(135deg,#7c3aed,#8b5cf6)} .sn-4{background:linear-gradient(135deg,#c2410c,#f97316)}
        .hg-step h3 { font-size:1rem; font-weight:700; margin-bottom:8px; }
        .hg-step p { font-size:0.85rem; color:var(--hg-muted); line-height:1.6; }

        /* ROLES */
        .hg-roles-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        @media(max-width:768px){ .hg-roles-grid{grid-template-columns:1fr} .hg-nav-links{display:none} .hg-steps::before{display:none} }
        .hg-role-card { border-radius:20px; padding:36px; position:relative; overflow:hidden; }
        .hg-role-patient { background:linear-gradient(135deg,rgba(37,99,235,0.12),rgba(139,92,246,0.08)); border:1px solid rgba(37,99,235,0.25); }
        .hg-role-doctor { background:linear-gradient(135deg,rgba(16,185,129,0.12),rgba(37,99,235,0.06)); border:1px solid rgba(16,185,129,0.25); }
        .hg-role-emoji { font-size:3rem; margin-bottom:16px; }
        .hg-role-card h3 { font-size:1.4rem; font-weight:800; margin-bottom:10px; }
        .hg-role-card p { color:var(--hg-muted); font-size:0.9rem; margin-bottom:22px; line-height:1.65; }
        .hg-role-list { list-style:none; margin-bottom:28px; }
        .hg-role-list li { padding:6px 0; font-size:0.87rem; color:var(--hg-muted); display:flex; align-items:center; gap:10px; }
        .hg-role-list li::before { content:'✓'; font-weight:700; width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.7rem; flex-shrink:0; }
        .hg-role-patient .hg-role-list li::before { background:rgba(37,99,235,0.2); color:#60a5fa; }
        .hg-role-doctor .hg-role-list li::before { background:rgba(16,185,129,0.2); color:#34d399; }

        /* STATS BAND */
        .hg-stats-band { background:linear-gradient(135deg,rgba(37,99,235,0.12),rgba(16,185,129,0.08)); border-top:1px solid var(--hg-border); border-bottom:1px solid var(--hg-border); padding:60px 2rem; }
        .hg-stats-row { display:flex; justify-content:space-around; flex-wrap:wrap; gap:32px; max-width:900px; margin:0 auto; text-align:center; }
        .hg-stat-num { font-size:2.6rem; font-weight:800; margin-bottom:6px; }
        .hg-stat-text { color:var(--hg-muted); font-size:0.85rem; }
        .c-blue{color:#60a5fa} .c-green{color:#34d399} .c-purple{color:#a78bfa} .c-orange{color:#fb923c}

        /* CTA */
        .hg-cta { text-align:center; padding:100px 2rem; background:var(--hg-dark2); position:relative; overflow:hidden; }
        .hg-cta::before { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:600px; height:600px; background:radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 70%); border-radius:50%; }
        .hg-cta h2 { font-size:clamp(2rem,4vw,3rem); font-weight:800; position:relative; margin-bottom:16px; }
        .hg-cta p { color:var(--hg-muted); font-size:1.05rem; margin-bottom:36px; position:relative; }
        .hg-cta-actions { display:flex; justify-content:center; gap:14px; flex-wrap:wrap; position:relative; }

        /* FOOTER */
        .hg-footer { background:var(--hg-dark); border-top:1px solid var(--hg-border); padding:40px 2rem; }
        .hg-footer-inner { max-width:1200px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px; }
        .hg-footer-logo { font-size:1.3rem; font-weight:800; color:var(--hg-secondary); }
        .hg-footer-links { display:flex; gap:24px; }
        .hg-footer-links a { color:var(--hg-faint); text-decoration:none; font-size:0.85rem; transition:color 0.2s; }
        .hg-footer-links a:hover { color:var(--hg-secondary); }
        .hg-footer-copy { color:var(--hg-faint); font-size:0.8rem; }

        /* REVEAL */
        .reveal { opacity:0; transform:translateY(30px); transition:opacity 0.7s ease,transform 0.7s ease; }
        .reveal.visible { opacity:1; transform:translateY(0); }
      `}</style>

      <div className="hg-page">

        {/* NAVBAR */}
        <nav className="hg-navbar">
          <div className="hg-nav-inner">
            <Link href="/branding" className="hg-logo">🏥 HealthGuard <span>AI</span></Link>
            <ul className="hg-nav-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#roles">For You</a></li>
              <li><Link href="/">Hospital</Link></li>
            </ul>
            <div className="hg-nav-cta">
              <Link href="/login" className="hg-btn hg-btn-outline">Patient Login</Link>
              <Link href="/doctor-login" className="hg-btn hg-btn-green">Doctor Login</Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="hg-hero">
          <div className="hg-hero-bg"></div>
          <div className="hg-hero-grid"></div>
          <div className="hg-orb hg-orb-1"></div>
          <div className="hg-orb hg-orb-2"></div>
          <div className="hg-orb hg-orb-3"></div>
          <div className="hg-hero-content">
            <div className="hg-badge">
              <span className="hg-badge-dot"></span> AI-Powered Patient Care Platform
            </div>
            <h1 className="hg-hero-title">
              Smarter Care,<br />
              <span className="hg-gradient">Better Outcomes</span>
            </h1>
            <p className="hg-hero-sub">
              HealthGuard AI uses LSTM-based deep learning to predict patient adherence, deliver personalized
              medication reminders, and empower healthcare professionals with real-time insights.
            </p>
            <div className="hg-hero-actions">
              <Link href="/login" className="hg-btn hg-btn-primary hg-btn-lg">
                <i className="fas fa-sign-in-alt"></i> Patient Login
              </Link>
              <Link href="/doctor-signup" className="hg-btn hg-btn-green hg-btn-lg">
                <i className="fas fa-user-md"></i> Register as Doctor
              </Link>
            </div>
            <div className="hg-stats">
              {[['92%','Adherence Rate'],['10K+','Patients Tracked'],['500+','Doctors Registered'],['99.9%','Uptime']].map(([v,l]) => (
                <div key={l}>
                  <div className="hg-stat-value">{v}</div>
                  <div className="hg-stat-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="hg-section hg-features-bg" id="features">
          <div className="hg-section-inner">
            <p className="hg-label">Core Features</p>
            <h2 className="hg-title">Everything You Need,<br />In One Platform</h2>
            <p className="hg-sub">Designed for doctors, hospitals, and patients — HealthGuard AI covers every aspect of modern patient engagement.</p>
            <div className="hg-features-grid">
              {[
                ['ic-blue','fa-brain','LSTM Adherence Prediction','Our deep learning model analyzes patient history to predict medication adherence and flag at-risk patients before they miss a dose.'],
                ['ic-green','fa-bell','Smart Reminders','Personalized reminder schedules based on patient behavior patterns. Real-time notifications via SMS, email, or in-app alerts.'],
                ['ic-purple','fa-chart-line','Doctor Dashboard','A powerful real-time dashboard for doctors to view all patients, track adherence scores, and take immediate action on alerts.'],
                ['ic-orange','fa-database','MongoDB Data Storage','All patient records, medication history, and health data are securely stored in MongoDB Atlas with encryption and fast queries.'],
                ['ic-pink','fa-shield-alt','Secure Authentication','Role-based login for patients and doctors. Passwords secured with bcrypt hashing. JWT-ready for future session management.'],
                ['ic-teal','fa-hospital','Hospital Integration','Hospitals can manage their entire doctor and patient network in a single platform, with department-level analytics and reporting.'],
              ].map(([ic, icon, title, desc]) => (
                <div className="hg-feature-card reveal" key={title}>
                  <div className={`hg-feature-icon ${ic}`}><i className={`fas ${icon}`}></i></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STATS BAND */}
        <div className="hg-stats-band">
          <div className="hg-stats-row">
            {[['c-blue','92%','Average Adherence Improvement'],['c-green','3x','Faster Patient Onboarding'],['c-purple','50ms','Average API Response Time'],['c-orange','24/7','Monitoring & Alerts']].map(([c,n,t]) => (
              <div className="reveal" key={t}>
                <div className={`hg-stat-num ${c}`}>{n}</div>
                <div className="hg-stat-text">{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <section className="hg-section" id="how">
          <div className="hg-section-inner">
            <p className="hg-label">Process</p>
            <h2 className="hg-title">How HealthGuard AI Works</h2>
            <p className="hg-sub">From registration to real-time care — our streamlined process gets patients supported in minutes.</p>
            <div className="hg-steps">
              {[
                ['sn-1','1','Doctor Registers','Doctors sign up with their license & specialization. Their profile is verified and stored in MongoDB.'],
                ['sn-2','2','Patient Onboarding','Doctors add patients directly from the dashboard. Patient records are created with medical history.'],
                ['sn-3','3','AI Analysis Runs','Our LSTM model analyses patterns to predict adherence risk and generate smart reminder schedules.'],
                ['sn-4','4','Real-time Monitoring','Doctors get live alerts when patients miss doses. Patients receive nudges through multiple channels.'],
              ].map(([cls, n, title, desc]) => (
                <div className="hg-step reveal" key={n}>
                  <div className={`hg-step-num ${cls}`}>{n}</div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROLES */}
        <section className="hg-section hg-features-bg" id="roles">
          <div className="hg-section-inner">
            <p className="hg-label">Access Portals</p>
            <h2 className="hg-title">Built for Everyone Involved</h2>
            <p className="hg-sub">Whether you're a patient managing your health or a doctor overseeing hundreds of patients, HealthGuard AI has a dedicated experience for you.</p>
            <div className="hg-roles-grid">
              <div className="hg-role-card hg-role-patient reveal">
                <div className="hg-role-emoji">🧑‍⚕️</div>
                <h3>For Patients</h3>
                <p>Access your personal health dashboard, view your medication schedule, check doctor notes, and never miss a reminder again.</p>
                <ul className="hg-role-list">
                  <li>View personalized medication schedule</li>
                  <li>Track your adherence score over time</li>
                  <li>Receive smart, timely reminders</li>
                  <li>Secure access with encrypted login</li>
                  <li>Stay connected with your doctor</li>
                </ul>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  <Link href="/login" className="hg-btn hg-btn-primary">Patient Login</Link>
                </div>
              </div>
              <div className="hg-role-card hg-role-doctor reveal">
                <div className="hg-role-emoji">👨‍⚕️</div>
                <h3>For Doctors</h3>
                <p>Manage your full patient panel, monitor live adherence data, add new patients, view health histories, and act on AI-generated alerts.</p>
                <ul className="hg-role-list">
                  <li>Full patient management dashboard</li>
                  <li>AI-generated adherence risk scores</li>
                  <li>Instant alerts for at-risk patients</li>
                  <li>Add & manage patient records easily</li>
                  <li>View detailed health reports & trends</li>
                </ul>
                <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
                  <Link href="/doctor-login" className="hg-btn hg-btn-green">Doctor Login</Link>
                  <Link href="/doctor-signup" className="hg-btn hg-btn-outline">Register as Doctor</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hg-cta">
          <h2>Ready to Transform<br /><span style={{color:'var(--hg-secondary-light)'}}>Patient Care?</span></h2>
          <p>Join thousands of healthcare professionals already using HealthGuard AI.</p>
          <div className="hg-cta-actions">
            <Link href="/doctor-login" className="hg-btn hg-btn-primary hg-btn-lg">
              <i className="fas fa-sign-in-alt"></i> Doctor Login
            </Link>
            <Link href="/doctor-signup" className="hg-btn hg-btn-green hg-btn-lg">
              <i className="fas fa-user-md"></i> Join as Doctor
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="hg-footer">
          <div className="hg-footer-inner">
            <div className="hg-footer-logo">🏥 HealthGuard AI</div>
            <div className="hg-footer-links">
              <Link href="/">Hospital</Link>
              <a href="#features">Features</a>
              <Link href="/login">Patient Login</Link>
              <Link href="/doctor-login">Doctor Login</Link>
            </div>
            <div className="hg-footer-copy">© 2026 HealthGuard AI. All rights reserved.</div>
          </div>
        </footer>

      </div>
    </>
  );
}
