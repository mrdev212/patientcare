import { connectDB } from '@/lib/mongodb';
import Feedback from '@/models/Feedback';
import { handleCors } from '@/lib/cors';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { name, email, phone, department, rating, message } = req.body;

  if (!name || !email || !rating || !message) {
    return res.status(400).json({ error: 'Please provide name, email, rating and message' });
  }

  try {
    const feedback = await Feedback.create({ name, email, phone, department, rating, message });
    return res.status(201).json({ message: 'Feedback submitted successfully', id: feedback._id });
  } catch (error) {
    console.error('Feedback error:', error);
    return res.status(500).json({ error: 'Error saving feedback' });
  }
}
