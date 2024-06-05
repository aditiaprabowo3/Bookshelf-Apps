const SAVED_EVENT = 'savedBook';
const STORAGE_KEY = 'BOOK_APPS';

// Fungsi isStorageExist digunakan untuk memeriksa apakah browser mendukung Web Storage.
function isStorageExist() {
    // Memeriksa apakah tipe Storage (localStorage atau sessionStorage) tersedia di browser.
    if (typeof(Storage) === undefined) {
        // Jika tidak tersedia, tampilkan pesan alert kepada pengguna.
        alert("Browser kamu tidak mendukung web storage");
        // Mengembalikan false untuk menandakan bahwa Web Storage tidak didukung.
        return false;
    }
    // Jika tipe Storage tersedia, mengembalikan true untuk menandakan bahwa Web Storage didukung.
    return true;
}


// Fungsi saveData digunakan untuk menyimpan data buku ke dalam Web Storage jika Web Storage didukung.
function saveData() {
    // Memeriksa apakah Web Storage didukung menggunakan fungsi isStorageExist.
    if (isStorageExist()) {
        // Mengonversi array books menjadi JSON string.
        const parsed = JSON.stringify(books);
        // Menyimpan JSON string ke dalam localStorage dengan kunci STORAGE_KEY.
        localStorage.setItem(STORAGE_KEY, parsed);
        // Memicu event SAVED_EVENT untuk memberitahu bahwa data telah disimpan.
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}


// Event listener untuk menangani event SAVED_EVENT yang terjadi setelah data disimpan.
document.addEventListener(SAVED_EVENT, function() {
    // Menampilkan data yang disimpan di localStorage dengan kunci STORAGE_KEY ke konsol.
    console.log(localStorage.getItem(STORAGE_KEY));
});


// Fungsi loadDataFromStorage digunakan untuk memuat data buku dari Web Storage ke dalam array books.
function loadDataFromStorage() {
    // Mengambil data JSON string dari localStorage dengan kunci STORAGE_KEY.
    const serializedData = localStorage.getItem(STORAGE_KEY);
    // Mengonversi JSON string menjadi objek JavaScript menggunakan JSON.parse.
    let data = JSON.parse(serializedData);

    // Memeriksa apakah data tidak null (artinya data tersedia dalam localStorage).
    if (data !== null) {
        // Iterasi melalui setiap buku dalam data dan menambahkannya ke dalam array books.
        for (const book of data) {
            books.push(book);
        }
    }

    // Memicu event RENDER_EVENT untuk merender tampilan dengan data yang telah dimuat.
    document.dispatchEvent(new Event(RENDER_EVENT));
}