```html
<script>
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

   if (username.trim().toLowerCase() === "rayven" && password === "12345") {
    sessionStorage.setItem("userRole", "resident");
    sessionStorage.setItem("isLoggedIn", "true");
    sessionStorage.setItem("userName", "Rayven");

    window.location.href = "/dashboard/";
} else {
    errorMessage.textContent = "Incorrect username or password.";
    errorMessage.classList.remove("d-none");
}

        // Open the resident dashboard
        window.location.href = '/dashboard/';

    } else {
        errorMessage.textContent = 'Invalid username or password.';
        errorMessage.classList.remove('d-none');
    }
});
</script>
```