import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Please provide doctor name'],
  },
  specialization: {
    type: String,
    required: [true, 'Please provide specialization'],
  },
  licenseNumber: {
    type: String,
    required: [true, 'Please provide license number'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
