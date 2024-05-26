document.addEventListener("DOMContentLoaded", function() {
    const togglePassword = document.getElementById('togglePassword');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    togglePassword.addEventListener('click', function() {
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        
        if (confirmPassword) {
            confirmPassword.setAttribute('type', type);
        }

        this.textContent = this.textContent === 'Show Password' ? 'Hide Password' : 'Show Password';
    });
});
