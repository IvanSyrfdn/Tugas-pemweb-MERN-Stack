# 🚀 ITS EventHub

**ITS EventHub** adalah aplikasi web berbasis MERN Stack yang dirancang sebagai pusat agregator informasi acara di lingkungan Institut Teknologi Sepuluh Nopember (ITS). Platform ini bertujuan memusatkan publikasi acara kampus agar mudah diakses oleh seluruh civitas akademika.

## 🧐 Masalah yang Diselesaikan (Problem Statement)
Saat ini, informasi mengenai acara kampus (Seminar, Lomba, Workshop, Rekrutmen) tersebar tidak merata di berbagai kanal media sosial dan grup pesan instan. Hal ini menyebabkan:
1.  **Informasi Terpecah:** Mahasiswa sering melewatkan acara bermanfaat karena tidak mengikuti akun organisasi tertentu.
2.  **Kesulitan Pencarian:** Tidak ada fitur filter untuk mencari acara berdasarkan kategori minat.
3.  **Inefisiensi:** Penyelenggara acara (Himpunan/UKM) kesulitan menjangkau audiens di luar lingkaran mereka.

## 💡 Solusi yang Dibuat (Solution Overview)
ITS EventHub hadir sebagai solusi digital yang menawarkan:
* **Sentralisasi Data:** Satu platform untuk melihat semua agenda kampus.
* **Manajemen Mandiri:** Penyelenggara dapat mendaftar dan mengelola publikasi acara mereka sendiri.
* **Filter Kategori:** Memudahkan mahasiswa menemukan acara spesifik (misal: Akademik, Lomba, Hiburan).

## 🛠️ Tech Stack & Fitur Utama

### Tech Stack
* **Frontend:** React.js (Vite), Bootstrap 5, Axios, React Router.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (via Mongoose).
* **Authentication:** JWT (JSON Web Token) & BcryptJS.
* **File Management:** Multer (Upload Gambar Poster).

### Fitur Utama
1.  **Authentication:** Login dan Register aman untuk pengguna.
2.  **Event Management (CRUD):**
    * **Create:** Upload event baru dengan poster.
    * **Read:** Galeri event dengan tampilan kartu (*Card UI*) responsif.
    * **Update:** Edit informasi event dan ganti gambar poster.
    * **Delete:** Hapus event beserta file gambarnya dari server.
3.  **Category Filter:** Penyaringan event berdasarkan kategori secara *real-time*.
4.  **Responsive Design:** Tampilan antarmuka yang adaptif untuk Desktop dan Mobile.

## ⚙️ Cara Menjalankan Project (Setup Instructions)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di lokal komputer Anda.

### Prasyarat
* Node.js (v14+)
* MongoDB (Lokal atau Atlas)
* Git

### 1. Clone Repository

### 2. Set-up Server
```
cd server
npm install
```

#### buat .env file nya
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/its-eventhub
JWT_SECRET=rahasia_super_aman
```

### run server
```
npx nodemon server.js
```
### 3. Set-up Client
```
cd client
npm install
npm run dev
```
