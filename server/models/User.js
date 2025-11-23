const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Email tidak boleh kembar
  },
  password: {
    type: String,
    required: true // Nanti akan kita hash, bukan plain text
  },
  role: {
    type: String,
    enum: ['mahasiswa', 'panitia'], // Kita batasi cuma 2 role ini
    default: 'mahasiswa'
  }
}, {
  timestamps: true // Otomatis buat field createdAt dan updatedAt
});

module.exports = mongoose.model('User', userSchema);