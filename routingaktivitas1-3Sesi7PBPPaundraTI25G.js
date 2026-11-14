
const express = require('express');
const app = express();

const PORT = 3000;

// Middleware untuk membaca JSON
app.use(express.json());

// Data awal pengguna
let users = [
    { id: 1, nama: "Paundra Rizky Pratama" },
    { id: 2, nama: "Prayogi Ananta Sadiko" },
    { id: 3, nama: "Muhammad Jannah" }
];

// Data kelompok
const namaTim = "Kelompok Informatika";

const anggota = [
    { id: 1, nama: "Paundra Rizky Pratama" },
    { id: 2, nama: "Prayogi Ananta Sadiko" },
    { id: 3, nama: "Muhammad Jannah" }
];

// =================================
// AKTIVITAS 1 - ROUTING DASAR
// =================================

app.get('/', (req, res) => {
    res.send('Selamat Datang di Halaman Utama!');
});

app.get('/Tentang', (req, res) => {
    res.send('Ini adalah halaman Tentang.');
});

app.get('/Kontak', (req, res) => {
    res.send('Ini adalah halaman Kontak.');
});

// =================================
// AKTIVITAS 2 - PARAMETER DINAMIS
// =================================

app.get('/produk/:kode', (req, res) => {
    const kode = req.params.kode;

    res.send('Produk dengan kode: ' + kode);
});

// =================================
// AKTIVITAS 3 - SIMULASI CRUD
// =================================

// GET - Menampilkan semua pengguna
app.get('/users', (req, res) => {
    res.json(users);
});

// GET - Menampilkan pengguna berdasarkan ID
app.get('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            pesan: 'User tidak ditemukan'
        });
    }

    res.json(user);
});

// POST - Menambahkan pengguna
app.post('/users', (req, res) => {
    const { nama } = req.body;

    if (!nama) {
        return res.status(400).json({
            pesan: 'Nama harus diisi'
        });
    }

    const idBaru = users.length > 0
        ? Math.max(...users.map(u => u.id)) + 1
        : 1;

    const userBaru = {
        id: idBaru,
        nama: nama
    };

    users.push(userBaru);

    res.status(201).json({
        pesan: 'User berhasil ditambahkan',
        data: userBaru
    });
});

// PUT - Mengubah data pengguna
app.put('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({
            pesan: 'User tidak ditemukan'
        });
    }

    const { nama } = req.body;

    if (!nama) {
        return res.status(400).json({
            pesan: 'Nama baru harus diisi'
        });
    }

    user.nama = nama;

    res.json({
        pesan: 'User berhasil diperbarui',
        data: user
    });
});

// DELETE - Menghapus pengguna
app.delete('/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({
            pesan: 'User tidak ditemukan'
        });
    }

    const userDihapus = users.splice(index, 1);

    res.json({
        pesan: 'User berhasil dihapus',
        data: userDihapus[0]
    });
});

// =================================
// AKTIVITAS 4 - MY TEAM ROUTER
// =================================

// Route halaman utama
app.get('/', (req, res) => {
    res.send('Selamat datang di server kelompok ' + namaTim);
});

// Route anggota berdasarkan nama
app.get('/team/:nama', (req, res) => {
    const nama = req.params.nama;

    res.send(
        'Hai, saya ' + nama +
        ' dari kelompok ' + namaTim
    );
});

// Route informasi anggota kelompok
app.get('/info', (req, res) => {
    res.json({
        nama_kelompok: namaTim,
        daftar_anggota: anggota
    });
});

// Redirect dari /data ke /info
app.get('/data', (req, res) => {
    res.redirect('/info');
});

// =================================
// MENJALANKAN SERVER
// =================================

app.listen(PORT, () => {
    console.log('Server berjalan di http://localhost:' + PORT);
});
