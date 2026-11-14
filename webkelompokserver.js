const http = require('http');
const os = require('os');
const port = 8000;

// ====================== DATA & STATISTIK ======================
const waktuMulai = new Date();
let totalRequest = 0;
const hitPerRoute = {};
const logRequest = [];
const bukuTamu = [];

const anggota = [
  { no: 1, nama: "Nayshila Azzahra", peran: "Anggota" },
  { no: 2, nama: "Nazla Dwi Ananda", peran: "Anggota" },
  { no: 3, nama: "Paundra Rizky Pratama", peran: "Anggota" },
  { no: 4, nama: "Prayogi Ananta Sadiko", peran: "Anggota" },
];

const siswa = [
  { nim: "20250040055", nama: "Chikal", kelas: "TI25A" },
  { nim: "20250040014", nama: "Regith", kelas: "TI25I" },
  { nim: "20250040179", nama: "Nayara", kelas: "TI25I" },
  { nim: "20250040072", nama: "Reno", kelas: "TI25B" },
  { nim: "20250040057", nama: "Musyaraf", kelas: "TI25G" },
  { nim: "20250040012", nama: "Anmas", kelas: "TI25A" },
  { nim: "20250040011", nama: "Farhan", kelas: "TI25E" },
  { nim: "20250040134", nama: "Novia", kelas: "TI25B" },
  { nim: "20250040078", nama: "Amara", kelas: "TI25C" },
  { nim: "20250040042", nama: "Paundra", kelas: "TI25G" },
  { nim: "20250040053", nama: "Juwita", kelas: "TI25A" },
  { nim: "20250040018", nama: "Galang", kelas: "TI25E" },
  { nim: "20250040177", nama: "Nadhif", kelas: "TI25B" },
  { nim: "20250040076", nama: "Nazla", kelas: "TI25G" },
  { nim: "20250040057", nama: "Prayogi", kelas: "TI25G" },
  { nim: "20250040059", nama: "Nickxen", kelas: "TI25A" },
  { nim: "20250040017", nama: "Nayshila", kelas: "TI25G" },
  { nim: "20250040170", nama: "Syifa", kelas: "TI25I" },
  { nim: "20250040073", nama: "Mira", kelas: "TI25B" },
  { nim: "20250040056", nama: "Ilham", kelas: "TI25E" },
];

const dosen = [
  { nama: "Shinta Ayuningtias", matkul: "Pemrograman Berbasis Platform" },
  { nama: "Aditiya", matkul: "Interaksi Manusia dan Komputer" },
  { nama: "Kamdan Rahmat", matkul: "Jaringan Komputer" },
  { nama: "Moneyta", matkul: "Rekayasa Perangkat Lunak" },
  { nama: "Lusiana", matkul: "Metode Numerik" },
  { nama: "Barkah", matkul: "Bahasa Indonesia dan Budaya" },
];

const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

const jadwal = [
  { hari: 1, jam: "08:00 - 10:30", matkul: "Pemrograman Berbasis Platform", dosen: "Shinta Ayuningtias", ruang: "B5F" },
  { hari: 1, jam: "13:00 - 15:30", matkul: "Metode Numerik", dosen: "Lusiana", ruang: "B4F" },
  { hari: 2, jam: "08:00 - 10:30", matkul: "Interaksi Manusia dan Komputer", dosen: "Aditiya", ruang: "B4B" },
  { hari: 3, jam: "10:00 - 12:30", matkul: "Jaringan Komputer", dosen: "Kamdan Rahmat", ruang: "Smartclass" },
  { hari: 4, jam: "08:00 - 10:30", matkul: "Rekayasa Perangkat Lunak", dosen: "Moneyta", ruang: "B4H" },
  { hari: 5, jam: "08:00 - 09:40", matkul: "Bahasa Indonesia dan Budaya", dosen: "Barkah", ruang: "B4D" },
];

const kuis = [
  { tanya: "Kode status HTTP untuk halaman yang tidak ditemukan?", opsi: ["200", "404", "500", "301"], benar: 1 },
  { tanya: "Modul bawaan Node.js untuk membuat web server?", opsi: ["fs", "path", "http", "url"], benar: 2 },
  { tanya: "Metode HTTP yang umum dipakai untuk mengambil data?", opsi: ["GET", "POST", "PUT", "DELETE"], benar: 0 },
  { tanya: "Format data yang paling umum dipakai pada REST API?", opsi: ["JSON", "BMP", "MP3", "EXE"], benar: 0 },
  { tanya: "Port default protokol HTTP (tanpa enkripsi)?", opsi: ["21", "22", "80", "443"], benar: 2 },
  { tanya: "Perintah untuk menjalankan file server.js dengan Node?", opsi: ["run server.js", "node server.js", "start server.js", "npm server.js"], benar: 1 },
];

