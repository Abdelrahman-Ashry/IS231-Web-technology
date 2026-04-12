
const borrowBtn = document.getElementById("borrowBtn");
const quantityInput = document.getElementById("quantity");
const message = document.getElementById("message");
const title = document.getElementById("bookTitle");
const author = document.getElementById("bookAuthor");
const category = document.getElementById("bookCategory")
const year = document.getElementById("bookYear")


function goToBorrow(id) {  
    window.location.href = `borrow.html?id=${id}`;
}
function getIdFromURL(){  
    const params = new URLSearchParams(window.location.search);  
    return parseInt(params.get("id"));  
}
function getBookById(id){
    return books.find(book => book.id === id);
}
function isAvailable(book){
    return book.copies > 0;
}
function processBorrow(book){
    const quantity = parseInt(quantityInput.value);
    book.copies -= quantity;
    borrowedBooks.push(book);
}
function showMessage(msg){
    message.textContent = msg;
    setTimeout(() => {
        message.textContent = "";
    }, 4000);   
}
function getTodayDate(){
    const today = new Date();
    return today.toISOString().split("T")[0];
}


function loadBookDetails(){

    const id = getIdFromURL();
    const book = getBookById(id);

    if(!book){
        showMessage("Book not found");
        return;
    }
    
    quantityInput.max = book.copies;

    document.getElementById("bookTitle").textContent = "Title: " + book.name;
    document.getElementById("bookAuthor").textContent = "Author: " + book.author;
    document.getElementById("bookCategory").textContent = "Category: " + book.category;
    document.getElementById("bookYear").textContent = "Year: " + book.year;
    document.getElementById("bookCover").src = book.cover

    if(!isAvailable(book)){
        borrowBtn.disabled = true;
        quantityInput.disabled = true;
        showMessage("Book is out of stock");
    }
}

function borrowBook(event){
    event.preventDefault()

    const id = getIdFromURL();
    const book = getBookById(id);
    const borrowDate = document.getElementById("bdate");
    const returnDate = document.getElementById("rdate");
    const quantity = parseInt(quantityInput.value);

    if(!book){
        showMessage("Book not found");
    }
    if(borrowDate.value < getTodayDate()){
        showMessage("Borrow date cannot be in the past");
        return;
    }
    if(returnDate.value <= borrowDate.value){
        showMessage("Return date must be after borrow date");
        return;
    }
    if(quantity > book.copies){
        showMessage("Not enough copies available");
        return;
    }
    if (!quantity || quantity<1){
        showMessage("Enter vaild quantity");
    }

    processBorrow(book);
    
    quantityInput.max = book.copies;

    showMessage("Book borrowed successfully!!"); 

    if(book.copies === 0){
        borrowBtn.disabled = true;
        quantityInput.disabled = true;
        setTimeout(() => {
            showMessage("Book is now out of stock");
        }, 4000);
    }

}

const container = document.getElementById("booksContainer");

const borrowForm = document.getElementById("borrowForm");
borrowForm.addEventListener("submit", borrowBook);
window.onload = loadBookDetails;
