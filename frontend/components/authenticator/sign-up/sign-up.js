const signupForm = document.querySelector("#sign-up-form")
const apiUrl = "http://127.0.0.1:5000/api"

async function sendData() {
    const formData = new FormData(signupForm)

    const email = formData.get("user-email")
    const password = formData.get("user-password")
    const yourName = formData.get("user-name")
    const studentClass = formData.get("class")

    const users = {
        email: email,
        password: password,
        fullname: yourName,
        classroom: studentClass
    }

    try {
        const response = await fetch(`${apiUrl}/signup`, {
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
            window.location.href = "/components/authenticator/login/login.html"
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
