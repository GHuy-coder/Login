const apiUrl = "http://127.0.0.1:5000/api"
const defaultAvatar = "/assets/DON-CUTE.jpg"

const profileForm = document.getElementById("profile-form")
const fullnameInput = document.getElementById("fullname")
const classroomInput = document.getElementById("classroom")
const emailInput = document.getElementById("email")
const avatarInput = document.getElementById("avatar")
const formMessage = document.getElementById("form-message")
const saveButton = document.getElementById("save-button")
let previewUrl = null

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

let currentUser = getStoredUser()

function renderUser(user) {
    if (!user) return

    const displayName = user.fullname?.trim() || "bạn"
    const avatar = user.avatar || defaultAvatar

    document.getElementById("user-fullname").textContent = `Chào, ${displayName}`
    document.getElementById("user-classroom").textContent = user.classroom
        ? `Lớp ${user.classroom}`
        : ""
    document.getElementById("user-avatar").src = avatar
    document.getElementById("user-avatar").alt = displayName
    document.getElementById("profile-avatar-preview").src = avatar
    document.getElementById("profile-name-preview").textContent = displayName
    document.getElementById("profile-class-preview").textContent = user.classroom
        ? `Lớp ${user.classroom}`
        : "Học sinh"
}

function fillForm(user) {
    if (!user) return

    fullnameInput.value = user.fullname || ""
    classroomInput.value = user.classroom || ""
    emailInput.value = user.email || ""
    avatarInput.value = ""
    renderUser(user)
}

function showMessage(message, isError = false) {
    formMessage.textContent = message
    formMessage.classList.toggle("error", isError)
}

fillForm(currentUser)

avatarInput.addEventListener("change", function () {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    previewUrl = avatarInput.files[0] ? URL.createObjectURL(avatarInput.files[0]) : null
    document.getElementById("profile-avatar-preview").src = previewUrl || currentUser.avatar || defaultAvatar
})

document.getElementById("profile-avatar-preview").addEventListener("error", function () {
    this.src = defaultAvatar
})

fullnameInput.addEventListener("input", function () {
    document.getElementById("profile-name-preview").textContent = fullnameInput.value.trim() || "bạn"
})

classroomInput.addEventListener("input", function () {
    document.getElementById("profile-class-preview").textContent = classroomInput.value.trim()
        ? `Lớp ${classroomInput.value.trim()}`
        : "Học sinh"
})

document.getElementById("cancel-button").addEventListener("click", function () {
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        previewUrl = null
    }
    fillForm(currentUser)
    showMessage("")
})

profileForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    if (!currentUser) return

    const avatarFile = avatarInput.files[0]
    if (avatarFile && avatarFile.size > 5 * 1024 * 1024) {
        showMessage("Ảnh đại diện không được lớn hơn 5 MB", true)
        return
    }

    saveButton.disabled = true
    saveButton.textContent = "Đang lưu..."
    showMessage("")

    try {
        const formData = new FormData()
        formData.append("original_email", currentUser.email)
        formData.append("email", emailInput.value)
        formData.append("fullname", fullnameInput.value)
        formData.append("classroom", classroomInput.value)
        if (avatarFile) formData.append("avatar", avatarFile)

        const response = await fetch(`${apiUrl}/profile`, {
            method: "PUT",
            body: formData
        })
        const value = await response.json()

        if (!response.ok) {
            throw new Error(value.error || "Không thể cập nhật thông tin")
        }

        currentUser = {
            ...value.user,
            login_time: currentUser.login_time
        }
        localStorage.setItem("users", JSON.stringify(currentUser))
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            previewUrl = null
        }
        fillForm(currentUser)
        showMessage(value.success)
    } catch (error) {
        showMessage(error.message, true)
    } finally {
        saveButton.disabled = false
        saveButton.textContent = "Lưu thông tin"
    }
})

const userMenu = document.getElementById("user-menu")
const userMenuToggle = document.getElementById("user-menu-toggle")
const userDropdown = document.getElementById("user-dropdown")

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

document.getElementById("logout-button").addEventListener("click", function () {
    localStorage.removeItem("users")
    window.location.href = "/components/authenticator/login/login.html"
})
