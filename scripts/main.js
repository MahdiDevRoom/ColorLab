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
        freeze(undefined,{
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
        window.addEventListener('scroll', ()=> this.close());
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
    init(){
        this.body.onscroll = () => this.scroll();
    },
    isSticky(){
        return this.header.classList.contains('sticky');
    },
    stick(){
        if (this.isSticky) this.header.classList.add('sticky')
    },
    unStick(){
        if (this.isSticky) this.header.classList.remove('sticky')
    },
    scroll(){
        scrollY >= 100 ? this.stick() : this.unStick();
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
