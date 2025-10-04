let navbar = document.querySelector('header .navbar');
let body = document.querySelector('body');
let header = document.querySelector('header');
let backdrop = document.querySelector('#backdrop');
let main = document.querySelector('main');
let themeColor = document.querySelector('#theme-color');
let storage = JSON.parse(localStorage.getItem('storage'));
let changeTheme = (theme) => {
   themeColor.href = `styles/theme/${theme}.css`;
   document.querySelectorAll('.theme-symbol').forEach((i)=> i.innerHTML = `${theme == 'light' ? 'dark' : 'light'}_mode`);
}

if (!storage) {
   storage = { theme: 'light' };
   localStorage.setItem('storage', JSON.stringify(storage));
}

changeTheme(storage.theme);

function ToggleMenu() {
   navbar.classList.toggle('open');
   backdrop.classList.toggle('open');
   document.querySelectorAll('.menu-symbol').forEach((i)=> i.innerHTML = navbar.classList.contains('open') ? 'close' : 'menu');
}

function ToggleTheme() {
   storage = { theme: storage.theme == 'light' ? 'dark' : 'light' };
   localStorage.setItem('storage', JSON.stringify(storage));
   changeTheme(storage.theme);
}

backdrop.onclick = ()=> ToggleMenu();

body.onscroll = () => {
   if (scrollY >= 128) {
      if (!header.classList.contains('sticky')) header.classList.add('sticky');
   } else {
      if (header.classList.contains('sticky')) {
         header.classList.remove('sticky');
      }
   }
   if (navbar.classList.contains('open')) {
      ToggleMenu();
   }
}