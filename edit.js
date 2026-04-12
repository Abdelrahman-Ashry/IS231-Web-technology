const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

function findBookById(id){
    return books.find(b => b.id === id);
}

const book = findBookById(id);

const isbn = document.getElementById("isbn");
const bookName = document.getElementById("bookName");
const author = document.getElementById("author");
const availability = document.getElementById("availability");
const year = document.getElementById("year");
const copies = document.getElementById("copies");
const description = document.getElementById("description");
const category = document.getElementById("category");

const coverPhoto = document.getElementById("coverPhoto");
const coverInput = document.getElementById("coverInput");
const deleteCover = document.getElementById("deleteCover");

const form = document.getElementById("editForm")
const clearBtn = document.getElementById("clearBtn");

//Show book data
if(book){
    isbn.value=book.id;
    bookName.value=book.name;
    author.value=book.author;
    category.value = book.category;
    availability.value = book.availability;
    year.value = book.year;
    copies.value = book.copies;
    description.value = book.description || "";
    coverPhoto.src = book.cover;
}

else{
    alert("Book not found!");
}

//change and delete image button
coverInput.addEventListener("change",function(){
    const file = this.files[0];
    if(!file) return;

    if(!file.type.startsWith("image/")){
        alert("Please upload a valid image file!");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e){
        coverPhoto.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
});

deleteCover.addEventListener("click",function(){
    if(!confirm("Delete current cover image?"))
        return;

    coverPhoto.src = "";
    coverInput.value = "";
});

form.addEventListener("submit",function(e){
    e.preventDefault();

    if(!book)return;


//Input validation
if(bookName.value.trim() === ""){
    alert("Book name is required!");
    return;
}
if(author.value.trim() === ""){
    alert("Author is required!");
    return;
}

if(year.value < 1800 || year.value > 2026){
    alert("Enter a valid year!");
}

if(copies.value < 0){
    alert("Copies cannot be negative!");
    return;
}


//Update and clear form buttons
if(!confirm("Are you sure you want to update this book?")){
    return;
}

book.name = bookName.value;
book.author = author.value;
book.category = category.value;
book.year = Number(year.value);
book.copies = Number(copies.value);
book.description = description.value;

if(coverPhoto.src){
    book.cover = coverPhoto.src;
}

alert("Book updated successfully!");
});


clearBtn.addEventListener("click",function(e){
    if(!confirm("Are you sure you want to clear all fields?"))
    {
        e.preventDefault();
        return;
    }

    setTimeout(() => {
        coverPhoto.src = "";
        alert("Form cleared");
    },100);
});