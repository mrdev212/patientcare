import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to', to, '| MessageId:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    // If auth error, give a helpful message
    if (error.message.includes('Invalid login') || error.message.includes('Username and Password')) {
      return {
        success: false,
        error: 'Gmail auth failed. Please generate an App Password at myaccount.google.com/apppasswords and update EMAIL_PASS in .env.local',
      };
    }
    return { success: false, error: error.message };
  }
}
