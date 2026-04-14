const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));
const books = getBooks();
const book = books.find(b => b.id === id);

if (!book) {
    alert('Book not found');
    window.location.href = 'user_dashboard.html';
}

document.querySelector('.book-id').textContent = `#${book.id}`;
document.querySelector('.book-title').textContent = book.name;
document.querySelector('.book-author').textContent = book.author;
document.querySelector('.detail-value.category').textContent = book.category;
document.querySelector('.detail-value.year').textContent = book.year;
document.querySelector('.detail-value.copies').textContent = `${book.copies} copies`;
document.querySelector('.description-box p').textContent = book.description;
document.querySelector('.book-image-side img').src = book.cover;

const badge = document.querySelector('.badge');
const borrowBtn = document.querySelector('.btn-borrow');
if (book.copies > 0) {
    badge.className = 'badge badge-available';
    badge.textContent = 'Available';
    borrowBtn.style.display = 'block';
    borrowBtn.addEventListener('click', () => {
        window.location.href = `borrow.html?id=${book.id}`;
    });
} else {
    badge.className = 'badge badge-unavailable';
    badge.textContent = 'Not Available';
    borrowBtn.style.display = 'none';
    const disabledBtn = document.createElement('button');
    disabledBtn.className = 'btn-borrow-disabled';
    disabledBtn.textContent = 'Not Available';
    disabledBtn.disabled = true;
    borrowBtn.parentNode.replaceChild(disabledBtn, borrowBtn);
}