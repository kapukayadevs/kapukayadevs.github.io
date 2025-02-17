// Mobil menü işlevselliği
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const authButtons = document.querySelector('.auth-buttons');
const mobileClose = document.querySelector('.mobile-close');
const body = document.body;

function toggleMenu() {
    navLinks.classList.toggle('active');
    authButtons.classList.toggle('active');
    mobileClose.classList.toggle('active');
    body.classList.toggle('menu-active');
}

hamburger.addEventListener('click', toggleMenu);
mobileClose.addEventListener('click', toggleMenu);

// Menü dışına tıklandığında menüyü kapat
document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('active') && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger') &&
        !e.target.closest('.auth-buttons')) {
        toggleMenu();
    }
}); 