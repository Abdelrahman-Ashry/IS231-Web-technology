document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.book-grid');
    const bookCards = document.querySelectorAll('.book-card');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    // Search elements
    const searchInput = document.getElementById('search-input');
    const categorySelect = document.getElementById('category');

    let currentScroll = 0;

    // --- SLIDING LOGIC ---
    function moveSlider(direction) {
        // Find visible cards (so we don't scroll past 'hidden' searched books)
        const visibleCards = Array.from(bookCards).filter(c => c.style.display !== 'none');
        if (visibleCards.length === 0) return;

        const cardWidth = visibleCards[0].offsetWidth + 25; // width + gap
        const maxScroll = grid.scrollWidth - grid.parentElement.offsetWidth;

        if (direction === 'next') {
            currentScroll += cardWidth;
            if (currentScroll > maxScroll) currentScroll = maxScroll;
        } else {
            currentScroll -= cardWidth;
            if (currentScroll < 0) currentScroll = 0;
        }

        grid.style.transform = `translateX(-${currentScroll}px)`;
    }

    nextBtn.addEventListener('click', () => moveSlider('next'));
    prevBtn.addEventListener('click', () => moveSlider('prev'));

    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();

        // Reset slider position when searching
        currentScroll = 0;
        grid.style.transform = `translateX(0px)`;

        bookCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('.author').textContent.toLowerCase();
            const genre = card.querySelector('.genre-tag').textContent.toLowerCase();

            const matchesSearch = title.includes(searchTerm) || author.includes(searchTerm);
            const matchesCategory = selectedCategory === "" || genre === selectedCategory;

            card.style.display = (matchesSearch && matchesCategory) ? "block" : "none";
        });
    }

    searchInput.addEventListener('input', filterBooks);
    categorySelect.addEventListener('change', filterBooks);
});