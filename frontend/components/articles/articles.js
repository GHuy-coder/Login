/* =========================================================
   BLOG HỌC SINH — ARTICLES
   ========================================================= */


/* =========================================================
   ARTICLE CARD NAVIGATION
   ========================================================= */

const articleCards = document.querySelectorAll(".article-card");


articleCards.forEach((card) => {

    card.addEventListener("click", (event) => {

        /* Don't open article when clicking save button */

        if (event.target.closest(".save-article")) {
            return;
        }


        const articleId = card.dataset.article;


        if (!articleId) {
            return;
        }


        window.location.href =
            `details/details.html?id=${articleId}`;

    });


    /* Keyboard accessibility */

    card.setAttribute("tabindex", "0");


    card.addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            const articleId = card.dataset.article;


            if (!articleId) {
                return;
            }


            window.location.href =
                `details/details.html?id=${articleId}`;

        }

    });

});



/* =========================================================
   SAVE ARTICLE
   ========================================================= */

const saveButtons =
    document.querySelectorAll(".save-article");


saveButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();


        button.classList.toggle("saved");


        if (
            button.classList.contains("saved")
        ) {

            button.textContent = "♥";

        } else {

            button.textContent = "♡";

        }

    });

});