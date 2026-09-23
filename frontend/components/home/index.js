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

<<<<<<< HEAD
// logout
const logout = document.getElementById("user-arrow")

logout.addEventListener("click", function (){
    const user_storage = localStorage.clear("users")
=======

const logout = document.getElementById("user-arrow")

logout.addEventListener("click", function (){
    const user_storage = localStorage.clear()
>>>>>>> 945c9854414343a9c8f59dd77226c728e83ffc73
    if (!user_storage){
        window.location.href = "/components/authenticator/login/login.html"

    }
<<<<<<< HEAD
})
=======
})
>>>>>>> 945c9854414343a9c8f59dd77226c728e83ffc73
