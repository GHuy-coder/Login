const apiUrl = "http://127.0.0.1:5000/api";
const articlesGrid = document.getElementById("articleGrid");
const searchInput = document.getElementById("article-search");
const headerSearchInput = document.getElementById("header-search");
const filterSidebar = document.querySelector(".filter-sidebar");
const clearFiltersButton = document.querySelector(".clear-filters");
const status = document.getElementById("article-results-status");
const topicInputs = [...document.querySelectorAll('input[name="topic"]')];
const timeInputs = [...document.querySelectorAll('input[name="reading-time"]')];
const sortSelect = document.getElementById("article-sort");
const quickFilters = [...document.querySelectorAll(".quick-filter-item")];

let allArticles = [];
let activeQuickFilter = "latest";

function normalize(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("vi-VN")
        .trim();
}

function getCategory(article) {
    return normalize(`${article.category || ""} ${article.category_class || ""}`);
}

function getReadingMinutes(article) {
    const minutes = String(article.reading_time || "").match(/\d+/);
    return minutes ? Number(minutes[0]) : null;
}

function matchesTopic(article, topic) {
    const category = getCategory(article);
    const aliases = {
        toan: ["toan", "math"],
        van: ["van", "ngu van", "literature"],
        anh: ["tieng anh", "english", "anh"],
        python: ["python"],
        "khoa-hoc": ["khoa hoc", "science"]
    };
    return (aliases[topic] || [normalize(topic)]).some(alias => category.includes(alias));
}

function filteredArticles() {
    const query = normalize(searchInput?.value || "");
    const topics = topicInputs.filter(input => input.checked).map(input => input.value);
    const timeRanges = timeInputs.filter(input => input.checked).map(input => input.value);

    let result = allArticles.filter(article => {
        const searchable = normalize([
            article.title,
            article.introduction,
            article.author,
            article.category
        ].join(" "));
        if (query && !searchable.includes(query)) return false;
        if (topics.length && !topics.some(topic => matchesTopic(article, topic))) return false;

        if (timeRanges.length) {
            const minutes = getReadingMinutes(article);
            const matchesTime = timeRanges.some(range => {
                if (minutes === null) return false;
                if (range === "under-5") return minutes < 5;
                if (range === "5-15") return minutes >= 5 && minutes <= 15;
                if (range === "over-15") return minutes > 15;
                return true;
            });
            if (!matchesTime) return false;
        }
        return true;
    });

    const sort = sortSelect?.value || "latest";
    if (activeQuickFilter === "popular" || sort === "popular") {
        result.sort((a, b) => Number(b.number_readers || 0) - Number(a.number_readers || 0));
    } else {
        result.sort((a, b) => new Date(b.publish_time || 0) - new Date(a.publish_time || 0));
    }
    return result;
}

function renderArticles(articles) {
    if (!articles.length) {
        articlesGrid.innerHTML = '<p class="article-empty">Không tìm thấy bài viết phù hợp. Hãy thử đổi từ khóa hoặc bộ lọc.</p>';
    } else {
        articlesGrid.innerHTML = articles.map(article => `
            <article class="article-card" data-article="${article.slug}" tabindex="0">
                <div class="article-cover">
                    <img src="${article.cover}" alt="${article.title}">
                    <span class="category-tag ${normalize(article.category) === "python" ? "python" : article.category_class || "other"}">${article.category}</span>
                </div>
                <div class="article-content">
                    <h2>${article.title}</h2>
                    <p>${article.introduction}</p>
                </div>
                <div class="article-meta">
                    <div class="author">
                        <img src="${article.author_avatar}" alt="${article.author}">
                        <div><strong>${article.author}</strong><span>${article.reading_time}</span></div>
                    </div>
                    <button type="button" class="save-article" aria-label="Lưu bài viết">♡</button>
                </div>
            </article>
        `).join("");
    }
    if (status) status.textContent = `Hiển thị ${articles.length} / ${allArticles.length} bài viết`;
}

function applyFilters() {
    renderArticles(filteredArticles());
}

async function getArticles() {
    const response = await fetch(`${apiUrl}/articles`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error(`Không tải được bài viết (${response.status})`);
    const data = await response.json();
    return Array.isArray(data) ? data : [];
}

articlesGrid.addEventListener("click", event => {
    const saveButton = event.target.closest(".save-article");
    if (saveButton) {
        event.stopPropagation();
        const saved = saveButton.classList.toggle("saved");
        saveButton.textContent = saved ? "♥" : "♡";
        return;
    }
    const card = event.target.closest(".article-card");
    if (card?.dataset.article) window.location.href = `details/details.html?id=${card.dataset.article}`;
});

articlesGrid.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".article-card")) {
        event.preventDefault();
        const slug = event.target.dataset.article;
        if (slug) window.location.href = `details/details.html?id=${slug}`;
    }
});

searchInput?.addEventListener("input", () => {
    if (headerSearchInput) headerSearchInput.value = searchInput.value;
    applyFilters();
});
headerSearchInput?.addEventListener("input", () => {
    if (searchInput) searchInput.value = headerSearchInput.value;
    applyFilters();
});

document.querySelector(".topic-row")?.addEventListener("click", event => {
    const topicCard = event.target.closest(".topic-card");
    if (!topicCard) return;
    event.preventDefault();
    const topic = ["math", "literature", "english", "python", "science"]
        .find(name => topicCard.classList.contains(name));
    const topicValue = { math: "toan", literature: "van", english: "anh", python: "python", science: "khoa-hoc" }[topic];
    const input = topicInputs.find(item => item.value === topicValue);
    if (input) {
        topicInputs.forEach(item => { item.checked = false; });
        input.checked = true;
        applyFilters();
    }
});
filterSidebar?.addEventListener("change", event => {
    if (event.target.matches('input[name="topic"], input[name="reading-time"]')) applyFilters();
});
sortSelect?.addEventListener("change", () => {
    activeQuickFilter = "";
    quickFilters.forEach(item => item.classList.remove("active"));
    applyFilters();
});

quickFilters.forEach(item => item.addEventListener("click", event => {
    event.preventDefault();
    activeQuickFilter = item.dataset.filter;
    quickFilters.forEach(filter => filter.classList.toggle("active", filter === item));
    if (sortSelect) sortSelect.value = activeQuickFilter === "popular" ? "popular" : "latest";
    applyFilters();
}));

clearFiltersButton?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    if (headerSearchInput) headerSearchInput.value = "";
    [...topicInputs, ...timeInputs].forEach(input => { input.checked = false; });
    if (sortSelect) sortSelect.value = "latest";
    activeQuickFilter = "latest";
    quickFilters.forEach(item => item.classList.toggle("active", item.dataset.filter === "latest"));
    applyFilters();
});

getArticles()
    .then(articles => { allArticles = articles; applyFilters(); })
    .catch(error => {
        console.error("Error fetching articles:", error);
        articlesGrid.innerHTML = '<p class="article-empty">Không thể tải bài viết. Vui lòng thử lại sau.</p>';
        if (status) status.textContent = "";
    });
