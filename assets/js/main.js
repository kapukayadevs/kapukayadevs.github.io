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

    // Hamburger menü animasyonu
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
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

// Menü linklerine tıklandığında menüyü kapat
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
}); 