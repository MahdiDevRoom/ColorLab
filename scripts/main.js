let toggleMenu = document.querySelector('#toggle-menu');
let menu = document.querySelector('header .menu');
let backdrop = document.querySelector('#backdrop');
let toggleTheme = document.querySelector('#toggle-theme');
let themeColor = document.querySelector('#theme-color');
let storage = JSON.parse(localStorage.getItem('storage'));
let changeTheme = (theme) => {
   themeColor.href = `styles/theme/${theme}.css`;
   toggleTheme.querySelector('.symbol').innerHTML = `${theme == 'light' ? 'dark' : 'light'}_mode`;
}

if (!storage) {
   storage = {theme: 'light'};
   localStorage.setItem('storage',JSON.stringify(storage));
}

changeTheme(storage.theme);

toggleMenu.onclick = ()=> {
   menu.classList.toggle('open');
   backdrop.classList.toggle('open');
}
   


toggleTheme.onclick = ()=> {
   storage = {theme: storage.theme == 'light' ? 'dark' : 'light' };
   localStorage.setItem('storage',JSON.stringify(storage));
   changeTheme(storage.theme);
}
   
