import { connectDB } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import Appointment from '@/models/Appointment';
import Medication from '@/models/Medication';
import HealthReport from '@/models/HealthReport';
import Doctor from '@/models/Doctor';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { patientId } = req.query;
  if (!patientId) return res.status(400).json({ error: 'patientId required' });

  await connectDB();

  try {
    const [patient, appointments, medications, reports] = await Promise.all([
      Patient.findById(patientId).lean(),
      Appointment.find({ patientId }).sort({ date: -1 }).lean(),
      Medication.find({ patientId }).sort({ createdAt: -1 }).lean(),
      HealthReport.find({ patientId }).sort({ createdAt: -1 }).lean(),
    ]);

    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    // Get doctor info
    let doctor = null;
    if (patient.doctorId) {
      doctor = await Doctor.findById(patient.doctorId).select('name specialization email phone').lean();
    }

    return res.status(200).json({ patient, doctor, appointments, medications, reports });
  } catch (error) {
    console.error('Patient dashboard error:', error);
    return res.status(500).json({ error: 'Failed to load dashboard data' });
  }
}
