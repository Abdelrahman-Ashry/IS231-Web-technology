document.addEventListener("DOMContentLoaded", () => {

    const coverInput = document.getElementById("coverInput");
    const coverPhoto = document.getElementById("coverPhoto");
    const deleteCoverBtn = document.getElementById("deleteCover");
    const deleteCoverInput = document.getElementById("deleteCoverInput");
    const cancelBtn = document.getElementById("cancelBtn");

    if (coverInput) {
        coverInput.addEventListener("change", function () {
            const file = this.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                this.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                coverPhoto.src = e.target.result;
            };
            reader.readAsDataURL(file);
            deleteCoverInput.value = "";
        });
    }

    if (deleteCoverBtn) {
        deleteCoverBtn.addEventListener("click", () => {
            if (confirm("Delete current cover image?")) {
                coverPhoto.src = "/static/img/default-cover.jpg";
                deleteCoverInput.value = "1";
                coverInput.value = "";
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "/library/admin-dashboard/";
        });
    }

});