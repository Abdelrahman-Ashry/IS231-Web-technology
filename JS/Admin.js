// ===== ADMIN DASHBOARD =====

window.onload = function () {
    loadBooks();
};

function loadBooks() {
    const books = getBooks();   // from data.js
    const grid = document.querySelector('.books-grid');

    grid.innerHTML = "";

    if (books.length === 0) {
        grid.innerHTML = "<p style='color:#999; padding:20px;'>No books available.</p>";
        return;
    }

    books.forEach(function (book) {
        const isAvailable = book.copies > 0;
        const badgeClass = isAvailable ? "badge-available" : "badge-unavailable";
        const badgeText = isAvailable ? "Available" : "Not Available";

        const card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
            <div class="book-cover">
                <img src="${book.cover}" alt="${book.name}">
                <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="book-info">
                <span class="book-id">#${book.id}</span>
                <h3 class="book-title">${book.name}</h3>
                <p class="book-author">${book.author}</p>
                <div class="book-meta">
                    <span class="meta-tag">${book.category}</span>
                    <span class="meta-tag">${book.year}</span>
                    <span class="meta-copies">${book.copies} copies</span>
                </div>
                <div class="book-actions">
                    <a href="edit.html?id=${book.id}" class="btn-edit">✏️ Edit</a>
                    <a href="#" class="btn-delete" onclick="deleteBook(${book.id})">🗑️ Delete</a>
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}

function deleteBook(id) {
    if (!confirm("Are you sure you want to delete this book?")) return;

    let books = getBooks();
    books = books.filter(book => book.id !== id);
    saveBooks(books);   // from data.js

    alert("Book deleted successfully.");
    loadBooks();    // refresh the grid
}