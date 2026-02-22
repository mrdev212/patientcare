import { connectDB } from '@/lib/mongodb';
import Appointment from '@/models/Appointment';
import { handleCors } from '@/lib/cors';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  await connectDB();

  const { doctorId } = req.query;

  if (req.method === 'GET') {
    try {
      const appointments = await Appointment.find({ doctorId }).sort({ date: 1, time: 1 });
      return res.status(200).json({ appointments });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  }

  if (req.method === 'POST') {
    const { patientId, patientName, patientEmail, date, time, reason } = req.body;
    if (!patientId || !date || !time) return res.status(400).json({ error: 'patientId, date and time are required' });
    try {
      const appt = await Appointment.create({ doctorId, patientId, patientName, patientEmail, date, time, reason });
      return res.status(201).json({ message: 'Appointment scheduled', appt });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to schedule appointment' });
    }
  }

  if (req.method === 'PUT') {
    const { apptId, status } = req.body;
    try {
      const appt = await Appointment.findByIdAndUpdate(apptId, { status }, { new: true });
      return res.status(200).json({ message: 'Appointment updated', appt });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update appointment' });
    }
  }

  if (req.method === 'DELETE') {
    const { apptId } = req.body;
    try {
      await Appointment.findByIdAndDelete(apptId);
      return res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete appointment' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
