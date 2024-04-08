//menu burger
const header_menu = document.querySelector('.navbar-menu__icon');
const back = document.querySelector('body');
const header_list = document.querySelector('.menu__list');


header_menu.addEventListener('click',function(){
    header_menu.classList.toggle('_active');
    header_list.classList.toggle('active');
    back.classList.toggle('lock');
} )