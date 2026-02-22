import { connectDB } from '@/lib/mongodb';
import Medication from '@/models/Medication';

export default async function handler(req, res) {
  await connectDB();
  const { patientId, doctorId } = req.query;

  if (req.method === 'GET') {
    try {
      let query = {};
      if (patientId) query.patientId = patientId;
      if (doctorId) query.doctorId = doctorId;
      
      if (!patientId && !doctorId) {
        return res.status(400).json({ error: 'patientId or doctorId required' });
      }

      const medications = await Medication.find(query).sort({ createdAt: -1 });
      return res.status(200).json({ medications });
    } catch { return res.status(500).json({ error: 'Failed to fetch medications' }); }
  }

  if (req.method === 'POST') {
    const { name, dosage, frequency, duration, instructions, startDate, endDate, status } = req.body;
    if (!patientId || !doctorId || !name) return res.status(400).json({ error: 'patientId, doctorId and name are required' });
    try {
      const med = await Medication.create({ patientId, doctorId, name, dosage, frequency, duration, instructions, startDate, endDate, status });
      return res.status(201).json({ message: 'Medication added', med });
    } catch { return res.status(500).json({ error: 'Failed to add medication' }); }
  }

  if (req.method === 'PUT') {
    const { medId, ...updates } = req.body;
    if (!medId) return res.status(400).json({ error: 'medId required' });
    try {
      const med = await Medication.findByIdAndUpdate(medId, updates, { new: true });
      return res.status(200).json({ message: 'Updated', med });
    } catch { return res.status(500).json({ error: 'Failed to update medication' }); }
  }

  if (req.method === 'DELETE') {
    const { medId } = req.body;
    if (!medId) return res.status(400).json({ error: 'medId required' });
    try {
      await Medication.findByIdAndDelete(medId);
      return res.status(200).json({ message: 'Medication deleted' });
    } catch { return res.status(500).json({ error: 'Failed to delete medication' }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
