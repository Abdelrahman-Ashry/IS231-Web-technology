// ==================== borrow.js ====================
const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));

const books = getBooks();
const book = books.find(b => b.id === id);

if (!book) {
    alert('Book not found');
    window.location.href = 'user_dashboard.html';
}

// Display book details
document.getElementById('bookTitle').textContent = `Title: ${book.name}`;
document.getElementById('bookAuthor').textContent = `Author: ${book.author}`;
document.getElementById('bookCategory').textContent = `Category: ${book.category}`;
document.getElementById('bookYear').textContent = `Year: ${book.year}`;
document.getElementById('bookCover').src = book.cover;

const quantityInput = document.getElementById('quantity');
quantityInput.max = book.copies;

if (book.copies === 0) {
    quantityInput.disabled = true;
    document.getElementById('borrowBtn').disabled = true;
    document.getElementById('message').textContent = 'This book is out of stock.';
}

// Set min date for borrow date = today
const today = new Date().toISOString().split('T')[0];
document.getElementById('bdate').min = today;

document.getElementById('borrowForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const borrowDate = document.getElementById('bdate').value;
    const returnDate = document.getElementById('rdate').value;
    const quantity = parseInt(quantityInput.value);

    if (!borrowDate || !returnDate) {
        alert('Please select both dates.');
        return;
    }
    if (borrowDate < today) {
        alert('Borrow date cannot be in the past.');
        return;
    }
    if (returnDate <= borrowDate) {
        alert('Return date must be after borrow date.');
        return;
    }
    if (quantity < 1 || quantity > book.copies) {
        alert(`Please enter a quantity between 1 and ${book.copies}.`);
        return;
    }

    const success = borrowBookAction(book.id, borrowDate, returnDate, quantity);
    if (success) {
        alert('Book borrowed successfully!');
        window.location.href = 'my_borrowed.html';
    } else {
        alert('Failed to borrow book. Please try again.');
    }
});