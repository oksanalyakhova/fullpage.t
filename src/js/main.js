let touchstartY = 0;
let touchendY = 0;
let wheeling;

class FullPageScroll {
    constructor(delay = 1000, starting = false) {
        this.DOM = {body: document.querySelector('body')};
        this.headerLinks = [...this.DOM.body.querySelectorAll('.header-nav__link')];
        this.sidebarLinks = [...this.DOM.body.querySelectorAll('.sidebar-nav__link')];
        this.sections = [...this.DOM.body.querySelectorAll('.section')];
        this.sectionHeight = this.DOM.body.querySelector('main').clientHeight;
        this.transitionDelay = delay;
        this.starting = starting;
    }

    siteNav() {
        this.siteNavEvents(this.headerLinks);
        this.siteNavEvents(this.sidebarLinks);
    }

    siteNavEvents(items) {
        items.forEach((item, index) => {
            const section = document.getElementById(item.dataset.href);
            item.addEventListener('click', () => {
                this.changeActivesLinks();
                this.changeActiveSection();
                this.changeStyles(section);
                this.siteNavProps(item, index, items, section);
            });

            if (index === 0) item.classList.add('is-active');
        }, this);
    }

    siteNavProps(item, index, items, section) {
        const thisItems = items;
        const thisSection = section;

        item.classList.add('is-active');
        thisSection.classList.add('in-viewport');
        thisSection.style.transform = `translateY(${0}px)`;

        if (thisItems === this.headerLinks) {
          this.sidebarLinks[index].classList.add('is-active');
        } else {
          this.headerLinks[index].classList.add('is-active');
        }
    }

    changeActivesLinks() {
        const activeHeaderLink = this.DOM.body.querySelector('.header-nav__link.is-active');
        const activeSidebarLink = this.DOM.body.querySelector('.sidebar-nav__link.is-active');

        if (activeHeaderLink) activeHeaderLink.classList.remove('is-active');
        if (activeSidebarLink) activeSidebarLink.classList.remove('is-active');
    }

    changeActiveSection() {
        const activeSection = this.DOM.body.querySelector('.section.in-viewport');
        if (activeSection) activeSection.classList.remove('in-viewport');
    }

    setStyles() {
        this.sections.forEach((el, index) => this.setStylesProps(el, index), this);
    }

    setStylesProps(el, index) {
        const thisEl = el;

        thisEl.style.transform = `translateY(${this.sectionHeight * index}px)`;
        if (index === 0) thisEl.classList.add('in-viewport');
    }

    changeStyles(active) {
        this.sections.forEach((el, index) => this.changeStylesProps(el, index, active), this);
    }

    changeStylesProps(el, index, active) {
        const thisEl = el;
        const activeIndex = this.sections.indexOf(active);
        const revert = -(activeIndex - index) * this.sectionHeight;

        thisEl.style.transform = `translateY(${revert}px)`;
        thisEl.style.transition = `transform ${this.transitionDelay}ms`;
    }

    onMouseWheel() {
        window.addEventListener( 'mousewheel',(e) => {
            if (!wheeling) this.onMoveProps(e, e.deltaY > 0);
        }, false );
    }

    onTouchMove() {
        window.addEventListener( 'touchstart',(e) => {
            touchstartY = e.changedTouches[0].screenY;
        }, false );
      window.addEventListener('touchend', (e) => {
          touchendY = e.changedTouches[0].screenY;
          if (!wheeling) this.onMoveProps(e, touchendY <= touchstartY);
      }, false);
    }

    onMoveProps(event, condition) {
        const sectionInViewport = this.DOM.body.querySelector('.section.in-viewport');
        const prevSection = sectionInViewport.previousElementSibling;
        const nextSection = sectionInViewport.nextElementSibling;

        if (condition) {
          this.toSection(nextSection, sectionInViewport);
        } else {
          this.toSection(prevSection, sectionInViewport);
        }
        clearTimeout(wheeling);
        wheeling = setTimeout(()=> { wheeling = undefined;}, 250);
    }

    toSection(another, visible) {
        if (another) {
            const anotherIndex = this.sections.indexOf(another);
            visible.classList.remove('in-viewport');
            another.classList.add('in-viewport');
            this.changeActivesLinks();
            this.headerLinks[anotherIndex].classList.add('is-active');
            this.sidebarLinks[anotherIndex].classList.add('is-active');

            this.sections.forEach((el, index) => this.changeStylesProps(el, index, another), this);
        }
    }

    loading() {
        window.addEventListener('load', () => this.DOM.body.classList.add('loaded'));
    }

    initEvents() {
        this.loading();
        this.setStyles();
        this.siteNav();
        this.onMouseWheel();
        this.onTouchMove();
    }

    start(starting) {
        this.starting = starting;
        if (starting === true) this.initEvents();
    }
}

export default FullPageScroll;
