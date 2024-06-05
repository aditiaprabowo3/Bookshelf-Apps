const books = [];
const RENDER_EVENT = 'renderEvent';

// menambahkan buku baru ke dalam array books berdasarkan input dari pengguna
function addBook() {
    // Mengambil nilai input judul buku, penulis buku, tahun terbit buku, dan status selesai atau belum
    const titleBook = document.getElementById("titleBook").value;
    const authorBook = document.getElementById("authorBook").value;
    const yearsBook = document.getElementById("yearsBook").value;
    const isCompleted = document.getElementById("isCompleted");

    // Variabel untuk menyimpan status buku (selesai atau belum)
    let status;
    if (isCompleted.checked) {
        status = true;
    } else {
        status = false;
    }

    // Membuat ID unik untuk buku baru
    const generatedID = generateID();
    // Membuat objek buku berdasarkan input pengguna
    const bookshelfObject = generateBookShelfObject(generatedID, titleBook, authorBook, Number(yearsBook), status);
    // Menambahkan objek buku ke dalam array books
    books.push(bookshelfObject);

    // Memicu event RENDER_EVENT untuk merender ulang tampilan dengan buku baru
    document.dispatchEvent(new Event(RENDER_EVENT));
    // Menyimpan data buku ke penyimpanan lokal
    saveData();
}


// Fungsi generateID digunakan untuk menghasilkan ID unik berdasarkan waktu saat fungsi ini dipanggil.
function generateID() {
    // Mengembalikan nilai timestamp yang dihasilkan dari waktu saat fungsi ini dipanggil.
    return +new Date();
}

// Fungsi generateBookShelfObject digunakan untuk membuat objek buku berdasarkan input yang diberikan.
function generateBookShelfObject(id, title, author, year, isCompleted) {
    // Mengembalikan objek buku dengan properti sesuai dengan parameter yang diberikan.
    return {
        id, // Properti id dengan nilai dari parameter id.
        title, // Properti title dengan nilai dari parameter title.
        author, // Properti author dengan nilai dari parameter author.
        year, // Properti year dengan nilai dari parameter year.
        isCompleted // Properti isCompleted dengan nilai dari parameter isCompleted.
    };
}


document.addEventListener(RENDER_EVENT, function() {
    // Menampilkan isi dari array books ke konsol (digunakan untuk debugging)
    console.log(books);

    // Mengambil elemen dengan ID "unComplete" dan mengosongkan isinya
    const unCompleted = document.getElementById("unComplete");
    unCompleted.innerHTML = "";

    // Mengambil elemen dengan ID "isComplete" dan mengosongkan isinya
    const isCompleted = document.getElementById("isComplete");
    isCompleted.innerHTML = "";

    // Iterasi melalui setiap buku dalam array books
    for (const bookItem of books) {
        // Membuat elemen buku dari data buku menggunakan fungsi makeBook
        const bookElement = makeBook(bookItem);

        // Memeriksa status buku (isCompleted)
        if (!bookItem.isCompleted) {
            // Jika buku belum selesai, tambahkan ke daftar unCompleted
            unCompleted.append(bookElement);
        } else {
            // Jika buku sudah selesai, tambahkan ke daftar isCompleted
            isCompleted.append(bookElement);
        }
    }
});

