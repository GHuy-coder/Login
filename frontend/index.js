/** xóa đuôi tên file ví dụ frontend/index.html */
window.history.replaceState({}, "", "/");



// kiểm tra login chưa bằng cách kiểm tra storage
function checkLogin(){
    const user_storage = localStorage.getItem("users")
    if (!user_storage){
        window.location.href = "frontend/components/authenticator/login/login.html"

    }
}

checkLogin()

