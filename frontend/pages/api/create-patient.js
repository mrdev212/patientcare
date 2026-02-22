import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

function generatePassword(length = 10) {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#!';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const { doctorId, fullName, email, age, gender, phone, address, medicalHistory, password: customPassword } = req.body;

  if (!doctorId || !fullName || !email) {
    return res.status(400).json({ error: 'doctorId, fullName and email are required' });
  }

  try {
    // Check if patient already exists
    const existing = await Patient.findOne({ email });
    if (existing) return res.status(400).json({ error: 'A patient with this email already exists' });

    // Use doctor-provided password or auto-generate
    const plainPassword = customPassword || generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create patient record
    const patient = await Patient.create({
      fullName,
      email,
      password: hashedPassword,
      age: age || 0,
      gender: gender || 'Other',
      phone: phone || '',
      address: address || '',
      medicalHistory: medicalHistory || '',
      doctorId,
    });

    // Send welcome email with credentials
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#2563eb,#8b5cf6);padding:24px 32px;">
          <h1 style="margin:0;color:#fff;font-size:24px;">🏥 HealthGuard AI</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your Patient Account is Ready</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#60a5fa;margin-top:0;">Welcome, ${fullName}! 👋</h2>
          <p style="color:#cbd5e1;line-height:1.7;">Your doctor has registered you on <strong>HealthGuard AI</strong>. Below are your login credentials:</p>
          <div style="background:rgba(37,99,235,0.1);border:1px solid rgba(37,99,235,0.3);border-radius:10px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 10px;font-size:14px;color:#94a3b8;">YOUR LOGIN DETAILS</p>
            <p style="margin:6px 0;"><strong style="color:#94a3b8;">Email:</strong> <span style="color:#e2e8f0;">${email}</span></p>
            <p style="margin:6px 0;"><strong style="color:#94a3b8;">Password:</strong> <span style="color:#34d399;font-size:18px;font-weight:bold;letter-spacing:2px;">${plainPassword}</span></p>
          </div>
          <p style="color:#94a3b8;font-size:13px;">Please log in at <a href="${process.env.NEXTAUTH_URL}/login" style="color:#60a5fa;">${process.env.NEXTAUTH_URL}/login</a> and change your password after first login.</p>
          <div style="margin-top:24px;padding:16px;background:rgba(16,185,129,0.08);border-left:3px solid #10b981;border-radius:4px;">
            <p style="margin:0;font-size:13px;color:#94a3b8;">⚠️ Do not share these credentials with anyone. This email was sent automatically by your doctor's system.</p>
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(148,163,184,0.1);text-align:center;">
          <p style="margin:0;font-size:12px;color:#475569;">© 2026 HealthGuard AI · Mumbai, India</p>
        </div>
      </div>
    `;

    const emailResult = await sendEmail({
      to: email,
      subject: `Welcome to HealthGuard AI — Your Login Credentials`,
      html,
    });

    return res.status(201).json({
      message: 'Patient created successfully',
      patient: { _id: patient._id, fullName, email, defaultPassword: plainPassword },
      emailSent: emailResult.success,
      emailError: emailResult.success ? null : emailResult.error,
    });
  } catch (error) {
    console.error('Create patient error:', error);
    return res.status(500).json({ error: 'Failed to create patient' });
  }
}
