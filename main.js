document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category');
    const searchButton = document.getElementById('search-button');
    const bookCards = document.querySelectorAll('.book-card');

    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();

        bookCards.forEach(card => {
            // Grab the text content from the card
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('.author').textContent.toLowerCase();
            const genre = card.querySelector('.genre-tag').textContent.toLowerCase();

            // Check if search matches title OR author
            const matchesSearch = title.includes(searchTerm) || author.includes(searchTerm);
            
            // Check if category matches (or if "All" is selected)
            const matchesCategory = selectedCategory === "" || genre === selectedCategory;

            // Show card only if BOTH match
            if (matchesSearch && matchesCategory) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    }

    // Trigger filter when clicking the search button
    searchButton.addEventListener('click', filterBooks);

    // OPTIONAL: Trigger filter as the user types (Real-time search)
    searchInput.addEventListener('input', filterBooks);
    
    // Trigger filter when category changes
    categorySelect.addEventListener('change', filterBooks);
});