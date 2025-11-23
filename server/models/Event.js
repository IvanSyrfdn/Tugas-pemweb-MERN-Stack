const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  organizer: {
    type: String, // Misal: "HMIT", "BEM FTEIC"
    required: true
  },
  category: {
    type: String,
    enum: ['Seminar', 'Workshop', 'Lomba', 'Hiburan', 'Lainnya'],
    default: 'Lainnya'
  },
  image: {
    type: String, // Kita simpan path/nama filenya saja. Contoh: "uploads/poster-123.jpg"
    required: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Relasi ke ID User
    ref: 'User',
    required: true // Setiap event harus jelas siapa pemiliknya
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);