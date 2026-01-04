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
        StatusBar.reload();
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
            .then(res => {
                if (!res.ok) throw new Error('Page not found');
                return res.text();
            })
            .then(data => {
                this.pageElm.innerHTML = data;
                this.dispatchEvent({ page: name });

                if (section) {
                    queueMicrotask(() => {
                        const elm = document.getElementById(section);
                        if (!elm) return;

                        const offset = 86;
                        const y =
                            elm.getBoundingClientRect().top +
                            window.pageYOffset -
                            offset;

                        window.scrollTo({
                            top: y,
                            behavior: "smooth"
                        });
                    });
                } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }

                if (addHistory)
                    history.pushState({ page: input }, "", `#${input}`);
            })
            .catch(() => {
                if (name !== 'home') {
                    history.replaceState({ page: 'home' }, "", "#home");
                    this.open('home', false);
                }
            });

        this.setActiveMenu(name);
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
const Scroll = {
    header: document.querySelector('header'),
    fab: document.querySelector('#fab'),
    body: document.body,
    init() {
        this.body.onscroll = () => this.scroll();
        this.fab.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
    },
    scroll() {
        this.header.classList.toggle('sticky', scrollY >= 100);
        this.fab.classList.toggle('show', scrollY >= 300);
    }
}
const StatusBar = {
    init() {
        this.rootStyles = getComputedStyle(document.documentElement);
        this.themeColorMeta = document.querySelector('meta[name="theme-color"]');
        this.color = 'surface';
    },
    set(varible) {
        this.themeColorMeta.setAttribute('content', this.rootStyles.getPropertyValue(`--${varible}`).trim());
    },
    reload() {
        this.themeColorMeta.setAttribute('content', this.rootStyles.getPropertyValue(`--${this.color}`).trim());

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


StatusBar.init();
Theme.init();
Menu.init();
Page.init();
Scroll.init();


Page.onloadpage = ({ detail }) => {
    let page = detail.page;
    let title = document.querySelector('header .title');
    switch (page) {
        case 'home':
            title.innerHTML = 'ColorLab.js';
            hljs.highlightAll();
            break;
        case 'docs':
            title.innerHTML = 'Documents';
            hljs.highlightAll();
            break
        case 'changelog':
            title.innerHTML = 'Changelog';
            break
    }
}
less.pageLoadFinished.then(() => {
    StatusBar.reload();
});
