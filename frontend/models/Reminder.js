import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientEmail: { type: String, required: true },
  patientName: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  frequency: { type: String, enum: ['once', 'hourly', 'daily', 'custom-days'], default: 'once' },
  interval: { type: Number, default: 1 }, // hours or days
  scheduledTime: { type: String, default: '' }, // e.g., '09:00'
  status: { type: String, enum: ['active', 'paused', 'completed'], default: 'active' },
  lastSent: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
