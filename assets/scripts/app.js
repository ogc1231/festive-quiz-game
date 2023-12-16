/* jshint esversion: 11 */


// Arrow up
window.addEventListener('scroll', () => {
    const topLink = document.querySelector('.top-link');
    const icon = topLink.querySelector('.fa-gift');
    const scrollHeight = window.pageYOffset;
    
    if (scrollHeight > 300) {
        topLink.classList.add('show-link');
    } else {
        topLink.classList.remove('show-link');
    }
    // Remove 'fa-beat' class on hover
    topLink.addEventListener('mouseenter', () => {
        icon.classList.remove('fa-beat');
        icon.classList.add('fa-arrow-up');
    });
});