const http = require('http');
const os = require('os');
const port = 8000;

// ====================== DATA & STATISTIK ======================
const waktuMulai = new Date();
let totalRequest = 0;
const hitPerRoute = {};   // jumlah kunjungan per halaman
const logRequest = [];    // 20 request terakhir

// Data anggota kelompok (ganti dengan nama anggota kelompokmu)
const anggota = [
  { no: 1, nama: "Nayshila Azzahra", peran: "Anggota" },
  { no: 2, nama: "Nazla Dwi Ananda", peran: "Anggota" },
  { no: 3, nama: "Paundra Rizky Pratama", peran: "Anggota" },
  { no: 4, nama: "Prayogi Ananta Sadiko", peran: "Anggota" },
];

const siswa = [
  { nim: "20250040055", nama: "Chikal",  kelas: "TI25A" },
  { nim: "20250040014", nama: "Regith",  kelas: "TI25I" },
  { nim: "20250040179", nama: "Nayara",  kelas: "TI25I" },
  { nim: "20250040072", nama: "Reno", kelas: "TI25B" },
  { nim: "20250040057", nama: "Musyaraf",  kelas: "TI25G" },
  { nim: "20250040012", nama: "Anmas",  kelas: "TI25A" },
  { nim: "20250040011", nama: "Farhan",  kelas: "TI25E" },
  { nim: "20250040134", nama: "Novia",  kelas: "TI25B" },
  { nim: "20250040078", nama: "Amara", kelas: "TI25C" },
  { nim: "20250040042", nama: "Paundra",  kelas: "TI25G" },
  { nim: "20250040053", nama: "Juwita",  kelas: "TI25A" },
  { nim: "20250040018", nama: "Galang",  kelas: "TI25E" },
  { nim: "20250040177", nama: "Nadhif",  kelas: "TI25B" },
  { nim: "20250040076", nama: "Nazla", kelas: "TI25G" },
  { nim: "20250040057", nama: "Prayogi",  kelas: "TI25G" },
  { nim: "20250040059", nama: "Nickxen",  kelas: "TI25A" },
  { nim: "20250040017", nama: "Nayshila",  kelas: "TI25G" },
  { nim: "20250040170", nama: "Syifa",  kelas: "TI25I" },
  { nim: "20250040073", nama: "Mira", kelas: "TI25B" },
  { nim: "20250040056", nama: "Ilham",  kelas: "TI25E" },
];

const dosen = [
  { nama: "Shinta Ayuningtias", matkul: "Pemrograman Berbasis Platform" },
  { nama: "Aditiya", matkul: "Interaksi Manusia dan Komputer" },
  { nama: "Kamdan Rahmat", matkul: "Jaringan Komputer" },
  { nama: "Moneyta", matkul:"Rekayasa Perangkat Lunak" },
  { nama: "Lusiana", matkul:"Metode Numerik" },
  { nama: "Barkah", matkul:"Bahasa Indonesia dan Budaya" },
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
  { href: '/',                      label: 'Beranda', key: '/' },
  { href: '/siswa',                 label: 'Siswa',   key: '/siswa' },
  { href: '/dosen',                 label: 'Dosen',   key: '/dosen' },
  { href: '/admin',                 label: 'Admin',   key: '/admin' },
  { href: '/info',                  label: 'Info',    key: '/info' },
  { href: '/anggota?format=html',   label: 'Anggota', key: '/anggota' },
  { href: '/data',                  label: 'Data (JSON)', key: '/data' }
];

