const STORAGE_BOOKS = 'library_books';
const STORAGE_BORROWED = 'borrowed_books';
const STORAGE_DELETED = 'deleted_books';

// Default books data
const defaultBooks = [
    {
        id: 1001,
        name: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        year: "1950",
        copies: 2,
        cover: "../images/The_Great_Gatsby_Cover.jpg",
        description: "A classic novel set in the Jazz Age that explores themes of decadence, idealism, and resistance to change, creating a portrait of the Roaring Twenties."
    },
    {
        id: 1002,
        name: "Introduction to Algorithms",
        author: "Thomas H. Cormen",
        category: "Education",
        year: "1930",
        copies: 4,
        cover: "../images/Algorithms.jpg",
        description: "A comprehensive book on computer programming, authored by Thomas H. Cormen, covering a broad range of algorithms in depth."
    },
    {
        id: 1003,
        name: "Python Programming",
        author: "John Zelle",
        category: "Education",
        year: "1980",
        copies: 3,
        cover: "../images/pythonProgramming.png",
        description: "A comprehensive guide to mastering Python, starting from fundamental concepts like variables, data types, and control structures."
    }
];

// Initialize books
function initBooks() {
    if (!localStorage.getItem(STORAGE_BOOKS)) {
        localStorage.setItem(STORAGE_BOOKS, JSON.stringify(defaultBooks));
    }
}

// Get all books
function getBooks() {
    initBooks();
    return JSON.parse(localStorage.getItem(STORAGE_BOOKS));
}

// Save books
function saveBooks(books) {
    localStorage.setItem(STORAGE_BOOKS, JSON.stringify(books));
}

// Add new book
function addBook(book) {
    const books = getBooks();
    const maxId = books.reduce((max, b) => Math.max(max, b.id), 1000);
    book.id = maxId + 1;
    books.push(book);
    saveBooks(books);
    return book;
}

// Update book
function updateBook(id, newData) {
    const books = getBooks();
    const index = books.findIndex(b => b.id === id);
    if (index !== -1) {
        books[index] = { ...books[index], ...newData };
        saveBooks(books);
        return true;
    }
    return false;
}

// ----- TRASH / DELETED BOOKS -----
function getDeletedBooks() {
    const stored = localStorage.getItem(STORAGE_DELETED);
    return stored ? JSON.parse(stored) : [];
}

function saveDeletedBooks(deleted) {
    localStorage.setItem(STORAGE_DELETED, JSON.stringify(deleted));
}

// Move book to trash (soft delete)
function deleteBookById(id) {
    let books = getBooks();
    const bookToDelete = books.find(b => b.id === id);
    if (!bookToDelete) return;

    books = books.filter(b => b.id !== id);
    saveBooks(books);

    const deleted = getDeletedBooks();
    deleted.push({ ...bookToDelete, deletedAt: new Date().toISOString() });
    saveDeletedBooks(deleted);
}

// Restore book from trash
function restoreDeletedBook(id) {
    const deleted = getDeletedBooks();
    const index = deleted.findIndex(b => b.id === id);
    if (index === -1) return false;

    const book = deleted[index];
    deleted.splice(index, 1);
    saveDeletedBooks(deleted);

    delete book.deletedAt;
    const books = getBooks();
    books.push(book);
    saveBooks(books);
    return true;
}

// Permanently delete from trash
function permanentlyDeleteBook(id) {
    let deleted = getDeletedBooks();
    deleted = deleted.filter(b => b.id !== id);
    saveDeletedBooks(deleted);
}

// ----- BORROWED BOOKS -----
function getBorrowedBooks() {
    const stored = localStorage.getItem(STORAGE_BORROWED);
    return stored ? JSON.parse(stored) : [];
}

function saveBorrowedBooks(borrowed) {
    localStorage.setItem(STORAGE_BORROWED, JSON.stringify(borrowed));
}

function borrowBookAction(bookId, borrowDate, returnDate, quantity = 1) {
    const books = getBooks();
    const book = books.find(b => b.id === bookId);
    if (!book || book.copies < quantity) return false;

    book.copies -= quantity;
    saveBooks(books);

    const borrowed = getBorrowedBooks();
    borrowed.push({
        id: book.id,
        name: book.name,
        author: book.author,
        category: book.category,
        cover: book.cover,
        borrowDate: borrowDate,
        returnDate: returnDate,
        borrowedCopies: quantity
    });
    saveBorrowedBooks(borrowed);
    return true;
}

// Restore default books (add missing only)
function restoreDefaultBooks() {
    const current = getBooks();
    defaultBooks.forEach(defBook => {
        if (!current.some(b => b.id === defBook.id)) {
            current.push(defBook);
        }
    });
    saveBooks(current);
}