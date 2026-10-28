
document.addEventListener("DOMContentLoaded", function () {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const signInButton = document.querySelector(
        'button[onclick="handleLogin()"]'
    );
    const eyeIcon = document.querySelector(".eye-icon");
    const rememberMe = document.querySelector(
        '.remember-me input[type="checkbox"]'
    );
    const forgotLink = document.querySelector(".forgot-link");

    // Create a message area for login feedback
    const message = document.createElement("p");
    message.id = "login-message";
    message.setAttribute("role", "status");
    message.style.marginTop = "15px";
    message.style.textAlign = "center";
    message.style.fontSize = "14px";

    signInButton.insertAdjacentElement("afterend", message);

    // Restore remembered username
    const savedUsername = localStorage.getItem("barangayUsername");

    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberMe.checked = true;
    }

    // Show or hide password
    if (eyeIcon) {
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

    // Login validation
    window.handleLogin = function () {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        message.style.color = "#dc2626";

        if (!username || !password) {
            message.textContent =
                "Please enter your username and password.";
            return;
        }

        if (rememberMe.checked) {
            localStorage.setItem("barangayUsername", username);
        } else {
            localStorage.removeItem("barangayUsername");
        }

        // No backend authentication is connected yet
        message.style.color = "#b45309";
        message.textContent =
            "Login cannot be completed yet. Please connect the authentication backend.";

        console.log("Login form submitted for:", username);
    };

    // Submit login when Enter is pressed
    [usernameInput, passwordInput].forEach(function (input) {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                handleLogin();
            }
        });
    });

    // Forgot password message
    forgotLink.addEventListener("click", function (event) {
        event.preventDefault();

        const username = usernameInput.value.trim();

        message.style.color = "#2563eb";
        message.textContent = username
            ? "Please contact your system administrator to reset your password."
            : "Enter your username or email, then contact your system administrator to reset your password.";
    });
});
