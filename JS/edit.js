const params = new URLSearchParams(window.location.search);
const id = Number(params.get('id'));

const books = getBooks();
const book = books.find(b => b.id === id);

if (!book) {
    alert('Book not found!');
    window.location.href = 'admin_dashboard.html';
}

// Populate form
document.getElementById('isbn').value = book.id;
document.getElementById('bookName').value = book.name;
document.getElementById('author').value = book.author;
document.getElementById('category').value = book.category;
document.getElementById('availability').value = book.copies > 0 ? 'Available' : 'Not Available';
document.getElementById('year').value = book.year;
document.getElementById('copies').value = book.copies;
document.getElementById('description').value = book.description || '';
document.getElementById('coverPhoto').src = book.cover;

// Change cover image
const coverInput = document.getElementById('coverInput');
coverInput.addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('coverPhoto').src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// Delete cover
document.getElementById('deleteCover').addEventListener('click', () => {
    if (confirm('Delete current cover image?')) {
        document.getElementById('coverPhoto').src = '';
        coverInput.value = '';
    }
});

// Form submit
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const updatedData = {
        name: document.getElementById('bookName').value.trim(),
        author: document.getElementById('author').value.trim(),
        category: document.getElementById('category').value,
        year: Number(document.getElementById('year').value),
        copies: Number(document.getElementById('copies').value),
        description: document.getElementById('description').value.trim(),
        cover: document.getElementById('coverPhoto').src
    };

    if (!updatedData.name || !updatedData.author) {
        alert('Book name and author are required.');
        return;
    }
    if (updatedData.year < 1800 || updatedData.year > 2026) {
        alert('Please enter a valid year (1800-2026).');
        return;
    }
    if (updatedData.copies < 0) {
        alert('Copies cannot be negative.');
        return;
    }

    if (confirm('Update this book?')) {
        updateBook(book.id, updatedData);
        alert('Book updated successfully!');
        window.location.href = 'admin_dashboard.html';
    }
});

// Clear button
document.getElementById('clearBtn').addEventListener('click', (e) => {
    if (!confirm('Clear all fields?')) {
        e.preventDefault();
        return;
    }
    setTimeout(() => {
        document.getElementById('coverPhoto').src = '';
        alert('Form cleared');
    }, 100);
});
document.getElementById('cancelBtn').addEventListener('click', function() {
    window.location.href = "{% url 'library:admin_dashboard' %}";
});