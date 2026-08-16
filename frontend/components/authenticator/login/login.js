/** xóa đuôi tên file ví dụ frontend/index.html */
const loginForm = document.querySelector("#login-form")


async function sendData() {
    const formData = new FormData(loginForm)

    const email = formData.get("user-email")
    const password = formData.get("user-password")

    const users = {
        email: email,
        password: password,
        loginTime: Date()
    }

    localStorage.setItem("users", JSON.stringify(users))
    
    // try {
    //     const response = await fetch("https://example.org/post", {
    //         method: "POST",
    //         // Set the FormData instance as the request body
    //         body: formData,
    //     });
    //     console.log(await response.json());
    // } catch (e) {
    //     console.error(e);
    // }

    // điều hướng tới trang index
    window.location.href="../../../index.html"
}





// Take over form submission
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();

});