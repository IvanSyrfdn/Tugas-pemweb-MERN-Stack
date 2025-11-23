const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Panggil model User yg tadi dibuat

// @route   POST /api/auth/register
// @desc    Register user baru
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        // 1. Cek apakah email sudah ada
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email sudah terdaftar' });
        }

        // 2. Buat object user baru
        user = new User({
            name,
            email,
            password,
            role // 'mahasiswa' atau 'panitia'
        });

        // 3. Enkripsi (Hash) Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Simpan ke Database
        await user.save();

        // 5. Return response sukses
        res.status(201).json({ msg: 'Registrasi berhasil, silakan login' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auth/login
// @desc    Login user & dapatkan Token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Cek apakah user ada?
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Email tidak ditemukan' });
        }

        // 2. Cek apakah password cocok? (compare hash)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Password salah' });
        }

        // 3. Buat Token (JWT)
        // Payload adalah data yg disimpan dalam token (misal ID dan Role)
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        // Sign token dengan JWT_SECRET dari .env
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }, // Token valid 1 hari
            (err, token) => {
                if (err) throw err;
                // Kirim token dan data user ke frontend
                res.json({ 
                    token, 
                    user: { id: user.id, name: user.name, role: user.role } 
                });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;