import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctorId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor',  required: true },
  name:      { type: String, required: true },
  dosage:    { type: String, default: '' },       // e.g. "500mg"
  frequency: { type: String, default: '' },       // e.g. "Twice daily"
  duration:  { type: String, default: '' },       // e.g. "7 days"
  instructions: { type: String, default: '' },    // e.g. "Take after food"
  status:    { type: String, enum: ['active', 'completed', 'stopped'], default: 'active' },
  startDate: { type: String, default: '' },
  endDate:   { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Medication || mongoose.model('Medication', medicationSchema);
