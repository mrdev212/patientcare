import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import { handleCors } from '@/lib/cors';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;
  await connectDB();

  const { doctorId } = req.query;

  // GET all patients for a doctor
  if (req.method === 'GET') {
    try {
      const patients = await Patient.find({ doctorId }).sort({ createdAt: -1 });
      return res.status(200).json({ patients });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch patients' });
    }
  }

  // PUT update patient
  if (req.method === 'PUT') {
    const { patientId, fullName, age, gender, phone, address, medicalHistory } = req.body;
    try {
      const patient = await Patient.findByIdAndUpdate(
        patientId,
        { fullName, age, gender, phone, address, medicalHistory },
        { new: true }
      );
      return res.status(200).json({ message: 'Patient updated', patient });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update patient' });
    }
  }

  // DELETE patient
  if (req.method === 'DELETE') {
    const { patientId } = req.body;
    try {
      await Patient.findByIdAndDelete(patientId);
      return res.status(200).json({ message: 'Patient deleted' });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete patient' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
