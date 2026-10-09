/** xóa đuôi tên file ví dụ frontend/index.html */
window.history.replaceState({}, "", "/");



// kiểm tra login chưa bằng cách kiểm tra storage
function checkLogin() {
    const user_storage = localStorage.getItem("users")
    if (!user_storage) {
        window.location.href = "/components/authenticator/login/login.html"

    }
}

checkLogin()

// logout
const logout = document.getElementById("user-arrow")

logout.addEventListener("click", function (){
    const user_storage = localStorage.clear("users")
    if (!user_storage){
        window.location.href = "/components/authenticator/login/login.html"

    }
})



// get all posts from api
const apiUrl = "https://login-wv2x.onrender.com/api"

async function getArticles() {
    try {
        const response = await fetch(`${apiUrl}/articles-index`, {
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

function renderSavedList(savedArticles) {
    const savedList = document.getElementById("saved-list");
    savedList.innerHTML = savedArticles.map(article => `
        <a
            href="#"
            class="saved-item"
        >
            <img
                src="${article.cover}"
                alt="${article.title}"
            >
            <div>
                <strong>
                    ${article.title}
                </strong>
                <small>
                    ${article.category} 
                </small>
            </div>
            <span>
                🔖
            </span>
        </a>
    `).join('');
}

function renderCategories(articles) {
    const popularTopics = document.getElementById("popular-topics");
    const categoryCounts = {};
    const categories = {};
    const categoryIcons = {
        math: "\u2211",
        python: "Py",
        literature: "\u{1F4D6}",
        english: "Aa",
        science: "\u269B"
    };

    articles.forEach(article => {
        const categoryClass = article.category_class || "other";
        categoryCounts[categoryClass] = (categoryCounts[categoryClass] || 0) + 1;
        categories[categoryClass] = article;
    });

    popularTopics.innerHTML = Object.entries(categories).map(([categoryClass, article]) => `
        <a href="#" class="topic-card ${categoryClass}">
            <span class="topic-icon">${categoryIcons[categoryClass] || "✦"}</span>
            <span class="topic-information">
                <strong>${article.category}</strong>
                <small>${categoryCounts[categoryClass]} bài viết</small>
            </span>
        </a>
    `).join("");
}
function renderArticles(articles) {
    const articlesContainer = document.getElementById("articles-container");
    
    const diffHours = Math.floor((new Date() - new Date(articles[0].publish_time)) / (1000 * 60 * 60));
    articlesContainer.innerHTML = articles.map(article => `
                        <article class="featured-card" data-article="${article.slug}" tabindex="0" role="link">
                        <a href="/components/articles/details/details.html?id=${encodeURIComponent(article.slug)}" class="featured-image">
                            <img src="${article.cover}" alt="${article.title}">
                    
                            <span class="featured-category ${String(article.category || "").trim().toLowerCase() === "python" ? "python" : article.category_class || "other"}">
                                ${article.category}
                            </span>
                        </a>
                        <div class="featured-body">
                            <h3>
                                ${article.title}
                            </h3>
                            <p>
                                ${article.introduction}
                            </p>
                        </div>
                        <div class="featured-meta">
                            <div class="author">
                                <img src="${article.author_avatar}" alt="${article.author}">
                                <div>
                                    <strong>
                                        ${article.author}
                                    </strong>
                    
                                    <small>
                                        ${diffHours} giờ trước
                                    </small>
                                </div>
                            </div>
                            <div class="post-stat">
                                ◉ ${article.number_readers} lượt xem
                            </div>
                            <button type="button" class="bookmark" aria-label="Lưu bài viết">
                                ♡
                            </button>
                        </div>
                    
                    </article>    
    `
    ).join('');
}

getArticles().then(articles => {
    console.log("Articles:", articles);
    renderCategories(articles);
    renderArticles(articles);
    renderSavedList(articles.slice(0, 5)); // Render the first 5 articles as saved articles


});

// Delegate clicks because article cards are rendered after the API request.
const articlesContainer = document.getElementById("articles-container");

articlesContainer.addEventListener("click", (event) => {
    const bookmark = event.target.closest(".bookmark");
    if (bookmark) {
        event.preventDefault();
        event.stopPropagation();
        const isSaved = bookmark.classList.toggle("saved");
        bookmark.textContent = isSaved ? "♥" : "♡";
        return;
    }

    const card = event.target.closest(".featured-card");
    if (card?.dataset.article) {
        window.location.href = `/components/articles/details/details.html?id=${encodeURIComponent(card.dataset.article)}`;
    }
});

articlesContainer.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.closest(".bookmark")) return;

    const card = event.target.closest(".featured-card");
    if (!card?.dataset.article) return;

    event.preventDefault();
    window.location.href = `/components/articles/details/details.html?id=${encodeURIComponent(card.dataset.article)}`;
});
