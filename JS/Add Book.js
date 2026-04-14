function validateForm() {
    const title = document.querySelector('input[placeholder="Enter Book Title"]').value.trim();
    const author = document.querySelector('input[placeholder="Enter Author Name"]').value.trim();
    const year = document.querySelector('input[placeholder="Enter Publication Year"]').value;
    const copies = document.querySelector('input[placeholder="Enter Number of Copies"]').value;
    const category = document.querySelector('select[name="choice"]').value;
    const status = document.querySelectorAll('select[name="choice"]')[1].value;
    const description = document.querySelector('textarea').value.trim();

    if (!title || !author) {
        alert('Title and Author are required.');
        return false;
    }
    if (year < 1000 || year > 2026) {
        alert('Enter a valid publication year.');
        return false;
    }
    if (copies < 0) {
        alert('Number of copies cannot be negative.');
        return false;
    }
    if (!category) {
        alert('Please select a category.');
        return false;
    }
    if (!status) {
        alert('Please select a status.');
        return false;
    }
    return true;
}

function addNewBook(event) {
    event.preventDefault();
    if (!validateForm()) return;

    const title = document.querySelector('input[placeholder="Enter Book Title"]').value.trim();
    const author = document.querySelector('input[placeholder="Enter Author Name"]').value.trim();
    const year = document.querySelector('input[placeholder="Enter Publication Year"]').value;
    const copies = parseInt(document.querySelector('input[placeholder="Enter Number of Copies"]').value);
    const category = document.querySelector('select[name="choice"]').value;
    const status = document.querySelectorAll('select[name="choice"]')[1].value;
    const description = document.querySelector('textarea').value.trim();

    // Handle image upload
    const fileInput = document.querySelector('input[type="file"]');
    let coverPath = '../images/default-cover.jpg'; // fallback

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newBook = {
                    name: title,
                    author: author,
                    category: category,
                    year: year,
                    copies: copies,
                    description: description,
                    cover: e.target.result,
                    status: status
                };
                addBook(newBook);
                document.getElementById('msg').innerText = '✅ Book Added Successfully!';
                document.querySelector('button[type="reset"]').click(); // clear form
            };
            reader.readAsDataURL(file);
            return; // Exit to wait for reader
        }
    }

    // No image or invalid image
    const newBook = {
        name: title,
        author: author,
        category: category,
        year: year,
        copies: copies,
        description: description,
        cover: coverPath,
        status: status
    };
    addBook(newBook);
    document.getElementById('msg').innerText = '✅ Book Added Successfully!';
    document.querySelector('button[type="reset"]').click();
}

function clearForm() {
    if (confirm('Are you sure you want to clear all fields?')) {
        document.querySelectorAll('input, textarea').forEach(el => el.value = '');
        document.querySelector('select[name="choice"]').selectedIndex = 0;
        document.querySelectorAll('select[name="choice"]')[1].selectedIndex = 0;
        document.getElementById('msg').innerText = '';
    }
}

// Attach event to Add Book button
document.addEventListener('DOMContentLoaded', () => {
    const addBtn = document.querySelector('button[type="submit"]');
    if (addBtn) {
        addBtn.addEventListener('click', addNewBook);
    }
});