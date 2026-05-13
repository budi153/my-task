// --- 1. FUNGSI UNTUK KEGIATAN HARIAN ---
function tambahKegiatan() {
    let input = document.getElementById("inputKegiatan");
    let inputTgl = document.getElementById("inputTanggal");
    
    // Validasi agar teks kegiatan dan tanggal tidak kosong
    if (input.value === "" || inputTgl.value === "") {
        alert("Isi nama kegiatan dan tanggal harian dulu ya!");
        return;
    }
    
    // Buat elemen di daftar harian (Biru)
    buatElemen(input.value, inputTgl.value, false, "daftarKegiatan");
    
    // Bersihkan kotak input setelah klik simpan
    input.value = ""; 
    inputTgl.value = "";
    simpanSemua();
}

// --- 2. FUNGSI UNTUK RENCANA INTI (TARGET BESAR) ---
function tambahInti() {
    let input = document.getElementById("inputInti");
    let inputTgl = document.getElementById("inputTglInti");
    
    // Validasi agar rencana inti dan target tanggal tidak kosong
    if (input.value === "" || inputTgl.value === "") {
        alert("Isi rencana inti dan target tanggalnya dulu ya!");
        return;
    }
    
    // Buat elemen di daftar rencana inti (Hijau)
    buatElemen(input.value, inputTgl.value, false, "daftarInti");
    
    // Bersihkan kotak input setelah klik simpan
    input.value = "";
    inputTgl.value = "";
    simpanSemua();
}

// --- 3. FUNGSI UTAMA PEMBUAT ELEMEN LIST ---
function buatElemen(teks, info, isChecked, targetId) {
    let daftar = document.getElementById(targetId);
    let li = document.createElement("li");
    
    // Menentukan struktur baris: Nomor + Tanggal/Info + Teks Kegiatan
    li.innerHTML = `
        <span class="nomor-urut"></span>
        <span class="tgl-item">${info}</span>
        <span class="teks-kegiatan">${teks}</span>
    `;

    // Berikan tanda khusus jika statusnya sudah selesai (Checked)
    if (isChecked) li.classList.add("checked");

    // Fungsi Klik: Klik pada baris untuk tandai SELESAI (Ceklis)
    li.onclick = function() {
        li.classList.toggle("checked");
        simpanSemua();
    };

    // Buat Tombol Hapus Merah
    let btnHapus = document.createElement("button");
    btnHapus.innerText = "Hapus";
    btnHapus.className = "btn-hapus";
    
    // Fungsi Klik Hapus: Menghapus baris secara permanen
    btnHapus.onclick = function(e) {
        e.stopPropagation(); // Mencegah fungsi ceklis terpanggil saat klik hapus
        li.remove();
        updateNomor(); // Susun ulang nomor 1, 2, 3...
        simpanSemua(); // Update memori browser
    };

    li.appendChild(btnHapus);
    daftar.appendChild(li);
    updateNomor();
}

// --- 4. FUNGSI UPDATE NOMOR URUT OTOMATIS ---
function updateNomor() {
    // Urutkan nomor pada daftar harian
    document.querySelectorAll("#daftarKegiatan .nomor-urut").forEach((span, i) => {
        span.innerText = (i + 1) + ".";
    });
    // Urutkan nomor pada daftar rencana inti
    document.querySelectorAll("#daftarInti .nomor-urut").forEach((span, i) => {
        span.innerText = (i + 1) + ".";
    });
}

// --- 5. FUNGSI PENYIMPANAN DATA (LOCALSTORAGE) ---
function simpanSemua() {
    // Fungsi internal untuk merubah daftar HTML menjadi data teks (Array)
    const ambilData = (id) => {
        return Array.from(document.querySelectorAll(`#${id} li`)).map(li => ({
            teks: li.querySelector(".teks-kegiatan").innerText,
            info: li.querySelector(".tgl-item").innerText,
            selesai: li.classList.contains("checked")
        }));
    };

    // Simpan ke dalam dua kunci memori yang berbeda agar tidak tertukar
    localStorage.setItem("dataHarian", JSON.stringify(ambilData("daftarKegiatan")));
    localStorage.setItem("dataInti", JSON.stringify(ambilData("daftarInti")));
}

// --- 6. FUNGSI UNTUK MEMANGGIL DATA SAAT REFRESH ---
function tampilkanData() {
    // Panggil data harian dari memori
    let harian = JSON.parse(localStorage.getItem("dataHarian") || "[]");
    harian.forEach(item => buatElemen(item.teks, item.info, item.selesai, "daftarKegiatan"));

    // Panggil data rencana inti dari memori
    let inti = JSON.parse(localStorage.getItem("dataInti") || "[]");
    inti.forEach(item => buatElemen(item.teks, item.info, item.selesai, "daftarInti"));
}

// Jalankan otomatis saat aplikasi pertama kali dibuka di browser
tampilkanData();