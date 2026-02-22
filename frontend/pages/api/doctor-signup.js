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

  const { email, password, confirmPassword, name, specialization, licenseNumber } = req.body;

  // Validation
  if (!email || !password || !confirmPassword || !name || !specialization || !licenseNumber) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create doctor
    const doctor = await Doctor.create({
      email,
      password: hashedPassword,
      name,
      specialization,
      licenseNumber,
    });

    return res.status(201).json({
      message: 'Doctor account created successfully',
      doctor: {
        id: doctor._id,
        email: doctor.email,
        name: doctor.name,
      },
    });
  } catch (error) {
    console.error('Doctor signup error:', error);
    return res.status(500).json({ error: 'Error creating doctor account' });
  }
}