function makeBook(objectBook) {
    // Membuat elemen <p> untuk judul buku
    const textTitle = document.createElement("p");
    textTitle.classList.add("itemTitle"); // Menambahkan kelas "itemTitle" ke elemen judul
    textTitle.innerHTML = `${objectBook.title}`; // Mengatur teks judul buku

    // Membuat elemen <p> untuk penulis buku
    const textAuthor = document.createElement("p");
    textAuthor.classList.add("itemAuthor"); // Menambahkan kelas "itemAuthor" ke elemen penulis
    textAuthor.innerText = `Penulis : ${objectBook.author}`; // Mengatur teks penulis buku

    // Membuat elemen <p> untuk tahun terbit buku
    const textYear = document.createElement("p");
    textYear.classList.add("itemYear"); // Menambahkan kelas "itemYear" ke elemen tahun terbit
    textYear.innerText = `Tahun : ${objectBook.year}`; // Mengatur teks tahun terbit buku

    // Membuat container untuk teks judul, penulis, dan tahun terbit
    const textContainer = document.createElement("div");
    textContainer.classList.add("itemText"); // Menambahkan kelas "itemText" ke container teks
    textContainer.append(textTitle, textAuthor, textYear); // Menambahkan elemen judul, penulis, dan tahun terbit ke dalam container

    // Membuat container untuk tombol-tombol aksi (misalnya: selesai dibaca, hapus buku)
    const actionContainer = document.createElement("div");
    actionContainer.classList.add("itemAction"); // Menambahkan kelas "itemAction" ke container aksi

    // Membuat container utama untuk seluruh item buku
    const container = document.createElement("div");
    container.classList.add("item"); // Menambahkan kelas "item" ke container utama
    container.append(textContainer); // Menambahkan container teks ke dalam container utama
    container.setAttribute("id", `book-${objectBook.id}`); // Mengatur atribut "id" dengan nilai unik sesuai dengan id buku

    // Menambahkan logika aksi berdasarkan status buku (selesai dibaca atau belum selesai)
    if (objectBook.isCompleted) {
        // Jika buku sudah selesai dibaca, tampilkan tombol "Belum selesai dibaca" dan tombol "Hapus Buku"
        const undoButton = document.createElement("button");
        undoButton.classList.add("undoButton"); // Menambahkan kelas "undoButton" ke tombol undo
        undoButton.innerText = "Belom selesai dibaca"; // Mengatur teks tombol undo

        // Menambahkan event listener untuk tombol undo
        undoButton.addEventListener("click", function() {
            undoBookFromCompleted(objectBook.id); // Memanggil fungsi undoBookFromCompleted dengan id buku sebagai parameter
        });

        // Membuat tombol "Hapus Buku"
        const trashButton = document.createElement("button");
        trashButton.classList.add("trashButton"); // Menambahkan kelas "trashButton" ke tombol trash
        trashButton.innerText = 'Hapus Buku'; // Mengatur teks tombol trash

        // Menambahkan event listener untuk tombol trash
        trashButton.addEventListener("click", function() {
            createCustomDialog("Hapus Buku", function() {
                removeBookFromCompleted(objectBook.id); // Memanggil fungsi removeBookFromCompleted dengan id buku sebagai parameter

                // Menampilkan pesan alert setelah buku dihapus
                setTimeout(function() {
                    alert("Data berhasil dihapus.");
                }, 100);
            });
        });

        // Menambahkan tombol-tombol aksi ke dalam container aksi
        actionContainer.append(undoButton, trashButton);
        // Menambahkan container aksi ke dalam container utama
        container.append(actionContainer);
    } else {
        // Jika buku belum selesai dibaca, tampilkan tombol "Selesai dibaca" dan tombol "Hapus Buku"
        const checkButton = document.createElement("button");
        checkButton.classList.add("checkButton"); // Menambahkan kelas "checkButton" ke tombol check
        checkButton.innerText = 'Selesai dibaca'; // Mengatur teks tombol check

        // Menambahkan event listener untuk tombol check
        checkButton.addEventListener("click", function() {
            addBookToCompleted(objectBook.id); // Memanggil fungsi addBookToCompleted dengan id buku sebagai parameter
        });

        // Membuat tombol "Hapus Buku"
        const trashButton = document.createElement("button");
        trashButton.classList.add("trashButton"); // Menambahkan kelas "trashButton" ke tombol trash
        trashButton.innerText = 'Hapus Buku'; // Mengatur teks tombol trash

        // Menambahkan event listener untuk tombol trash
        trashButton.addEventListener("click", function() {
            createCustomDialog("Hapus Buku", function() {
                removeBookFromCompleted(objectBook.id); // Memanggil fungsi removeBookFromCompleted dengan id buku sebagai parameter

                // Menampilkan pesan alert setelah buku dihapus
                setTimeout(function() {
                    alert("Data berhasil dihapus.");
                }, 100);
            });
        });

        // Menambahkan tombol-tombol aksi ke dalam container aksi
        actionContainer.append(checkButton, trashButton);
        // Menambahkan container aksi ke dalam container utama
        container.append(actionContainer);
    }
    return container; // Mengembalikan container utama sebagai hasil dari fungsi makeBook
};


