let books = [
    {   id: 1001,
        name: "The Great Gatsby", 
        author: "F. Scott Fitzgerald", 
        category: "Fiction", 
        year: "1950", 
        copies: 5,
        cover: "images/The_Great_Gatsby_Cover.jpg"
    },
    {   id: 1002, 
        name: "Introduction to Algorithms", 
        author: "Thomas H. Cormen", 
        category: "Education", 
        year: "1930", 
        copies: 4,
        cover: "images/Algorithms.jpg"
    },
    {   id: 1003,
        name: "Python Programming",     
        author: "John Zelle", 
        category: "Education", 
        year: "1980", 
        copies: 0,
        cover: "images/pythonProgramming.png"
    }
];
let borrowedBooks = [];

const borrowBtn = document.getElementById("borrowBtn");
const message = document.getElementById("message");


//helper functions
function findBookById(id){
    return books.find(book => book.id === id);
}
function isAvailable(book){
    return book.copies > 0;
}
function showMessage(msg){
    message.textContent(msg);
}
function processBorrow(book){
    book.copies = book.copies - 1;
    borrowedBooks.push(book);
}