// Template halaman HTML (ada navigasi, mode gelap/terang)
function halaman(judul, isi, aktif, skrip) {
  const nav = menu.map(function (m) {
    return '<a href="' + m.href + '"' + (m.key === aktif ? ' class="aktif"' : '') + '>' + m.label + '</a>';
  }).join('');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(judul)}</title>
  <style>
    :root { --bg:#f6f7f9; --kartu:#ffffff; --teks:#1f2937; --redup:#6b7280; --garis:#e5e7eb; --aksen:#2563eb; }
    [data-theme="dark"] { --bg:#111827; --kartu:#1f2937; --teks:#f3f4f6; --redup:#9ca3af; --garis:#374151; --aksen:#60a5fa; }
    * { box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: var(--bg); color: var(--teks); margin: 0; line-height: 1.6; }
    .wrap { max-width: 860px; margin: 0 auto; padding: 16px; }
    header { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 0; border-bottom: 1px solid var(--garis); }
    nav { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; }
    nav a { padding: 6px 12px; border-radius: 6px; text-decoration: none; color: var(--teks); }
    nav a:hover { background: var(--garis); }
    nav a.aktif { background: var(--aksen); color: #fff; }
    button { cursor: pointer; border: 1px solid var(--garis); background: var(--kartu); color: var(--teks); padding: 6px 12px; border-radius: 6px; }
    h2 { margin-top: 24px; }
    .kartu { background: var(--kartu); border: 1px solid var(--garis); border-radius: 10px; padding: 16px; margin: 12px 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; }
    .grid a { text-decoration: none; color: inherit; }
    .grid .kartu:hover { border-color: var(--aksen); }
    .redup { color: var(--redup); font-size: 14px; }
    .besar { font-size: 28px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; background: var(--kartu); }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--garis); }
    th { color: var(--redup); font-weight: normal; font-size: 14px; }
    input[type=text] { width: 100%; padding: 8px 10px; border: 1px solid var(--garis); border-radius: 6px; background: var(--kartu); color: var(--teks); }
    code { background: var(--garis); padding: 1px 6px; border-radius: 4px; }
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

  // Catat statistik & log setelah respons selesai dikirim (API polling tidak dihitung)
  res.on('finish', () => {
    if (path.startsWith('/api/')) return;
    totalRequest++;
    hitPerRoute[path] = (hitPerRoute[path] || 0) + 1;
    const ms = Date.now() - mulai;
    logRequest.unshift({
      waktu: new Date().toLocaleTimeString('id-ID'),
      method: req.method, url: req.url, status: res.statusCode, ms: ms
    });
    if (logRequest.length > 20) logRequest.pop();
    console.log('[' + new Date().toLocaleTimeString('id-ID') + '] ' + req.method + ' ' + req.url + ' -> ' + res.statusCode + ' (' + ms + ' ms)');
  });

  // Hanya metode GET yang diizinkan
  if (req.method !== 'GET') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET' });
    res.end('405 Method Not Allowed');
    return;
  }

  // ---------- BERANDA ----------
  if (path == '/') {
    const i = dataInfo();
    kirimHTML(res, 200, halaman('Selamat datang di Server Mahasiswa Berprestasi Kota Sukabumi!', `
      <p>Selamat datang di server Mahasiswa Berprestasi Kota Sukabumi.</p>
      <div class="kartu">
        <div class="redup">Jam sekarang (di komputermu)</div>
        <div class="besar" id="jam">--:--:--</div>
        <div class="redup">Server aktif selama ${esc(i.uptime)} &middot; ${i.totalRequest} request</div>
      </div>
      <div class="grid">
        <a href="/siswa"><div class="kartu"><b>Siswa</b><div class="redup">Daftar siswa + pencarian</div></div></a>
        <a href="/dosen"><div class="kartu"><b>Dosen</b><div class="redup">Daftar dosen dan matkul</div></div></a>
        <a href="/admin"><div class="kartu"><b>Admin</b><div class="redup">Statistik & log request</div></div></a>
        <a href="/info"><div class="kartu"><b>Info</b><div class="redup">Status server real-time</div></div></a>
        <a href="/anggota?format=html"><div class="kartu"><b>Anggota</b><div class="redup">Anggota kelompok</div></div></a>
        <a href="/data"><div class="kartu"><b>Data</b><div class="redup">Contoh response JSON</div></div></a>
      </div>`, '/', `
      <script>
        function tick() { document.getElementById('jam').textContent = new Date().toLocaleTimeString('id-ID'); }
        tick(); setInterval(tick, 1000);
      </script>`));
  }

  // ---------- SISWA (tabel + pencarian) ----------
  else if (path == '/siswa') {
    const baris = siswa.map(s =>
      '<tr><td>' + esc(s.nim) + '</td><td>' + esc(s.nama) + '</td><td>' + esc(s.kelas) + '</td></tr>').join('');
    kirimHTML(res, 200, halaman('Anda berada pada halaman siswa', `
      <input type="text" id="cari" placeholder="Cari nama, NIM, atau kelas...">
      <p class="redup">Menampilkan <span id="jumlah">${siswa.length}</span> dari ${siswa.length} siswa &middot; <a href="/api/siswa">lihat JSON</a></p>
      <table>
        <thead><tr><th>NIM</th><th>Nama</th><th>Kelas</th></tr></thead>
        <tbody id="isi">${baris}</tbody>
      </table>`, '/siswa', `
      <script>
        var kotak = document.getElementById('cari');
        kotak.addEventListener('input', function () {
          var kata = kotak.value.toLowerCase(), tampil = 0;
          document.querySelectorAll('#isi tr').forEach(function (tr) {
            var cocok = tr.textContent.toLowerCase().indexOf(kata) !== -1;
            tr.style.display = cocok ? '' : 'none';
            if (cocok) tampil++;
          });
          document.getElementById('jumlah').textContent = tampil;
        });
      </script>`));
  }

  // ---------- DOSEN ----------
  else if (path == '/dosen') {
    const baris = dosen.map(d =>
      '<tr><td>' + esc(d.nama) + '</td><td>' + esc(d.matkul) + '</td></tr>').join('');
    kirimHTML(res, 200, halaman('Anda berada pada halaman dosen', `
      <p class="redup">Total ${dosen.length} dosen &middot; <a href="/api/dosen">lihat JSON</a></p>
      <table>
        <thead><tr><th>Nama</th><th>Mata Kuliah</th></tr></thead>
        <tbody>${baris}</tbody>
      </table>`, '/dosen'));
  }

  // ---------- ADMIN (statistik + log) ----------
  else if (path == '/admin') {
    const i = dataInfo();
    const rute = Object.keys(hitPerRoute).sort((a, b) => hitPerRoute[b] - hitPerRoute[a]);
    const barisRute = rute.length
      ? rute.map(r => '<tr><td><code>' + esc(r) + '</code></td><td>' + hitPerRoute[r] + '</td></tr>').join('')
      : '<tr><td colspan="2" class="redup">Belum ada data</td></tr>';
    const barisLog = logRequest.length
      ? logRequest.map(l =>
          '<tr><td>' + esc(l.waktu) + '</td><td>' + esc(l.method) + '</td><td><code>' + esc(l.url) +
          '</code></td><td>' + l.status + '</td><td>' + l.ms + ' ms</td></tr>').join('')
      : '<tr><td colspan="5" class="redup">Belum ada data</td></tr>';
    kirimHTML(res, 200, halaman('Anda berada pada halaman admin', `
      <div class="grid">
        <div class="kartu"><div class="redup">Total request</div><div class="besar">${i.totalRequest}</div></div>
        <div class="kartu"><div class="redup">Halaman berbeda</div><div class="besar">${rute.length}</div></div>
        <div class="kartu"><div class="redup">Uptime</div><div>${esc(i.uptime)}</div></div>
      </div>
      <h3>Kunjungan per halaman</h3>
      <table><thead><tr><th>Route</th><th>Jumlah</th></tr></thead><tbody>${barisRute}</tbody></table>
      <h3>20 request terakhir</h3>
      <table><thead><tr><th>Waktu</th><th>Method</th><th>URL</th><th>Status</th><th>Durasi</th></tr></thead><tbody>${barisLog}</tbody></table>
      <p><button type="button" onclick="location.reload()">Muat ulang data</button></p>`, '/admin'));
  }

  // ---------- INFO (real-time) ----------
  else if (path == '/info') {
    const i = dataInfo();
    kirimHTML(res, 200, halaman('Info Server', `
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
      <p class="redup">Data mentah: <a href="/api/info">/api/info</a></p>`, '/info', `
      <script>
        function perbarui() {
          fetch('/api/info').then(function (r) { return r.json(); }).then(function (d) {
            Object.keys(d).forEach(function (k) {
              var el = document.getElementById(k);
              if (el) el.textContent = d[k];
            });
          }).catch(function () {});
        }
        setInterval(perbarui, 1000);
      </script>`));
  }

  // ---------- ANGGOTA (JSON default, HTML jika ?format=html) ----------
  else if (path == '/anggota') {
    if (url.searchParams.get('format') === 'html') {
      const kartu = anggota.map(a =>
        '<div class="kartu"><div class="redup">Anggota ' + a.no + '</div><div class="besar" style="font-size:20px">' +
        esc(a.nama) + '</div><div class="redup">' + esc(a.peran) + '</div></div>').join('');
      kirimHTML(res, 200, halaman('Anggota Kelompok web Server PBP', `
        <div class="grid">${kartu}</div>
        <p class="redup">Lihat sebagai JSON: <a href="/anggota">/anggota</a></p>`, '/anggota'));
    } else {
      kirimJSON(res, 200, anggota);
    }
  }

  // ---------- DATA JSON (Aktivitas 2) ----------
  else if (path == '/data') {
    kirimJSON(res, 200, {
      nama: ["Paundra", "Prayogi", "Nayshila", "Nazla"],
      matkul: "Pemrograman Berbasis Platform",
      server: "Node.js"
    });
  }

  // ---------- API JSON ----------
  else if (path == '/api/info')  { kirimJSON(res, 200, dataInfo()); }
  else if (path == '/api/siswa') { kirimJSON(res, 200, siswa); }
  else if (path == '/api/dosen') { kirimJSON(res, 200, dosen); }

  // ---------- 404 ----------
  else {
    kirimHTML(res, 404, halaman('Page Not Found (404)',
      '<p>Halaman <code>' + esc(path) + '</code> tidak ditemukan.</p><p><a href="/">Kembali ke beranda</a></p>', ''));
  }
});

server.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});