document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const signInButton = document.querySelector(".signin-btn");
    const eyeIcon = document.querySelector(".eye-icon");
    const rememberMe = document.querySelector('.remember-me input[type="checkbox"]');
    const forgotLink = document.querySelector(".forgot-link");
    const loginForm = document.querySelector("form");

    // Create a message area for login feedback if sign-in button exists
    let message = null;
    if (signInButton) {
        message = document.createElement("p");
        message.id = "login-message";
        message.setAttribute("role", "status");
        message.style.marginTop = "15px";
        message.style.textAlign = "center";
        message.style.fontSize = "14px";
        signInButton.insertAdjacentElement("afterend", message);
    }

    // Restore remembered username
    const savedUsername = localStorage.getItem("barangayUsername");
    if (savedUsername && usernameInput && rememberMe) {
        usernameInput.value = savedUsername;
        rememberMe.checked = true;
    }

    // Show or hide password
    if (eyeIcon && passwordInput) {
        eyeIcon.style.cursor = "pointer";
        eyeIcon.setAttribute("role", "button");
        eyeIcon.setAttribute("tabindex", "0");
        eyeIcon.setAttribute("aria-label", "Show password");

        function togglePassword() {
            const isHidden = passwordInput.type === "password";
            passwordInput.type = isHidden ? "text" : "password";
            eyeIcon.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );
        }

        eyeIcon.addEventListener("click", togglePassword);

        eyeIcon.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                togglePassword();
            }
        });
    }

    // Handle form submission and Remember Me persistence
    if (loginForm) {
        loginForm.addEventListener("submit", function () {
            if (rememberMe && rememberMe.checked && usernameInput) {
                localStorage.setItem("barangayUsername", usernameInput.value.trim());
            } else {
                localStorage.removeItem("barangayUsername");
            }
        });
    }

    // Forgot password message helper
    if (forgotLink && message) {
        forgotLink.addEventListener("click", function (event) {
            event.preventDefault();
            const username = usernameInput ? usernameInput.value.trim() : "";

            message.style.color = "#2563eb";
            message.textContent = username
                ? "Please contact your system administrator to reset your password."
                : "Enter your username or email, then contact your system administrator to reset your password.";
        });
    }
});