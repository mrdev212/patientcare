import { connectDB } from '@/lib/mongodb';
import Reminder from '@/models/Reminder';
import { sendEmail } from '@/lib/email';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    const { doctorId } = req.query;
    try {
      const reminders = await Reminder.find({ doctorId }).sort({ sentAt: -1 });
      return res.status(200).json({ reminders });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch reminders' });
    }
  }

  if (req.method === 'POST') {
    const { doctorId, patientId, patientEmail, patientName, subject, message, frequency, interval, scheduledTime } = req.body;
    if (!doctorId || !patientEmail || !subject || !message) {
      return res.status(400).json({ error: 'doctorId, patientEmail, subject and message are required' });
    }
    try {
      // Create Reminder Schedule
      const reminder = await Reminder.create({ 
        doctorId, patientId, patientEmail, patientName, subject, message,
        frequency: frequency || 'once',
        interval: interval || 1,
        scheduledTime: scheduledTime || ''
      });

      // Send first email immediately
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#e2e8f0;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#10b981,#059669);padding:24px 32px;">
            <h1 style="margin:0;color:#fff;font-size:24px;">🏥 HealthGuard AI</h1>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Medication Reminder</p>
          </div>
          <div style="padding:32px;">
            <h2 style="color:#34d399;margin-top:0;">${subject}</h2>
            <p style="white-space:pre-line;line-height:1.7;color:#cbd5e1;">${message}</p>
            <div style="margin-top:28px;padding:16px;background:rgba(16,185,129,0.08);border-left:3px solid #10b981;border-radius:4px;">
              <p style="margin:0;font-size:13px;color:#94a3b8;">This is an automated reminder from your doctor.</p>
            </div>
          </div>
        </div>
      `;
      const emailResult = await sendEmail({ to: patientEmail, subject, html });
      const emailSent = emailResult.success;
      
      if (emailSent) {
        reminder.lastSent = new Date();
        await reminder.save();
      }

      return res.status(201).json({
        message: frequency && frequency !== 'once' 
          ? `Reminder scheduled & first email sent to ${patientEmail}` 
          : (emailSent ? `Reminder sent to ${patientEmail}` : 'Reminder logged (email failed)'),
        reminder,
        emailSent
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create reminder' });
    }
  }

  if (req.method === 'PUT') {
    const { reminderId, ...updates } = req.body;
    if (!reminderId) return res.status(400).json({ error: 'reminderId required' });
    try {
      const reminder = await Reminder.findByIdAndUpdate(reminderId, updates, { new: true });
      return res.status(200).json({ message: 'Reminder updated', reminder });
    } catch { return res.status(500).json({ error: 'Failed to update reminder' }); }
  }

  if (req.method === 'DELETE') {
    const { reminderId } = req.body;
    if (!reminderId) return res.status(400).json({ error: 'reminderId required' });
    try {
      await Reminder.findByIdAndDelete(reminderId);
      return res.status(200).json({ message: 'Reminder deleted' });
    } catch { return res.status(500).json({ error: 'Failed to delete reminder' }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
