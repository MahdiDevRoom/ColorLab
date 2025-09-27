let toggleMenu = document.querySelector('#toggle-menu');
let menu = document.querySelector('header .menu');
let body = document.querySelector('body');
let header = document.querySelector('header');
let backdrop = document.querySelector('#backdrop');
let toggleTheme = document.querySelector('#toggle-theme');
let main = document.querySelector('main');
let themeColor = document.querySelector('#theme-color');
let storage = JSON.parse(localStorage.getItem('storage'));
let changeTheme = (theme) => {
   themeColor.href = `styles/theme/${theme}.css`;
   toggleTheme.querySelector('.symbol').innerHTML = `${theme == 'light' ? 'dark' : 'light'}_mode`;
}

if (!storage) {
   storage = { theme: 'light' };
   localStorage.setItem('storage', JSON.stringify(storage));
}

changeTheme(storage.theme);

toggleMenu.onclick = backdrop.onclick = () => {
   menu.classList.toggle('open');
   backdrop.classList.toggle('open');
   toggleMenu.querySelector('.symbol').innerHTML = menu.classList.contains('open') ? 'close' : 'menu';
}

toggleTheme.onclick = () => {
   storage = { theme: storage.theme == 'light' ? 'dark' : 'light' };
   localStorage.setItem('storage', JSON.stringify(storage));
   changeTheme(storage.theme);
}

body.onscroll = () => {
   if (scrollY >= 128) {
      if (!header.classList.contains('sticky')) header.classList.add('sticky');
   } else {
      if (header.classList.contains('sticky')) {
         header.classList.remove('sticky');
      }
   }
   if (menu.classList.contains('open')) {
      menu.classList.toggle('open');
      backdrop.classList.toggle('open');
      toggleMenu.querySelector('.symbol').innerHTML = menu.classList.contains('open') ? 'close' : 'menu';
   }
}