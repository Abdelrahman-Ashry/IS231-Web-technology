window.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadDeletedBooks();

    const restoreDefaultBtn = document.getElementById('restoreDefaultBtn');
    if (restoreDefaultBtn) {
        restoreDefaultBtn.addEventListener('click', () => {
            if (confirm('Add missing default books?')) {
                restoreDefaultBooks();
                loadBooks();
                alert('Default books restored.');
            }
        });
    }
});

function loadBooks() {
    const books = getBooks();
    const grid = document.querySelector('.books-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (books.length === 0) {
        grid.innerHTML = '<p style="color:#999; padding:20px;">No books available.</p>';
        return;
    }

    books.forEach(book => {
        const isAvailable = book.copies > 0;
        const badgeClass = isAvailable ? 'badge-available' : 'badge-unavailable';
        const badgeText = isAvailable ? 'Available' : 'Not Available';

        const card = document.createElement('div');
        card.className = 'book-card';
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
                    <a href="#" class="btn-delete" data-id="${book.id}">🗑️ Delete</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = Number(btn.dataset.id);
            if (confirm('Move this book to trash?')) {
                deleteBookById(id);
                loadBooks();
                loadDeletedBooks();
            }
        });
    });
}

function loadDeletedBooks() {
    const deleted = getDeletedBooks();
    const container = document.getElementById('deletedBooksContainer');
    if (!container) return;

    if (deleted.length === 0) {
        container.innerHTML = '<p style="color:#999; padding:20px;">No deleted books.</p>';
        return;
    }

    let html = '<div class="deleted-list">';
    deleted.forEach(book => {
        html += `
            <div class="deleted-item">
                <img src="${book.cover}" alt="${book.name}">
                <div class="deleted-info">
                    <strong>${book.name}</strong> by ${book.author} (ID: ${book.id})<br>
                    <small>Deleted: ${new Date(book.deletedAt).toLocaleString()}</small>
                </div>
                <button class="btn-restore" data-id="${book.id}">↻ Restore</button>
                <button class="btn-permanent-delete" data-id="${book.id}">🗑️ Delete Permanently</button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    document.querySelectorAll('.btn-restore').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            if (confirm('Restore this book?')) {
                restoreDeletedBook(id);
                loadBooks();
                loadDeletedBooks();
                alert('Book restored.');
            }
        });
    });

    document.querySelectorAll('.btn-permanent-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = Number(btn.dataset.id);
            if (confirm('Permanently delete this book? This cannot be undone.')) {
                permanentlyDeleteBook(id);
                loadDeletedBooks();
                alert('Book permanently deleted.');
            }
        });
    });
}