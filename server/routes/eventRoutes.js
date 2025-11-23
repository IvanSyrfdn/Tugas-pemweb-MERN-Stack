const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Panggil middleware yg baru dibuat
const Event = require('../models/Event');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // <--- Tambahkan ini

// --- KONFIGURASI MULTER (UPLOAD GAMBAR) ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // File akan disimpan di folder 'server/uploads'
    },
    filename: function (req, file, cb) {
        // Namai file: timestamp + ekstensi asli (biar unik)
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Filter biar cuma bisa upload gambar
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Format file harus JPG atau PNG'), false);
    }
};

const upload = multer({ 
    storage: storage, 
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit 5MB
    fileFilter: fileFilter
});

// --- ROUTES ---

// @route   POST /api/events
// @desc    Buat Event Baru (Create)
// @access  Private (Hanya user login)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        // Cek Role (Opsional: Kalau mau cuma 'panitia' yg bisa post)
        if (req.user.role !== 'panitia') {
           // return res.status(403).json({ msg: 'Hanya panitia yang boleh buat event!' });
           // Catatan: Saya komen dulu biar kamu bisa tes pakai akun 'mahasiswa' juga kalau mau.
        }

        const { title, description, date, location, category, organizer, linkPendaftaran } = req.body;

        // Buat object Event baru
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            category,
            organizer,
            linkPendaftaran,
            image: req.file ? req.file.path : '', // Simpan path gambar
            user: req.user.id // ID user yang login
        });

        const event = await newEvent.save();
        res.json(event);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/events
// @desc    Ambil Semua Event (Read)
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Sort tanggal terbaru (-1) dan populate data user (biar tau siapa yg post)
        const events = await Event.find().sort({ date: 1 }).populate('user', 'name');
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/events/:id
// @desc    Hapus Event
// @access  Private (Hanya pemilik yg bisa hapus)
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Cek apakah user yg request == user yg buat event
        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await event.deleteOne();
        res.json({ msg: 'Event removed' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/events/:id
// @desc    Hapus Event & File Gambarnya
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Cek User Authorized
        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // --- KODE BARU MULAI DI SINI ---
        
        // Cek apakah ada path gambar di database
        if (event.image) {
            // Tentukan lokasi file asli di komputer
            // __dirname = folder routes. '../' = mundur ke folder server.
            const filePath = path.join(__dirname, '../', event.image);

            // Hapus file fisik menggunakan fs.unlink
            fs.unlink(filePath, (err) => {
                if (err) {
                    // Kalau file tidak ketemu (misal udah kehapus manual), biarkan saja jangan error
                    console.error("Gagal menghapus file gambar (mungkin file tidak ada):", err);
                } else {
                    console.log("File gambar berhasil dihapus:", filePath);
                }
            });
        }
        
        // --- KODE BARU SELESAI ---

        await event.deleteOne();
        res.json({ msg: 'Event removed along with its image' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/events/:id
// @desc    Update Event
// @access  Private
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // Cek Kepemilikan
        if (event.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Ambil data baru dari body
        const { title, description, date, location, category, organizer } = req.body;

        // Update field
        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.location = location || event.location;
        event.category = category || event.category;
        event.organizer = organizer || event.organizer;

        // Cek jika ada gambar baru yang diupload
        if (req.file) {
            // 1. Hapus gambar lama fisik
            const oldImagePath = path.join(__dirname, '../', event.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            // 2. Set gambar baru
            event.image = req.file.path;
        }

        await event.save();
        res.json(event);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// ... kode route GET / (ambil semua) sebelumnya ...

// @route   GET /api/events/:id
// @desc    Ambil 1 Event berdasarkan ID (Untuk Edit)
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event tidak ditemukan' });
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Event tidak ditemukan' });
        }
        res.status(500).send('Server Error');
    }
});

// ... kode route DELETE / PUT lainnya ...

module.exports = router;