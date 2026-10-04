/** xóa đuôi tên file ví dụ frontend/index.html */
window.history.replaceState({}, "", "/");



// kiểm tra login chưa bằng cách kiểm tra storage
function getStoredUser() {
    const userStorage = localStorage.getItem("users")

    if (!userStorage) {
        window.location.href = "/components/authenticator/login/login.html"
        return null
    }

    try {
        return JSON.parse(userStorage)
    } catch (error) {
        localStorage.removeItem("users")
        window.location.href = "/components/authenticator/login/login.html"
        return null
    }
}

function renderUser(user) {
    if (!user) return

    const displayName = user.fullname?.trim() || "bạn"

    document.getElementById("user-fullname").textContent = `Chào, ${displayName}`
    document.getElementById("user-classroom").textContent = user.classroom
        ? `Lớp ${user.classroom}`
        : ""
    document.getElementById("hero-greeting").textContent = `Xin chào ${displayName}! 👋`

    const avatar = document.getElementById("user-avatar")
    avatar.src = user.avatar || "/assets/DON-CUTE.jpg"
    avatar.alt = user.fullname || user.email
}

renderUser(getStoredUser())

// menu tài khoản
const userMenu = document.getElementById("user-menu")
const userMenuToggle = document.getElementById("user-menu-toggle")
const userDropdown = document.getElementById("user-dropdown")
const logoutButton = document.getElementById("logout-button")

function setUserMenuOpen(isOpen) {
    userMenu.classList.toggle("open", isOpen)
    userDropdown.hidden = !isOpen
    userMenuToggle.setAttribute("aria-expanded", String(isOpen))
}

userMenuToggle.addEventListener("click", function () {
    setUserMenuOpen(userDropdown.hidden)
})

document.addEventListener("click", function (event) {
    if (!userMenu.contains(event.target)) {
        setUserMenuOpen(false)
    }
})

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !userDropdown.hidden) {
        setUserMenuOpen(false)
        userMenuToggle.focus()
    }
})

logoutButton.addEventListener("click", function () {
    localStorage.removeItem("users")
    window.location.href = "/components/authenticator/login/login.html"
})



// get all posts from api
const apiUrl = "http://127.0.0.1:5000/api"

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
    const countPostsByCategory = {};

    articles.forEach(article => {
        const categoryClass = article.category_class;
        if (countPostsByCategory[categoryClass]) {
            countPostsByCategory[categoryClass]++;
        } else {
            countPostsByCategory[categoryClass] = 1;
        }
    });

    console.log("Count of posts by category:", countPostsByCategory);
    popularTopics.innerHTML = articles.map(article => `
                    <a
                        href="#"
                        class="topic-card math"
                    >

                        <span class="topic-icon">
                            ▦
                        </span>

                        <span class="topic-information">

                            <strong>
                                ${article.category}
                            </strong>

                            <small>
                                ${countPostsByCategory[article.category_class]} bài viết
                            </small>

                        </span>

                    </a>`
    ).join('');
}

function renderArticles(articles) {
    const articlesContainer = document.getElementById("articles-container");
    
    const diffHours = Math.floor((new Date() - new Date(articles[0].publish_time)) / (1000 * 60 * 60));
    articlesContainer.innerHTML = articles.map(article => `
                        <article class="featured-card">
                        <a href="#" class="featured-image">
                            <img src="${article.cover}" alt="${article.title}">
                    
                            <span class="featured-category math">
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