// custome dialog
function createCustomDialog(message, confirmCallback) {
    // Buat latar belakang gelap dengan transparansi
    const darkBackground = document.createElement("div");
    darkBackground.classList.add("darkBackground");
    document.body.appendChild(darkBackground);

    // Buat elemen dialog
    const dialog = document.createElement("div");
    dialog.classList.add("customDialog");

    // Buat konten dialog
    const dialogContent = document.createElement("div");
    dialogContent.classList.add("dialog-content");

    // Tambahkan pesan ke dalam konten dialog
    const messageElement = document.createElement("h2");
    messageElement.textContent = message;
    dialogContent.appendChild(messageElement);

    // Tambahkan paragraf di bawah pesan
    const additionalMessage = document.createElement("p");
    additionalMessage.textContent = "Kamu akan menghapus buku ini, apakah kamu yakin?";
    dialogContent.appendChild(additionalMessage);

    // cencel button
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Tidak, Jangan Dihapus";
    cancelButton.className = 'cencelButton';
    cancelButton.style.padding = "20px 32px";
    cancelButton.style.borderRadius = "16px";
    cancelButton.style.fontSize = "18px"
    cancelButton.style.fontWeight = "600"
    cancelButton.style.backgroundColor = "#f0f0f0";
    cancelButton.addEventListener("click", function() {
        // Hapus dialog jika dibatalkan
        dialog.remove();
        // Hapus latar belakang gelap
        darkBackground.remove();
    });
    dialogContent.appendChild(cancelButton);

    // confirm button
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Ya, Hapus Buku!";
    confirmButton.className = 'confirButton';
    confirmButton.style.padding = "18px 32px";
    confirmButton.style.borderRadius = "16px";
    confirmButton.style.fontSize = "18px";
    confirmButton.style.color = "white";
    confirmButton.style.marginTop = "10px";
    confirmButton.style.fontWeight = "600"
    confirmButton.style.backgroundColor = "#FF204E";
    confirmButton.addEventListener("click", function() {
        confirmCallback();
        // Hapus dialog setelah dikonfirmasi
        dialog.remove();
        // Hapus latar belakang gelap
        darkBackground.remove();
    });
    dialogContent.appendChild(confirmButton);

    dialog.appendChild(dialogContent);

    document.body.appendChild(dialog);

    dialog.style.display = "block";
}

function addBookToCompleted(bookId) {
    // Mencari buku berdasarkan ID menggunakan fungsi findBook
    const bookTarget = findBook(bookId);

    // Memeriksa apakah buku ditemukan
    if (bookTarget == null) return; // Jika tidak ditemukan, keluar dari fungsi

    // Mengubah status isCompleted buku menjadi true (selesai dibaca)
    bookTarget.isCompleted = true;

    // Memicu event RENDER_EVENT untuk merender ulang data buku
    document.dispatchEvent(new Event(RENDER_EVENT));

    // Menyimpan data buku setelah diubah statusnya
    saveData();
};


function findBook(bookId) {
    // Melakukan iterasi (perulangan) pada setiap elemen dalam array books menggunakan for...of loop
    for (const bookItem of books) {
        // Memeriksa apakah ID buku pada bookItem sama dengan bookId yang diberikan sebagai parameter
        if (bookItem.id === bookId) {
            // Jika ID buku ditemukan, mengembalikan buku tersebut
            return bookItem;
        }
    }

    // Jika tidak ada buku dengan ID yang sesuai, mengembalikan nilai null
    return null;
};


function removeBookFromCompleted(bookId) {
    // Menggunakan fungsi findBookIndex untuk mencari index buku dalam array books berdasarkan ID
    const bookTarget = findBookIndex(bookId);

    // Memeriksa apakah buku ditemukan (bookTarget bukan -1)
    if (bookTarget === -1) return; // Jika tidak ditemukan, keluar dari fungsi

    // Menghapus buku dari array books berdasarkan index yang ditemukan
    books.splice(bookTarget, 1);

    // Memicu event RENDER_EVENT untuk merender ulang data buku setelah penghapusan
    document.dispatchEvent(new Event(RENDER_EVENT));

    // Menyimpan perubahan data setelah penghapusan
    saveData();
};


