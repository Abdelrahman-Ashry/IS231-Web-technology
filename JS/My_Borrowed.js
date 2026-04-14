document.addEventListener('DOMContentLoaded', () => {
    const borrowed = getBorrowedBooks();
    const grid = document.querySelector('.books-grid');
    if (!grid) return;

    grid.innerHTML = '';

    if (borrowed.length === 0) {
        grid.innerHTML = '<p style="color:#999; padding:20px;">You haven\'t borrowed any books yet.</p>';
        return;
    }

    borrowed.forEach(item => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-cover">
                <img src="${item.cover}" alt="${item.name}">
                <span class="badge badge-borrowed">Borrowed</span>
            </div>
            <div class="book-info">
                <span class="book-id">#${item.id}</span>
                <h3 class="book-title">${item.name}</h3>
                <p class="book-author">${item.author}</p>
                <div class="book-meta">
                    <span class="meta-tag">${item.category}</span>
                </div>
            </div>
            <div class="book-dates">
                <div class="date-row">
                    <span class="date-label">📅 Borrowed</span>
                    <span class="date-value">${item.borrowDate}</span>
                </div>
                <div class="date-row">
                    <span class="date-label">🔁 Return by</span>
                    <span class="date-value">${item.returnDate}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
});