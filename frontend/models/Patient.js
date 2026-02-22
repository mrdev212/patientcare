import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
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
  fullName: {
    type: String,
    required: [true, 'Please provide patient name'],
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: [true, 'Please provide gender'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
  },
  address: {
    type: String,
    required: [true, 'Please provide address'],
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Please provide doctor ID'],
  },
  medicalHistory: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Patient || mongoose.model('Patient', patientSchema);