function undoBookFromCompleted(bookId) {
    // Mencari buku berdasarkan ID menggunakan fungsi findBook
    const bookTarget = findBook(bookId);

    // Memeriksa apakah buku ditemukan
    if (bookTarget == null) return; // Jika tidak ditemukan, keluar dari fungsi

    // Mengubah status isCompleted buku menjadi false (belum selesai dibaca)
    bookTarget.isCompleted = false;

    // Memicu event RENDER_EVENT untuk merender ulang data buku setelah perubahan status
    document.dispatchEvent(new Event(RENDER_EVENT));

    // Menyimpan perubahan data setelah perubahan status buku
    saveData();
};


function findBookIndex(bookId) {
    // Melakukan iterasi (perulangan) pada setiap index dalam array books menggunakan for...in loop
    for (const index in books) {
        // Memeriksa apakah ID buku pada books[index] sama dengan bookId yang diberikan sebagai parameter
        if (books[index].id === bookId) {
            // Jika ID buku yang dicari ditemukan, mengembalikan index tersebut
            return index;
        }
    }
    // Jika tidak ada buku dengan ID yang sesuai, mengembalikan nilai -1
    return -1;
}


document.addEventListener("DOMContentLoaded", function() {
    // Saat dokumen HTML telah dimuat sepenuhnya, eksekusi kode di dalam fungsi ini

    // Memilih elemen form dengan ID "formBuku" dan menambahkan event listener untuk event "submit"
    const saveForm = document.getElementById("formBuku");
    saveForm.addEventListener("submit", function(event) {
        // Menghentikan aksi default dari event "submit", yaitu mengirim data form ke server
        event.preventDefault();
        // Memanggil fungsi addBook() untuk menambahkan buku setelah form disubmit
        addBook();
    });

    // Memilih elemen form dengan ID "formSearch" dan menambahkan event listener untuk event "submit"
    const searchForm = document.getElementById("formSearch");
    searchForm.addEventListener("submit", function(event) {
        // Menghentikan aksi default dari event "submit", yaitu mengirim data form ke server
        event.preventDefault();
        // Memanggil fungsi searchBook() untuk melakukan pencarian buku setelah form disubmit
        searchBook();
    });

    // Memeriksa apakah penyimpanan lokal (localStorage) tersedia
    if (isStorageExist()) {
        // Jika penyimpanan lokal tersedia, maka akan memuat data dari penyimpanan lokal
        loadDataFromStorage();
    }
});



// fungsi pencarian
// Variabel debounceTimeout untuk menyimpan ID timeout
let debounceTimeout;

// Fungsi debounce untuk mengendalikan frekuensi pemanggilan fungsi
function debounce(func, delay) {
    // Menghapus timeout sebelumnya (jika ada)
    clearTimeout(debounceTimeout);
    // Mengatur timeout baru dengan fungsi yang diberikan dan delay yang ditentukan
    debounceTimeout = setTimeout(func, delay);
}

// Fungsi searchBook untuk melakukan pencarian buku
function searchBook() {
    // Mendapatkan nilai input pencarian dan mengubahnya menjadi huruf kecil
    const searchInput = document.getElementById("pencarian").value.toLowerCase();
    // Mendapatkan semua elemen buku dengan kelas ".item"
    const allBooks = document.querySelectorAll(".item");

    // Iterasi setiap buku dalam allBooks
    allBooks.forEach(book => {
        // Mengambil teks judul buku dan mengubahnya menjadi huruf kecil
        const title = book.querySelector(".itemTitle").innerText.toLowerCase();
        // Mengambil teks penulis buku dan mengubahnya menjadi huruf kecil
        const author = book.querySelector(".itemAuthor").innerText.toLowerCase();
        // Mengambil teks tahun terbit buku dan mengubahnya menjadi huruf kecil
        const year = book.querySelector(".itemYear").innerText.toLowerCase();

        // Memeriksa apakah input pencarian terdapat dalam judul, penulis, atau tahun terbit buku
        if (title.includes(searchInput) || author.includes(searchInput) || year.includes(searchInput)) {
            // Jika ditemukan, tampilkan buku
            book.style.display = "block";
        } else {
            // Jika tidak ditemukan, sembunyikan buku
            book.style.display = "none";
        }
    });
}


document.getElementById("pencarian").addEventListener("input", function() {
    // Mengatur delay sebesar 300 milidetik
    debounce(searchBook, 300);
});