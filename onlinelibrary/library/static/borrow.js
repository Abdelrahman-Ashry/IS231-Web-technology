
// Set min date for borrow date = today

const today = new Date().toISOString().split('T')[0];
const bdateInput = document.getElementById('borrow_date');
const rdateInput = document.getElementById('return_date');


bdateInput.min = today;

bdateInput.addEventListener('change', () => {
    rdateInput.min = bdateInput.value;
    if (rdateInput.value && rdateInput.value <= bdateInput.value) {
        rdateInput.value = '';
    }
});


document.getElementById('borrowForm').addEventListener('submit', (e) => {
    const borrowDate = bdateInput.value;
    const returnDate = rdateInput.value;

    if (!borrowDate || !returnDate) {
        alert('Please select both dates.');
        return;
    }
    if (returnDate <= borrowDate) {
        alert('Return date must be after borrow date.');
        return;
    }
});