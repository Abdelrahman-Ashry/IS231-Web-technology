document.addEventListener('DOMContentLoaded', () => {

    const searchBtn      = document.querySelector('.search-bar button');
    const searchInput    = document.getElementById('search_query');
    const categorySelect = document.getElementById('search_category');
    const bookCards      = document.querySelectorAll('.book-card');

    // ── Filter books when Search button is clicked ──
    searchBtn.addEventListener('click', function (e) {
        e.preventDefault();
        filterBooks();
    });

    // ── Also filter while typing ──
    searchInput.addEventListener('input', filterBooks);
    categorySelect.addEventListener('change', filterBooks);

    function filterBooks() {
        const searchTerm       = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();

        bookCards.forEach(card => {
            const title    = card.querySelector('.book-title').textContent.toLowerCase();
            const author   = card.querySelector('.book-author').textContent.toLowerCase();
            const category = card.querySelector('.meta-tag').textContent.toLowerCase();

            const matchesSearch   = searchTerm === "" || title.includes(searchTerm) || author.includes(searchTerm);
            const matchesCategory = selectedCategory === "" || category === selectedCategory;

            card.style.display = (matchesSearch && matchesCategory) ? "flex" : "none";
        });
    }

});