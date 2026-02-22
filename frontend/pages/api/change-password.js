import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();

  const { patientId, currentPassword, newPassword } = req.body;
  if (!patientId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'patientId, currentPassword and newPassword are required' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }

  try {
    const patient = await Patient.findById(patientId).select('+password');
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Verify current password
    const valid = await bcrypt.compare(currentPassword, patient.password);
    if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

    // Hash and save new password
    patient.password = await bcrypt.hash(newPassword, 10);
    await patient.save();

    // Send email: password changed notification
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#2563eb,#8b5cf6);padding:24px 32px;">
          <h1 style="margin:0;color:#fff;font-size:24px;">🏥 HealthGuard AI</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Password Changed Successfully</p>
        </div>
        <div style="padding:32px;">
          <h2 style="color:#60a5fa;margin-top:0;">Hello, ${patient.fullName} 👋</h2>
          <p style="color:#cbd5e1;line-height:1.7;">Your HealthGuard AI account password has been <strong>changed successfully</strong>.</p>
          <div style="background:rgba(37,99,235,0.1);border:1px solid rgba(37,99,235,0.3);border-radius:10px;padding:20px;margin:20px 0;">
            <p style="margin:0 0 10px;font-size:14px;color:#94a3b8;">YOUR NEW LOGIN DETAILS</p>
            <p style="margin:6px 0;"><strong style="color:#94a3b8;">Email:</strong> <span style="color:#e2e8f0;">${patient.email}</span></p>
            <p style="margin:6px 0;"><strong style="color:#94a3b8;">New Password:</strong> <span style="color:#34d399;font-size:18px;font-weight:bold;letter-spacing:2px;">${newPassword}</span></p>
          </div>
          <div style="margin-top:20px;padding:16px;background:rgba(239,68,68,0.08);border-left:3px solid #ef4444;border-radius:4px;">
            <p style="margin:0;font-size:13px;color:#fca5a5;">⚠️ If you did not make this change, contact your doctor immediately.</p>
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid rgba(148,163,184,0.1);text-align:center;">
          <p style="margin:0;font-size:12px;color:#475569;">© 2026 HealthGuard AI · Mumbai, India</p>
        </div>
      </div>
    `;

    const emailResult = await sendEmail({
      to: patient.email,
      subject: 'HealthGuard AI — Your Password Has Been Changed',
      html,
    });

    return res.status(200).json({
      message: 'Password changed successfully',
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ error: 'Failed to change password' });
  }
}
