
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
dotenv.config({ path: path.join(__dirname, '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

async function checkDoctor() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to DB successfully!');
    
    // Check for specific doctor
    const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', new mongoose.Schema({ email: String }));
    const doctor = await Doctor.findOne({ email: 'zishanansari12@gmail.com' });
    
    if (doctor) {
      console.log('👨‍⚕️ Doctor found in DB:', doctor._id);
    } else {
      console.log('ℹ️ Doctor "zishanansari12@gmail.com" does not exist in DB yet.');
    }
    
    process.exit(0);
  } catch (err) {
    if (err.message.includes('IP address')) {
      console.error('❌ Connection Denied: Your IP is still blocked by MongoDB Atlas.');
    } else {
      console.error('❌ Error:', err.message);
    }
    process.exit(1);
  }
}

checkDoctor();
