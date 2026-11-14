// Aktivitas 2 - Routing dengan Parameter Dinamis
const express = require('express');
const app = express();

app.get('/produk/:kode', (req, res) => {
  res.send('Produk dengan kode: ' + req.params.kode);
});

app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));