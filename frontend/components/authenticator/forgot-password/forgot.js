document.getElementById("listen-button").addEventListener("click", backFunction);

function backFunction() {
    window.location.href = "../login/login.html"
}

const forgotForm = document.getElementById("forgot-form")
const apiUrl = "http://127.0.0.1:5000/api"


async function sendData() {
    const formData = new FormData(forgotForm)

    const email = formData.get("user-email")

    const users = {
        email: email
    }

    try {
        const response = await fetch(`${apiUrl}/forgot`, {
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

            alert(value.success)

            window.location.href = "/components/home/index.html"
        }

    } catch (e) {
        console.error(e);
    }


}




forgotForm.addEventListener("submit", (event) => {
    event.preventDefault();
    sendData();

});
