import mongoose from 'mongoose';
import validator from 'validator';

const adminSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: { type: String, default: 'admin' }
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;