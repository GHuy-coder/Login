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



const apiUrl = "http://127.0.0.1:5000/api"

async function getArticles() {
    try {
        const response = await fetch(`${apiUrl}/articles`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();

        console.log("Fetched articles:", data);
        return data;
    } catch (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }
}

function renderArticles(articles) {
    const articlesGrid = document.getElementById("articleGrid");
    articlesGrid.innerHTML = articles.map(article => `
        <article class="article-card" data-article="${article.slug}" tabindex="0">
            <div class="article-cover">
                <img src="${article.cover}" alt="${article.title}">
                <span class="category-tag ${article.category_class}">${article.category}</span>
            </div>
            <div class="article-content">
                <h2>${article.title}</h2>
                <p>${article.introduction}</p>
            </div>
            <div class="article-meta">
                <div class="author">
                    <img src="${article.author_avatar}" alt="${article.author}">
                    <div>
                        <strong>${article.author}</strong>
                        <span>${article.reading_time}</span>
                    </div>
                </div>
                <button type="button" class="save-article" aria-label="Lưu bài viết">♡</button>
            </div>
        </article>
    `).join("");
}

const articlesGrid = document.getElementById("articleGrid");
articlesGrid.addEventListener("click", event => {
    const saveButton = event.target.closest(".save-article");
    if (saveButton) {
        saveButton.classList.toggle("saved");
        saveButton.textContent = saveButton.classList.contains("saved") ? "♥" : "♡";
        return;
    }

    const card = event.target.closest(".article-card");
    if (card?.dataset.article) {
        window.location.href = `details/details.html?id=${card.dataset.article}`;
    }
});

articlesGrid.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const card = event.target.closest(".article-card");
    if (!card?.dataset.article) return;
    event.preventDefault();
    window.location.href = `details/details.html?id=${card.dataset.article}`;
});

getArticles().then(articles => {
    console.log("Articles fetched:", articles);
    renderArticles(articles);
});