// ====================== FUNGSI BANTU ======================
function esc(teks) {
  return String(teks)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function formatDurasi(detik) {
  const h = Math.floor(detik / 86400);
  const j = Math.floor((detik % 86400) / 3600);
  const m = Math.floor((detik % 3600) / 60);
  const d = detik % 60;
  return (h ? h + ' hari ' : '') + j + ' jam ' + m + ' menit ' + d + ' detik';
}

function dataInfo() {
  const detik = Math.floor((Date.now() - waktuMulai.getTime()) / 1000);
  return {
    waktuSekarang: new Date().toLocaleString('id-ID'),
    waktuMulai: waktuMulai.toLocaleString('id-ID'),
    uptime: formatDurasi(detik),
    totalRequest: totalRequest,
    nodeVersion: process.version,
    platform: os.platform() + ' (' + os.arch() + ')',
    jumlahCPU: os.cpus().length,
    memoriDipakaiMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    memoriTotalMB: Math.round(os.totalmem() / 1024 / 1024),
    port: port
  };
}

const menu = [
  { href: '/', label: 'Beranda', key: '/' },
  { href: '/mahasiswa', label: 'Mahasiswa', key: '/mahasiswa' },
  { href: '/dosen', label: 'Dosen', key: '/dosen' },
  { href: '/jadwal', label: 'Jadwal', key: '/jadwal' },
  { href: '/statistik', label: 'Statistik', key: '/statistik' },
  { href: '/kuis', label: 'Kuis', key: '/kuis' },
  { href: '/kalkulator', label: 'Kalkulator', key: '/kalkulator' },
  { href: '/acak', label: 'Acak', key: '/acak' },
  { href: '/jamdunia', label: 'Jam Dunia', key: '/jamdunia' },
  { href: '/bukutamu', label: 'Buku Tamu', key: '/bukutamu' },
  { href: '/admin', label: 'Admin', key: '/admin' },
  { href: '/info', label: 'Info', key: '/info' },
  { href: '/anggota?format=html', label: 'Anggota', key: '/anggota' },
  { href: '/data', label: 'Data (JSON)', key: '/data' }
];

function halaman(judul, isi, aktif, skrip) {
  const nav = menu.map(function (m) {
    return '<a href="' + m.href + '"' +
      (m.key === aktif ? ' class="aktif"' : '') + '>' +
      m.label + '</a>';
  }).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(judul)}</title>
<style>
:root { --bg:#f6f7f9; --kartu:#ffffff; --teks:#1f2937; --redup:#6b7280; --garis:#e5e7eb; --aksen:#2563eb; --hijau:#16a34a; --merah:#dc2626; }
[data-theme="dark"] { --bg:#111827; --kartu:#1f2937; --teks:#f3f4f6; --redup:#9ca3af; --garis:#374151; --aksen:#60a5fa; --hijau:#4ade80; --merah:#f87171; }
* { box-sizing:border-box; }
body { font-family:Arial,sans-serif; background:var(--bg); color:var(--teks); margin:0; line-height:1.6; }
.wrap { max-width:860px; margin:0 auto; padding:16px; }
header { display:flex; flex-wrap:wrap; align-items:center; gap:8px; padding:12px 0; border-bottom:1px solid var(--garis); }
nav { display:flex; flex-wrap:wrap; gap:6px; flex:1; }
nav a { padding:6px 12px; border-radius:6px; text-decoration:none; color:var(--teks); }
nav a:hover { background:var(--garis); }
nav a.aktif { background:var(--aksen); color:#fff; }
button { cursor:pointer; border:1px solid var(--garis); background:var(--kartu); color:var(--teks); padding:6px 12px; border-radius:6px; font-size:15px; }
button:hover { border-color:var(--aksen); }
button.utama { background:var(--aksen); color:#fff; border-color:var(--aksen); }
h2 { margin-top:24px; }
.kartu { background:var(--kartu); border:1px solid var(--garis); border-radius:10px; padding:16px; margin:12px 0; }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:12px; }
.grid a { text-decoration:none; color:inherit; }
.grid .kartu:hover { border-color:var(--aksen); }
.redup { color:var(--redup); font-size:14px; }
.besar { font-size:28px; font-weight:bold; }
table { width:100%; border-collapse:collapse; background:var(--kartu); }
th,td { text-align:left; padding:8px 10px; border-bottom:1px solid var(--garis); }
th { color:var(--redup); font-weight:normal; font-size:14px; }
input[type=text],input[type=number],textarea { width:100%; padding:8px 10px; border:1px solid var(--garis); border-radius:6px; background:var(--kartu); color:var(--teks); font-family:inherit; font-size:15px; }
code { background:var(--garis); padding:1px 6px; border-radius:4px; }
.bar-wrap { background:var(--garis); border-radius:6px; height:22px; overflow:hidden; }
.bar { background:var(--aksen); height:100%; border-radius:6px; }
.baris-bar { display:grid; grid-template-columns:70px 1fr 40px; gap:10px; align-items:center; margin:8px 0; }
tr.hariini td { background:rgba(37,99,235,.12); font-weight:bold; }
.pilihan { display:block; width:100%; text-align:left; margin:6px 0; padding:10px 12px; }
.pilihan.benar { border-color:var(--hijau); color:var(--hijau); }
.pilihan.salah { border-color:var(--merah); color:var(--merah); }
.kalk { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; max-width:320px; }
.kalk button { padding:14px 0; font-size:18px; }
#layar { font-size:28px; text-align:right; max-width:320px; margin-bottom:8px; }
.pesan { border-bottom:1px solid var(--garis); padding:8px 0; }
.kelompok { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:10px; }
</style>
</head>
<body>
<div class="wrap">
<header>
<nav>${nav}</nav>
<button id="tema" type="button">Mode Gelap</button>
</header>
<h2>${esc(judul)}</h2>
${isi}
</div>
<script>
(function () {
  var tombol = document.getElementById('tema');
  function terapkan(t) {
    document.documentElement.setAttribute('data-theme', t);
    tombol.textContent = t === 'dark' ? 'Mode Terang' : 'Mode Gelap';
  }
  var tema = 'light';
  try { tema = localStorage.getItem('tema') || 'light'; } catch (e) {}
  terapkan(tema);
  tombol.addEventListener('click', function () {
    tema = tema === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('tema', tema); } catch (e) {}
    terapkan(tema);
  });
})();
</script>
${skrip || ''}
</body>
</html>`;
}

function kirimHTML(res, status, html) {
  res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function kirimJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data, null, 2));
}

// ====================== SERVER ======================
const server = http.createServer((req, res) => {
  const mulai = Date.now();
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname;

  res.on('finish', () => {
    if (path.startsWith('/api/')) return;
    totalRequest++;
    hitPerRoute[path] = (hitPerRoute[path] || 0) + 1;

    const ms = Date.now() - mulai;
    logRequest.unshift({
      waktu: new Date().toLocaleTimeString('id-ID'),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      ms: ms
    });

    if (logRequest.length > 20) logRequest.pop();

    console.log(
      '[' + new Date().toLocaleTimeString('id-ID') + '] ' +
      req.method + ' ' + req.url + ' -> ' +
      res.statusCode + ' (' + ms + ' ms)'
    );
  });

  // ---------- POST: kirim pesan buku tamu ----------
  if (req.method === 'POST' && path == '/api/bukutamu') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
      if (body.length > 10000) req.destroy();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const nama = String(data.nama || '').trim();
        const pesan = String(data.pesan || '').trim();

        if (!nama || !pesan) {
          kirimJSON(res, 400, { error: 'Nama dan pesan wajib diisi.' });
          return;
        }

        bukuTamu.unshift({
          nama: nama.slice(0, 40),
          pesan: pesan.slice(0, 200),
          waktu: new Date().toLocaleString('id-ID')
        });

        if (bukuTamu.length > 50) bukuTamu.pop();

        kirimJSON(res, 201, { ok: true });
      } catch (e) {
        kirimJSON(res, 400, { error: 'JSON tidak valid.' });
      }
    });

    return;
  }

  // Selain itu hanya metode GET yang diizinkan
  if (req.method !== 'GET') {
    res.writeHead(405, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Allow': 'GET, POST'
    });
    res.end('405 Method Not Allowed');
    return;
  }

  // ---------- BERANDA ----------
  if (path == '/') {
    const i = dataInfo();

    kirimHTML(res, 200, halaman(
      'Selamat datang di Server Mahasiswa Berprestasi Teknik Informatika!',
      `
<p>Selamat datang di server Mahasiswa Berprestasi Teknik Informatika!.</p>
<div class="kartu">
<div class="redup">Jam sekarang (di komputermu)</div>
<div class="besar" id="jam">--:--:--</div>
<div class="redup">Server aktif selama ${esc(i.uptime)} &middot; ${i.totalRequest} request</div>
</div>

<div class="grid">
<a href="/mahasiswa"><div class="kartu"><b>Mahasiswa</b><div class="redup">Daftar mahasiswa + pencarian</div></div></a>
<a href="/dosen"><div class="kartu"><b>Dosen</b><div class="redup">Daftar dosen dan matkul</div></div></a>
<a href="/jadwal"><div class="kartu"><b>Jadwal</b><div class="redup">Jadwal kuliah, hari ini disorot</div></div></a>
<a href="/statistik"><div class="kartu"><b>Statistik</b><div class="redup">Grafik mahasiswa per kelas</div></div></a>
<a href="/kuis"><div class="kartu"><b>Kuis</b><div class="redup">Uji pengetahuan web &amp; Node.js</div></div></a>
<a href="/kalkulator"><div class="kartu"><b>Kalkulator</b><div class="redup">Hitung + konverter suhu</div></div></a>
<a href="/acak"><div class="kartu"><b>Acak</b><div class="redup">Pilih mahasiswa &amp; bagi kelompok</div></div></a>
<a href="/jamdunia"><div class="kartu"><b>Jam Dunia</b><div class="redup">Lihat waktu beberapa kota</div></div></a>
<a href="/bukutamu"><div class="kartu"><b>Buku Tamu</b><div class="redup">Kirim pesan ke server</div></div></a>
<a href="/admin"><div class="kartu"><b>Admin</b><div class="redup">Statistik request dan log</div></div></a>
<a href="/info"><div class="kartu"><b>Info</b><div class="redup">Info server real-time</div></div></a>
<a href="/anggota?format=html"><div class="kartu"><b>Anggota</b><div class="redup">Anggota kelompok</div></div></a>
</div>`,
      '/',
      `
<script>
function jamSekarang() {
  var d = new Date();
  document.getElementById('jam').textContent =
    d.toLocaleTimeString('id-ID', { hour12: false });
}
jamSekarang();
setInterval(jamSekarang, 1000);
</script>`
    ));
  }

  // ---------- MAHASISWA ----------
  else if (path == '/mahasiswa') {
    const q = (url.searchParams.get('q') || '').toLowerCase();

    const hasil = siswa.filter(function (s) {
      return s.nama.toLowerCase().includes(q) ||
        s.nim.toLowerCase().includes(q) ||
        s.kelas.toLowerCase().includes(q);
    });

    const baris = hasil.map(function (s) {
      return '<tr><td>' + esc(s.nim) + '</td><td>' +
        esc(s.nama) + '</td><td>' + esc(s.kelas) + '</td></tr>';
    }).join('');

    kirimHTML(res, 200, halaman(
      'Daftar Mahasiswa',
      `
<form method="GET">
<input type="text" name="q" value="${esc(q)}" placeholder="Cari NIM, nama, atau kelas...">
</form>

<div class="kartu">
<div class="redup">Ditemukan ${hasil.length} mahasiswa</div>
<table>
<thead><tr><th>NIM</th><th>Nama</th><th>Kelas</th></tr></thead>
<tbody>${baris || '<tr><td colspan="3">Data tidak ditemukan.</td></tr>'}</tbody>
</table>
</div>

<p class="redup">API: <a href="/api/siswa">/api/siswa</a></p>
`,
      '/mahasiswa'
    ));
  }

  // ---------- DOSEN ----------
  else if (path == '/dosen') {
    const baris = dosen.map(function (d) {
      return '<tr><td>' + esc(d.nama) + '</td><td>' +
        esc(d.matkul) + '</td></tr>';
    }).join('');

    kirimHTML(res, 200, halaman(
      'Daftar Dosen',
      `
<div class="kartu">
<table>
<thead><tr><th>Dosen</th><th>Mata Kuliah</th></tr></thead>
<tbody>${baris}</tbody>
</table>
</div>

<p class="redup">API: <a href="/api/dosen">/api/dosen</a></p>
`,
      '/dosen'
    ));
  }

  // ---------- JADWAL ----------
  else if (path == '/jadwal') {
    const hariSekarang = new Date().getDay();

    const baris = jadwal.map(function (j) {
      return '<tr class="' + (j.hari === hariSekarang ? 'hariini' : '') + '">' +
        '<td>' + namaHari[j.hari] + '</td>' +
        '<td>' + esc(j.jam) + '</td>' +
        '<td>' + esc(j.matkul) + '</td>' +
        '<td>' + esc(j.dosen) + '</td>' +
        '<td>' + esc(j.ruang) + '</td></tr>';
    }).join('');

    kirimHTML(res, 200, halaman(
      'Jadwal Kuliah',
      `
<div class="kartu">
<table>
<thead>
<tr><th>Hari</th><th>Jam</th><th>Mata Kuliah</th><th>Dosen</th><th>Ruang</th></tr>
</thead>
<tbody>${baris}</tbody>
</table>
</div>

<p class="redup">Baris berwarna adalah jadwal hari ini.</p>
<p class="redup">API: <a href="/api/jadwal">/api/jadwal</a></p>
`,
      '/jadwal'
    ));
  }

  // ---------- STATISTIK ----------
  else if (path == '/statistik') {
    const hitungKelas = {};

    siswa.forEach(function (s) {
      hitungKelas[s.kelas] = (hitungKelas[s.kelas] || 0) + 1;
    });

    const daftarKelas = Object.keys(hitungKelas);
    const maksimum = Math.max.apply(null, daftarKelas.map(function (k) {
      return hitungKelas[k];
    }));

    const grafik = daftarKelas.map(function (k) {
      const persen = (hitungKelas[k] / maksimum) * 100;

      return `
<div class="baris-bar">
<div>${esc(k)}</div>
<div class="bar-wrap"><div class="bar" style="width:${persen}%"></div></div>
<div>${hitungKelas[k]}</div>
</div>`;
    }).join('');

    const terbanyak = daftarKelas.reduce(function (a, b) {
      return hitungKelas[b] > hitungKelas[a] ? b : a;
    });

    kirimHTML(res, 200, halaman(
      'Statistik Mahasiswa per Kelas',
      `
<div class="grid">
<div class="kartu"><div class="redup">Total mahasiswa</div><div class="besar">${siswa.length}</div></div>
<div class="kartu"><div class="redup">Jumlah kelas</div><div class="besar">${daftarKelas.length}</div></div>
<div class="kartu"><div class="redup">Kelas terbanyak</div><div class="besar">${esc(terbanyak)}</div></div>
</div>

<div class="kartu">${grafik}</div>
`,
      '/statistik'
    ));
  }

  // ---------- KUIS ----------
  else if (path == '/kuis') {
    kirimHTML(res, 200, halaman(
      'Kuis Web & Node.js',
      `<div class="kartu" id="kotak"></div>`,
      '/kuis',
      `
<script>
var soal = ${JSON.stringify(kuis)};
var no = 0, skor = 0, terjawab = false;
var kotak = document.getElementById('kotak');

function tampilSoal() {
  terjawab = false;
  kotak.innerHTML = '';

  var s = soal[no];
  var info = document.createElement('div');
  info.className = 'redup';
  info.textContent = 'Soal ' + (no + 1) + ' dari ' + soal.length + ' · Skor: ' + skor;

  var tanya = document.createElement('p');
  tanya.style.fontWeight = 'bold';
  tanya.textContent = s.tanya;

  kotak.appendChild(info);
  kotak.appendChild(tanya);

  s.opsi.forEach(function (teks, i) {
    var b = document.createElement('button');
    b.className = 'pilihan';
    b.textContent = teks;
    b.addEventListener('click', function () {
      jawab(i, b);
    });
    kotak.appendChild(b);
  });
}

function jawab(i, tombol) {
  if (terjawab) return;
  terjawab = true;

  var tombolSemua = kotak.querySelectorAll('.pilihan');

  if (i === soal[no].benar) {
    skor++;
    tombol.className = 'pilihan benar';
  } else {
    tombol.className = 'pilihan salah';
    tombolSemua[soal[no].benar].className = 'pilihan benar';
  }

  var lanjut = document.createElement('button');
  lanjut.className = 'utama';
  lanjut.style.marginTop = '10px';
  lanjut.textContent = no + 1 < soal.length ? 'Soal berikutnya' : 'Lihat hasil';

  lanjut.addEventListener('click', function () {
    no++;

    if (no < soal.length) {
      tampilSoal();
    } else {
      kotak.innerHTML =
        '<div class="besar">Skor akhir: ' + skor + '/' + soal.length + '</div>' +
        '<p>' +
        (skor === soal.length
          ? 'Sempurna!'
          : skor >= soal.length / 2
            ? 'Lumayan bagus!'
            : 'Coba lagi, ya!') +
        '</p>' +
        '<button class="utama" onclick="location.reload()">Ulangi kuis</button>';
    }
  });

  kotak.appendChild(lanjut);
}

tampilSoal();
</script>`
    ));
  }

  // ---------- KALKULATOR ----------
  else if (path == '/kalkulator') {
    kirimHTML(res, 200, halaman(
      'Kalkulator & Konverter Suhu',
      `
<div class="kartu">
<input id="layar" type="text" value="0" readonly>
<div class="kalk" id="tombol"></div>
</div>

<div class="kartu">
<b>Konverter Celsius</b>
<p class="redup">Masukkan suhu dalam Celsius.</p>
<input type="number" id="celsius" placeholder="Contoh: 25">
<p id="hasilSuhu" class="redup">Fahrenheit, Kelvin, dan Reamur akan tampil di sini.</p>
</div>
`,
      '/kalkulator',
      `
<script>
var layar = document.getElementById('layar');
var tombolList = [
  '7','8','9','/',
  '4','5','6','*',
  '1','2','3','-',
  '0','.','=','+',
  'C'
];

var a = 0, op = null, baru = true;

function tekan(k) {
  if (k === 'C') {
    layar.value = '0';
    a = 0;
    op = null;
    baru = true;
    return;
  }

  if (['+','-','*','/'].indexOf(k) !== -1) {
    a = parseFloat(layar.value) || 0;
    op = k;
    baru = true;
    return;
  }

  if (k === '=') {
    var b = parseFloat(layar.value) || 0;
    var hasil;

    if (!op) return;

    if (op === '+') hasil = a + b;
    if (op === '-') hasil = a - b;
    if (op === '*') hasil = a * b;
    if (op === '/') hasil = b === 0 ? 'Error' : a / b;

    layar.value = typeof hasil === 'number'
      ? String(+hasil.toFixed(10))
      : hasil;

    op = null;
    baru = true;
    return;
  }

  if (baru) {
    layar.value = k === '.' ? '0.' : k;
    baru = false;
  } else if (k === '.' && layar.value.indexOf('.') !== -1) {
    return;
  } else {
    layar.value += k;
  }
}

tombolList.forEach(function (k) {
  var b = document.createElement('button');
  b.textContent = k;

  if (k === '=') b.className = 'utama';

  b.addEventListener('click', function () {
    tekan(k);
  });

  document.getElementById('tombol').appendChild(b);
});

document.getElementById('celsius').addEventListener('input', function () {
  var c = parseFloat(this.value);
  var out = document.getElementById('hasilSuhu');

  if (isNaN(c)) {
    out.textContent = 'Fahrenheit, Kelvin, dan Reamur akan tampil di sini.';
    return;
  }

  out.textContent =
    (c * 9 / 5 + 32).toFixed(2) + ' °F | ' +
    (c + 273.15).toFixed(2) + ' K | ' +
    (c * 4 / 5).toFixed(2) + ' °R';
});
</script>`
    ));
  }

  // ---------- ACAK ----------
  else if (path == '/acak') {
    kirimHTML(res, 200, halaman(
      'Pengacak Siswa & Kelompok',
      `
<div class="kartu">
<b>Pilih satu siswa secara acak</b>
<div class="besar" id="terpilih" style="margin:12px 0">?</div>
<button class="utama" id="btnAcak" type="button">Acak sekarang!</button>
</div>

<div class="kartu">
<b>Bagi menjadi kelompok</b>
<p class="redup">Jumlah kelompok:</p>
<input type="number" id="jmlKelompok" value="4" min="1" max="${siswa.length}" style="max-width:120px">
<p><button class="utama" id="btnBagi" type="button">Bagi kelompok</button></p>
<div class="kelompok" id="hasilKelompok"></div>
</div>
`,
      '/acak',
      `
<script>
var daftar = ${JSON.stringify(siswa.map(s => s.nama))};

document.getElementById('btnAcak').addEventListener('click', function () {
  var el = document.getElementById('terpilih');
  var n = 0;

  var timer = setInterval(function () {
    el.textContent = daftar[Math.floor(Math.random() * daftar.length)];

    if (++n >= 20) clearInterval(timer);
  }, 60);
});

function kocok(arr) {
  var b = arr.slice();

  for (var i = b.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = b[i];
    b[i] = b[j];
    b[j] = t;
  }

  return b;
}

document.getElementById('btnBagi').addEventListener('click', function () {
  var n = parseInt(document.getElementById('jmlKelompok').value, 10);

  if (isNaN(n) || n < 1) n = 1;
  if (n > daftar.length) n = daftar.length;

  var grup = [];

  for (var i = 0; i < n; i++) grup.push([]);

  kocok(daftar).forEach(function (nama, i) {
    grup[i % n].push(nama);
  });

  var wadah = document.getElementById('hasilKelompok');
  wadah.innerHTML = '';

  grup.forEach(function (g, i) {
    var k = document.createElement('div');
    k.className = 'kartu';

    var jd = document.createElement('b');
    jd.textContent = 'Kelompok ' + (i + 1);
    k.appendChild(jd);

    g.forEach(function (nama) {
      var d = document.createElement('div');
      d.textContent = nama;
      k.appendChild(d);
    });

    wadah.appendChild(k);
  });
});
</script>`
    ));
  }

  // ---------- JAM DUNIA ----------
  else if (path == '/jamdunia') {
    const kota = [
      { nama: 'Jakarta (WIB)', zona: 'Asia/Jakarta' },
      { nama: 'Makassar (WITA)', zona: 'Asia/Makassar' },
      { nama: 'Jayapura (WIT)', zona: 'Asia/Jayapura' },
      { nama: 'Tokyo', zona: 'Asia/Tokyo' },
      { nama: 'Dubai', zona: 'Asia/Dubai' },
      { nama: 'London', zona: 'Europe/London' },
      { nama: 'New York', zona: 'America/New_York' },
      { nama: 'Sydney', zona: 'Australia/Sydney' },
    ];

    const kartu = kota.map((k, i) =>
      '<div class="kartu"><div class="redup">' +
      esc(k.nama) +
      '</div><div class="besar" id="kota' + i +
      '">--:--:--</div><div class="redup" id="tgl' +
      i + '"></div></div>'
    ).join('');

    kirimHTML(res, 200, halaman(
      'Jam Dunia',
      `<div class="grid">${kartu}</div>`,
      '/jamdunia',
      `
<script>
var kota = ${JSON.stringify(kota)};

function tick() {
  var now = new Date();

  kota.forEach(function (k, i) {
    document.getElementById('kota' + i).textContent =
      now.toLocaleTimeString('id-ID', {
        timeZone: k.zona,
        hour12: false
      });

    document.getElementById('tgl' + i).textContent =
      now.toLocaleDateString('id-ID', {
        timeZone: k.zona,
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
  });
}

tick();
setInterval(tick, 1000);
</script>`
    ));
  }

  // ---------- BUKU TAMU ----------
  else if (path == '/bukutamu') {
    kirimHTML(res, 200, halaman(
      'Buku Tamu',
      `
<div class="kartu">
<p><input type="text" id="nama" placeholder="Nama kamu" maxlength="40"></p>
<p><textarea id="pesan" rows="3" placeholder="Tulis pesan (maks. 200 karakter)" maxlength="200"></textarea></p>
<button class="utama" id="kirim" type="button">Kirim pesan</button>
<span class="redup" id="status"></span>
</div>

<div class="kartu">
<b>Pesan terbaru</b>
<span class="redup">&middot; <a href="/api/bukutamu">lihat JSON</a></span>
<div id="daftar"><p class="redup">Memuat...</p></div>
</div>
`,
      '/bukutamu',
      `
<script>
function muat() {
  fetch('/api/bukutamu')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var wadah = document.getElementById('daftar');
      wadah.innerHTML = '';

      if (!data.length) {
        wadah.innerHTML =
          '<p class="redup">Belum ada pesan. Jadilah yang pertama!</p>';
        return;
      }

      data.forEach(function (p) {
        var d = document.createElement('div');
        d.className = 'pesan';

        var atas = document.createElement('b');
        atas.textContent = p.nama;

        var waktu = document.createElement('span');
        waktu.className = 'redup';
        waktu.textContent = ' · ' + p.waktu;

        var isi = document.createElement('div');
        isi.textContent = p.pesan;

        d.appendChild(atas);
        d.appendChild(waktu);
        d.appendChild(isi);
        wadah.appendChild(d);
      });
    })
    .catch(function () {});
}

document.getElementById('kirim').addEventListener('click', function () {
  var nama = document.getElementById('nama').value;
  var pesan = document.getElementById('pesan').value;
  var status = document.getElementById('status');

  fetch('/api/bukutamu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nama: nama, pesan: pesan })
  })
    .then(function (r) {
      return r.json().then(function (d) {
        return { ok: r.ok, d: d };
      });
    })
    .then(function (h) {
      if (h.ok) {
        document.getElementById('pesan').value = '';
        status.textContent = ' Terkirim!';
        muat();
      } else {
        status.textContent = ' ' + (h.d.error || 'Gagal mengirim');
      }
    })
    .catch(function () {
      status.textContent = ' Gagal terhubung ke server';
    });
});

muat();
setInterval(muat, 5000);
</script>`
    ));
  }

  // ---------- ADMIN ----------
  else if (path == '/admin') {
    const i = dataInfo();

    const rute = Object.keys(hitPerRoute)
      .sort((a, b) => hitPerRoute[b] - hitPerRoute[a]);

    const barisRute = rute.length
      ? rute.map(r =>
          '<tr><td><code>' + esc(r) +
          '</code></td><td>' + hitPerRoute[r] +
          '</td></tr>'
        ).join('')
      : '<tr><td colspan="2" class="redup">Belum ada data</td></tr>';

    const barisLog = logRequest.length
      ? logRequest.map(l =>
          '<tr><td>' + esc(l.waktu) +
          '</td><td>' + esc(l.method) +
          '</td><td><code>' + esc(l.url) +
          '</code></td><td>' + l.status +
          '</td><td>' + l.ms +
          ' ms</td></tr>'
        ).join('')
      : '<tr><td colspan="5" class="redup">Belum ada data</td></tr>';

    kirimHTML(res, 200, halaman(
      'Anda berada pada halaman admin',
      `
<div class="grid">
<div class="kartu"><div class="redup">Total request</div><div class="besar">${i.totalRequest}</div></div>
<div class="kartu"><div class="redup">Halaman berbeda</div><div class="besar">${rute.length}</div></div>
<div class="kartu"><div class="redup">Uptime</div><div>${esc(i.uptime)}</div></div>
</div>

<h3>Kunjungan per halaman</h3>
<table>
<thead><tr><th>Route</th><th>Jumlah</th></tr></thead>
<tbody>${barisRute}</tbody>
</table>

<h3>20 request terakhir</h3>
<table>
<thead><tr><th>Waktu</th><th>Method</th><th>URL</th><th>Status</th><th>Durasi</th></tr></thead>
<tbody>${barisLog}</tbody>
</table>

<p><button type="button" onclick="location.reload()">Muat ulang data</button></p>
`,
      '/admin'
    ));
  }

  // ---------- INFO ----------
  else if (path == '/info') {
    const i = dataInfo();

    kirimHTML(res, 200, halaman(
      'Info Server',
      `
<div class="kartu">
<div class="redup">Jam server</div>
<div class="besar" id="waktuSekarang">${esc(i.waktuSekarang)}</div>
<div class="redup">Diperbarui otomatis tiap detik</div>
</div>

<table>
<tbody>
<tr><th>Server dijalankan pada</th><td id="waktuMulai">${esc(i.waktuMulai)}</td></tr>
<tr><th>Uptime</th><td id="uptime">${esc(i.uptime)}</td></tr>
<tr><th>Total request</th><td id="totalRequest">${i.totalRequest}</td></tr>
<tr><th>Versi Node.js</th><td id="nodeVersion">${esc(i.nodeVersion)}</td></tr>
<tr><th>Sistem operasi</th><td id="platform">${esc(i.platform)}</td></tr>
<tr><th>Jumlah CPU</th><td id="jumlahCPU">${i.jumlahCPU}</td></tr>
<tr><th>Memori server</th><td><span id="memoriDipakaiMB">${i.memoriDipakaiMB}</span> MB dari <span id="memoriTotalMB">${i.memoriTotalMB}</span> MB</td></tr>
<tr><th>Port</th><td id="port">${i.port}</td></tr>
</tbody>
</table>

<p class="redup">Data mentah: <a href="/api/info">/api/info</a></p>
`,
      '/info',
      `
<script>
function perbarui() {
  fetch('/api/info')
    .then(function (r) { return r.json(); })
    .then(function (d) {
      Object.keys(d).forEach(function (k) {
        var el = document.getElementById(k);
        if (el) el.textContent = d[k];
      });
    })
    .catch(function () {});
}

setInterval(perbarui, 1000);
</script>`
    ));
  }

  // ---------- ANGGOTA ----------
  else if (path == '/anggota') {
    if (url.searchParams.get('format') === 'html') {
      const kartu = anggota.map(a =>
        '<div class="kartu">' +
        '<div class="redup">Anggota ' + a.no + '</div>' +
        '<div class="besar" style="font-size:20px">' +
        esc(a.nama) +
        '</div>' +
        '<div class="redup">' + esc(a.peran) +
        '</div></div>'
      ).join('');

      kirimHTML(res, 200, halaman(
        'Anggota Kelompok web Server PBP',
        `
<div class="grid">${kartu}</div>
<p class="redup">Lihat sebagai JSON: <a href="/anggota">/anggota</a></p>
`,
        '/anggota'
      ));
    } else {
      kirimJSON(res, 200, anggota);
    }
  }

  // ---------- DATA JSON ----------
  else if (path == '/data') {
    kirimJSON(res, 200, {
      nama: ["Paundra", "Prayogi", "Nayshila", "Nazla"],
      matkul: "Pemrograman Berbasis Platform",
      server: "Node.js"
    });
  }

  // ---------- API JSON ----------
  else if (path == '/api/info') {
    kirimJSON(res, 200, dataInfo());
  }
  else if (path == '/api/siswa') {
    kirimJSON(res, 200, siswa);
  }
  else if (path == '/api/dosen') {
    kirimJSON(res, 200, dosen);
  }
  else if (path == '/api/jadwal') {
    kirimJSON(
      res,
      200,
      jadwal.map(j =>
        Object.assign({}, j, { hariNama: namaHari[j.hari] })
      )
    );
  }
  else if (path == '/api/bukutamu') {
    kirimJSON(res, 200, bukuTamu);
  }

  // ---------- 404 ----------
  else {
    kirimHTML(
      res,
      404,
      halaman(
        'Page Not Found (404)',
        '<p>Halaman <code>' + esc(path) +
        '</code> tidak ditemukan.</p>' +
        '<p><a href="/">Kembali ke beranda</a></p>',
        ''
      )
    );
  }
});

server.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});