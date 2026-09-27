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


});