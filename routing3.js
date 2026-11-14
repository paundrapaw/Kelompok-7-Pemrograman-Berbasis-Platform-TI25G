// Aktivitas 3 - Simulasi CRUD Routing
const express = require('express');
const app = express();

app.post('/users', (req, res) => {
  res.send('Tambah data user baru');
});

app.put('/users/:id', (req, res) => {
  res.send('Update data user dengan ID: ' + req.params.id);
});

app.delete('/users/:id', (req, res) => {
  res.send('Hapus user dengan ID: ' + req.params.id);
});

app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));