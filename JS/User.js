document.addEventListener('DOMContentLoaded', () => {
    loadUserBooks();

    const searchInput = document.getElementById('search_query');
    const categorySelect = document.getElementById('search_category');
    const searchBtn = document.querySelector('.search-bar button');

    function filterBooks() {
        const term = searchInput.value.toLowerCase();
        const cat = categorySelect.value.toLowerCase();
        document.querySelectorAll('.book-card').forEach(card => {
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const author = card.querySelector('.book-author').textContent.toLowerCase();
            const category = card.querySelector('.meta-tag').textContent.toLowerCase();
            const matchSearch = term === '' || title.includes(term) || author.includes(term);
            const matchCat = cat === '' || category === cat;
            card.style.display = (matchSearch && matchCat) ? 'flex' : 'none';
        });
    }

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBooks();
    });
    searchInput.addEventListener('input', filterBooks);
    categorySelect.addEventListener('change', filterBooks);
});

function loadUserBooks() {
    const books = getBooks();
    const grid = document.querySelector('.books-grid');
    if (!grid) return;

    grid.innerHTML = '';

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
                <h3 class="book-title"><a href="book_details.html?id=${book.id}">${book.name}</a></h3>
                <p class="book-author">${book.author}</p>
                <div class="book-meta">
                    <span class="meta-tag">${book.category}</span>
                </div>
            </div>
            <div class="book-actions">
                <a href="book_details.html?id=${book.id}" class="btn-borrow">View Details</a>
            </div>
        `;
        grid.appendChild(card);
    });
}