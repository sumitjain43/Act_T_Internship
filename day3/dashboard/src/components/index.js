const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on link click
const links = mobileMenu.querySelectorAll('a');
 links.forEach(link => {
    link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    });
});