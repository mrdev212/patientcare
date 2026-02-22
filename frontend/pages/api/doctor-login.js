import { connectDB } from '@/lib/mongodb';
import Doctor from '@/models/Doctor';
import bcrypt from 'bcryptjs';
import { handleCors } from '@/lib/cors';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  try {
    // Find doctor with password field (select: false by default)
    const doctor = await Doctor.findOne({ email }).select('+password');

    if (!doctor) {
      return res.status(401).json({ code: 'email_not_found', error: 'Email id and password is not available in any doctor connection' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      return res.status(401).json({ code: 'wrong_password', error: 'Wrong password' });
    }

    // Success
    return res.status(200).json({
      message: 'Login successful',
      doctor: {
        id: doctor._id,
        email: doctor.email,
        name: doctor.name,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
      },
    });
  } catch (error) {
    console.error('Doctor login error:', error);
    return res.status(500).json({ error: 'Error during login' });
  }
}
