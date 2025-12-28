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

        this.dom = {
            convert: {
                preview: document.querySelector('#convert .preview'),
                colorInput: document.querySelector('#convert .color-input'),
                keyword: document.querySelector('#convert .keyword'),
                hex: document.querySelector('#convert .hex'),
                rgb: document.querySelector('#convert .rgb'),
                hsl: document.querySelector('#convert .hsl'),
                hsv: document.querySelector('#convert .hsv'),
                cmyk: document.querySelector('#convert .cmyk'),
            },
            normalize: {
                input: document.querySelector('#normalize .input'),
                output: document.querySelector('#normalize .output'),
            },
            mix: {
                preview: document.querySelector('#mix .preview'),
                preview1: document.querySelector('#mix .preview-1'),
                preview2: document.querySelector('#mix .preview-2'),
                colorInput1: document.querySelector('#mix .color-input-1'),
                colorInput2: document.querySelector('#mix .color-input-2'),
            }
        };

        // convert
        this.dom.convert.colorInput.oninput = () => this.api.convert.input(this.dom.convert.colorInput.value);

        // normalize
        this.dom.normalize.input.oninput = ()=> this.api.normalize.input(this.dom.normalize.input.value);

        // mix
        this.dom.mix.colorInput1.oninput = () => this.api.mix.input(this.dom.mix.colorInput1.value, this.dom.mix.colorInput2.value);
        this.dom.mix.colorInput2.oninput = () => this.api.mix.input(this.dom.mix.colorInput1.value, this.dom.mix.colorInput2.value);

        this.api.convert.shuffle();
        this.api.mix.shuffle();
    },

    api: {
        convert: {
            shuffle() {
                Lab.api.convert.input(Lab.c.randomColor());
            },

            input(color) {
                this.preview(color);
                Lab.dom.convert.colorInput.value = color;

                Lab.dom.convert.keyword.textContent = Lab.c.getNearestColor(color) || 'undefined';
                Lab.dom.convert.hex.textContent = Lab.c.toHex(color) || 'undefined';
                Lab.dom.convert.rgb.textContent = Lab.c.toRgb(color) || 'undefined';
                Lab.dom.convert.hsl.textContent = Lab.c.toHsl(color) || 'undefined';
                Lab.dom.convert.hsv.textContent = Lab.c.toHsv(color) || 'undefined';
                Lab.dom.convert.cmyk.textContent = Lab.c.toCmyk(color) || 'undefined';
            },

            preview(color) {
                Lab.dom.convert.preview.style.background = Lab.c.toHex(color);
            }
        },

        normalize: {
            input(color){
                Lab.dom.normalize.output.innerHTML = Lab.c.normalize(color);
            }
        },

        mix: {
            shuffle() {
                Lab.api.mix.input(Lab.c.randomColor(), Lab.c.randomColor());
            },
            input(color1, color2) {
                this.preview1(color1);
                this.preview2(color2);
                this.preview(Lab.c.mixColor(color1, color2));

                Lab.dom.mix.colorInput1.value = color1;
                Lab.dom.mix.colorInput2.value = color2;
            },

            preview(color) {
                Lab.dom.mix.preview.style.background = color;
            },
            preview1(color) {
                Lab.dom.mix.preview1.style.background = Lab.c.toHex(color);
            },
            preview2(color) {
                Lab.dom.mix.preview2.style.background = Lab.c.toHex(color);
            },
        }
    }
};
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
    let title = document.querySelector('header .title');
    switch (page) {
        case 'home':
            title.innerHTML = 'ColorLab.js';
            hljs.highlightAll();
            break;
        case 'lab':
            title.innerHTML = 'Laboratory';
            Lab.init();
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