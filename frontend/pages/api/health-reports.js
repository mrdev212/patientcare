import { connectDB } from '@/lib/mongodb';
import HealthReport from '@/models/HealthReport';

export default async function handler(req, res) {
  await connectDB();
  const { patientId, doctorId } = req.query;

  if (req.method === 'GET') {
    if (!patientId) return res.status(400).json({ error: 'patientId required' });
    try {
      const reports = await HealthReport.find({ patientId }).sort({ createdAt: -1 });
      return res.status(200).json({ reports });
    } catch { return res.status(500).json({ error: 'Failed to fetch reports' }); }
  }

  if (req.method === 'POST') {
    const { title, type, notes, result, reportDate, fileUrl } = req.body;
    if (!patientId || !doctorId || !title) return res.status(400).json({ error: 'patientId, doctorId and title are required' });
    try {
      const report = await HealthReport.create({ patientId, doctorId, title, type, notes, result, reportDate, fileUrl });
      return res.status(201).json({ message: 'Report added', report });
    } catch { return res.status(500).json({ error: 'Failed to add report' }); }
  }

  if (req.method === 'DELETE') {
    const { reportId } = req.body;
    if (!reportId) return res.status(400).json({ error: 'reportId required' });
    try {
      await HealthReport.findByIdAndDelete(reportId);
      return res.status(200).json({ message: 'Report deleted' });
    } catch { return res.status(500).json({ error: 'Failed to delete report' }); }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
