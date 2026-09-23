/** xóa đuôi tên file ví dụ frontend/index.html */
window.history.replaceState({}, "", "/");



// kiểm tra login chưa bằng cách kiểm tra storage
function checkLogin(){
    const user_storage = localStorage.getItem("users")
    if (!user_storage){
        window.location.href = "/components/authenticator/login/login.html"

    }
}

checkLogin()


const logout = document.getElementById("user-arrow")

logout.addEventListener("click", function (){
    const user_storage = localStorage.clear()
    if (!user_storage){
        window.location.href = "/components/authenticator/login/login.html"

    }
})
