(function () {
    if (document.body.dataset.page !== "dashboard") return;

    const update = document.querySelector(".page-update");

    if (update) {
        update.textContent = `Mis à jour : ${new Date().toLocaleDateString("fr-FR")}`;
    }

    const calendar = document.querySelector(".calendar-mini");

    if (calendar) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const firstDay = new Date(year, month, 1);
        const days = new Date(year, month + 1, 0).getDate();
        const offset = (firstDay.getDay() + 6) % 7;
        const labels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

        const blanks = Array.from({ length: offset }, () => {
            return '<span class="calendar-empty"></span>';
        }).join("");

        const buttons = Array.from({ length: days }, (_, index) => {
            const day = index + 1;
            return `<button class="${day === now.getDate() ? "active" : ""}" type="button">${day}</button>`;
        }).join("");

        calendar.innerHTML = labels.map((label) => `<span>${label}</span>`).join("") + blanks + buttons;
    }
})();