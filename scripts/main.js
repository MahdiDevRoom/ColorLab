const html = document.documentElement;
const themeSwitch = document.querySelector('#themeSwitch');
const menuElm = document.querySelector('#menu');
const backdropElm = document.querySelector('#backdrop');

let localTheme = localStorage.getItem('theme');
if (!localTheme) {
    localTheme = 'light';
    localStorage.setItem(localTheme);
}

html.setAttribute('theme', localTheme);
themeSwitch.checked = localTheme == 'dark'


function Menu() {
    let isOpen = menuElm.classList.contains('show');

    let open = () => {
        menuElm.classList.add('show');
        backdropElm.classList.add('show');
        isOpen = true;
    }

    let close = () => {
        menuElm.classList.remove('show');
        backdropElm.classList.remove('show');
        isOpen = false;
    }

    isOpen ? close() : open();

    backdropElm.onclick = () => {
        if (isOpen) close();
    }

    html.onselectstart = () => {
        if (isOpen) close();
    }
}

function Theme() {
    let currentTheme = html.getAttribute('theme');
    let newTheme = currentTheme == 'light' ? 'dark' : 'light';

    html.setAttribute('theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeSwitch.checked = newTheme == 'dark';

}