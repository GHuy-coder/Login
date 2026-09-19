/** xóa đuôi tên file ví dụ frontend/index.html */
const loginForm = document.querySelector("#login-form")
const apiUrl = "http://127.0.0.1:5000/api"

async function sendData() {
    const formData = new FormData(signupForm)

    const email = formData.get("user-email")
    const password = formData.get("user-password")

    const users = {
        email: email,
        password: password,
    }

    try {
        const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(users),
        });

        const value = await response.json()

        if (value.error) {
            alert(value.error)
        }

        if (value.success) {
            // điều hướng tới trang index
            localStorage.setItem("users", JSON.stringify({
                email: email,
                login_time: Date()
            }))
            window.location.href = "/components/home/index.html"
        }

    } catch (e) {
        console.error(e);
    }


}


// Take over form submission
signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();

});
