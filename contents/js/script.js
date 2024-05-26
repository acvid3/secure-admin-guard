document.addEventListener('DOMContentLoaded', (event) => {
    const username = window.USERNAME || 'Guest';
    document.getElementById('username').textContent = `Hello, ${username}!`;
});