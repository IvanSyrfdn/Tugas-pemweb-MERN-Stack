require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Biar bisa baca JSON dari body request
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Folder uploads jadi public

// Test Route
app.get('/', (req, res) => {
  res.send('API ITS EventHub Running...');
});
app.use('/api/auth', require('./routes/authRoutes')); // <--- Tambahkan ini
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes')); // <--- TAMBAHKAN INI


// Connection & Listen
const PORT = process.env.PORT || 5000;

// Kita panggil fungsi connectDB nanti
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server berjalan di port ${PORT}`);
    });
});