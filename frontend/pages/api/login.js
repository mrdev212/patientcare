import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await connectDB();
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Please provide email and password' });

  try {
    // 1. Check Patient model first (created by doctor)
    const patient = await Patient.findOne({ email }).select('+password');
    if (patient) {
      const valid = await bcrypt.compare(password, patient.password);
      if (!valid) return res.status(401).json({ code: 'wrong_password', error: 'Incorrect password. Please try again.' });
      return res.status(200).json({
        message: 'Login successful',
        patient: {
          id: patient._id,
          _id: patient._id,
          email: patient.email,
          fullName: patient.fullName,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone,
          address: patient.address,
          doctorId: patient.doctorId,
          medicalHistory: patient.medicalHistory,
        },
      });
    }

    // 2. Fallback: check User model
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ code: 'email_not_found', error: 'Email id and password is not available in any doctor connection' });
    const validUser = await bcrypt.compare(password, user.password);
    if (!validUser) return res.status(401).json({ code: 'wrong_password', error: 'Wrong password' });
    return res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Error during login' });
  }
}
