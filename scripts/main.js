const Theme = {
    html: document.documentElement,
    switchElm: document.querySelector('#themeSwitch'),

    init() {
        let savedTheme = localStorage.getItem('theme');
        if (!savedTheme) {
            savedTheme = 'light';
            localStorage.setItem('theme', savedTheme);
        }
        this.set(savedTheme);

        this.switchElm.checked = savedTheme === 'dark';
        this.switchElm.addEventListener('change', () => this.toggle());
    },

    current() {
        return this.html.getAttribute('theme');
    },

    set(name) {
        freeze(undefined, {
            '.c-switch': 'left, width, height',
            '#menu label': 'scale',

        });
        this.html.setAttribute('theme', name);
        localStorage.setItem('theme', name);
        this.switchElm.checked = name === 'dark';
    },

    toggle() {
        const newTheme = this.current() === 'light' ? 'dark' : 'light';
        this.set(newTheme);
    },

};
const Menu = {
    menuElm: document.querySelector('#menu'),
    backdropElm: document.querySelector('#backdrop'),

    init() {
        this.backdropElm.onclick = () => this.close();
        window.addEventListener('scroll', () => this.close());
    },

    isOpen() {
        return this.menuElm.classList.contains('show');
    },
    open() {
        if (this.isOpen()) return;
        this.menuElm.classList.add('show');
        this.backdropElm.classList.add('show');
    },
    close() {
        if (!this.isOpen()) return;
        this.menuElm.classList.remove('show');
        this.backdropElm.classList.remove('show');
    },
    toggle() {
        this.isOpen() ? this.close() : this.open();
    }
};
const Page = {
    pageElm: document.querySelector('#page'),
    target: new EventTarget(),

    parseInput(input) {
        const index = input.indexOf('-');
        if (index === -1) return [input, ''];
        return [input.slice(0, index), input.slice(index + 1)];
    },

    setActiveMenu(input) {
        const listItems = document.querySelectorAll("#navigation > div");
        listItems.forEach(item => {
            const onclickValue = item.getAttribute("onclick");
            const pageName = onclickValue?.match(/Page.open\('(.+)'\)/)?.[1];
            if (pageName === input) item.classList.add("active");
            else item.classList.remove("active");
        });
        Menu.close();
    },

    open(input, addHistory = true) {
        let [name, section] = this.parseInput(input);

        fetch(`./pages/${name}.html`)
            .then(res => res.text())
            .then(data => {
                this.pageElm.innerHTML = data;
                this.dispatchEvent({ page: name });
                if (section) {
                    queueMicrotask(() => {
                        const elm = document.getElementById(section);
                        if (elm) elm.scrollIntoView({ behavior: "smooth" });

                    });
                }
                if (addHistory) history.pushState({ page: input }, "", `#${input}`);
            })
        this.setActiveMenu(input);
    },

    dispatchEvent(detail) {
        this.target.dispatchEvent(new CustomEvent('loadPage', { detail }));
    },

    set onloadpage(callback) {
        this.target.addEventListener('loadPage', callback);
    },

    init() {
        window.addEventListener("DOMContentLoaded", () => {
            let hash = location.hash.slice(1);
            if (!hash) location.hash = hash = "home";
            this.open(hash, false);
        });

        window.addEventListener("hashchange", () => this.open(location.hash.slice(1), false));
        window.addEventListener("popstate", (event) => {
            const hash = event.state?.page || "home";
            this.open(hash, false);
        });
    }
}
const Appbar = {
    header: document.querySelector('header'),
    body: document.body,
    init() {
        this.body.onscroll = () => this.scroll();
    },
    isSticky() {
        return this.header.classList.contains('sticky');
    },
    stick() {
        if (this.isSticky) this.header.classList.add('sticky')
    },
    unStick() {
        if (this.isSticky) this.header.classList.remove('sticky')
    },
    scroll() {
        scrollY >= 100 ? this.stick() : this.unStick();
    }
}
const Lab = {
    init() {
        this.c = new ColorLab();
        this.previewElm = document.querySelector('#convert .color-preview');
        this.inputElm = document.querySelector('#convert .color-input');
        this.shuffleElm = document.querySelector('#convert .color-shuffle');

        this.keywordElm = document.querySelector('#convert .keyword');
        this.hexElm = document.querySelector('#convert .hex');
        this.rgbElm = document.querySelector('#convert .rgb');
        this.hslElm = document.querySelector('#convert .hsl');
        this.hsvElm = document.querySelector('#convert .hsv');
        this.cmykElm = document.querySelector('#convert .cmyk');

        this.inputElm.oninput = () => this.input(this.inputElm.value);
        this.shuffleElm.onclick = () => this.shuffle();

        this.shuffle();
        
    },

    shuffle(){
        this.input(this.c.randomColor());
    },

    input(color) {
        this.preview(color);
        this.inputElm.value = color;

        this.keywordElm.innerHTML = this.c.getNearestColor(color);
        this.hexElm.innerHTML = this.c.toHex(color);
        this.rgbElm.innerHTML = this.c.toRgb(color);
        this.hslElm.innerHTML = this.c.toHsl(color);
        this.hsvElm.innerHTML = this.c.toHsv(color);
        this.cmykElm.innerHTML = this.c.toCmyk(color);
    },

    preview(color) {
        this.previewElm.style.background = this.c.toHex(color);
    }
}
function freeze(duration = 100, exceptions = {}) {
    const css = document.createElement("style");
    const selectors = Object.keys(exceptions);
    const notClause = selectors.length > 0 ? `:not(${selectors.join(', ')})` : "";
    let exceptionRules = "";
    for (const [selector, properties] of Object.entries(exceptions)) {
        exceptionRules += `
            ${selector} {
                transition-property: ${properties} !important;
                transition-duration: inherit !important; 
                transition-timing-function: inherit !important;
                animation: inherit !important; 
            }
        `;
    }

    css.innerText = `
        *${notClause}, *${notClause}::before, *${notClause}::after {
            transition: none !important;
            animation: none !important;
        }
        
        ${exceptionRules}
    `;

    document.head.appendChild(css);
    window.getComputedStyle(css).opacity;
    setTimeout(() => {
        if (document.head.contains(css)) {
            document.head.removeChild(css);
        }
    }, duration);
}


Theme.init();
Menu.init();
Page.init();
Appbar.init();


Page.onloadpage = ({ detail }) => {
    let page = detail.page;
    switch (page) {
        case 'home':
            hljs.highlightAll();
            break;
        case 'lab':
            Lab.init();
            break;
    }
}