function validateForm() {
    let title = document.querySelector("input[placeholder='Enter Book Title']").value;
    let year = document.querySelector("input[placeholder='Enter Publication Year']").value;

    if (title === "") {
        alert("Please enter book title");
        return false;
    }

    if (year < 1000 || year > 2026) {
        alert("Enter a valid year");
        return false;
    }

    return true;
}
function saveBook() {
    let title = document.querySelector("input[placeholder='Enter Book Title']").value;

    localStorage.setItem("bookTitle", title);

    alert("Book Saved!");
}
function filterByCategory(category) {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    let filtered = books.filter(book => book.category === category);

    console.log(filtered);
}
function countBooks() {
    let books = JSON.parse(localStorage.getItem("books")) || [];

    document.getElementById("count").innerText = books.length;
}
function clearForm() {
    if (confirm("Are you sure?")) {
        document.querySelectorAll("input, textarea").forEach(el => el.value = "");
    }
}
function showMessage() {
    document.getElementById("msg").innerText = "✅ Book Added Successfully!";
}
