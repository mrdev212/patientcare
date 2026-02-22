import mongoose from 'mongoose';

const healthReportSchema = new mongoose.Schema({
  patientId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
  title:      { type: String, required: true },   // e.g. "Blood Test Report"
  type:       { type: String, default: 'General' }, // Blood Test, X-Ray, ECG, etc.
  notes:      { type: String, default: '' },
  result:     { type: String, default: '' },       // Normal / Abnormal / Pending
  fileUrl:    { type: String, default: '' },       // optional file link
  reportDate: { type: String, default: '' },
  createdAt:  { type: Date, default: Date.now },
});

export default mongoose.models.HealthReport || mongoose.model('HealthReport', healthReportSchema);
