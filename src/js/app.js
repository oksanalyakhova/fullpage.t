let touchstartY = 0;
let touchendY = 0;
let wheeling;

class FullPageScroll {
  constructor(config) {
    this.DOM = {body: document.querySelector('body')};
    this.content = this.DOM.body.querySelector('.out');
    this.main = this.DOM.body.querySelector('#main');
    this.sidebar = this.DOM.body.querySelector('.sidebar')
    this.headerLinks = [...this.DOM.body.querySelectorAll('.header-nav__link')];
    this.sidebarLinks = [...this.DOM.body.querySelectorAll('.sidebar-nav__link')];
    this.sections = [...this.DOM.body.querySelectorAll('.section')];
    this.sectionHeight = this.DOM.body.querySelector('main').clientHeight;
    this.ninja = this.DOM.body.querySelector('.ninja-helper');
    this.duration = config.duration || 1000;
    this.navigation = config.navigation || false;

    if (this.navigation) {
      this.content.appendChild(this.sidebar)
    } else {
      this.content.removeChild(this.sidebar)
    }
  }

  initEvents() {
    this.loading();
    this.setStyles();
    this.siteNav();
    this.onMouseWheel();
    this.onTouchMove();
    this.goTo(1);
  }

  on(type, listener) {
    if (this.listeners === undefined) this.listeners = {};

    const {listeners} = this;
    if (listeners[type] === undefined) listeners[ type ] = [];
    if (listeners[type].indexOf(listener) === - 1) listeners[ type ].push( listener );
  }

  dispatchEvent(event) {
    if (this.listeners === undefined) return;

    const ev = event;
    const {listeners} = this;
    const listenerArray = listeners[event.type];
    if (listenerArray !== undefined) {
      ev.target = this;
      const array = listenerArray.slice(0);

      for (let i = 0, l = array.length; i < l; i ++) {
        array[i].call(this, ev);
      }
    }
  }

  loading() {
    window.addEventListener('load', () => this.DOM.body.classList.add('loaded'));
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

        this.dispatchEvent({type: 'start'});
        setTimeout(() => this.dispatchEvent({type: 'end'}), this.duration);
      });
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
  }

  changeStyles(active) {
    this.sections.forEach((el, index) => this.changeStylesProps(el, index, active), this);
  }

  changeStylesProps(el, index, active) {
    const thisEl = el;
    const activeIndex = this.sections.indexOf(active);
    const revert = -(activeIndex - index) * this.sectionHeight;

    thisEl.style.transform = `translateY(${revert}px)`;
    thisEl.style.transition = `transform ${this.duration}ms`;
  }

  onMouseWheel() {
    this.main.addEventListener('wheel', (e) => {
      if (!wheeling) this.onMoveProps(e, e.deltaY > 0);
    }, false);
  }

  onTouchMove() {
    this.main.addEventListener('touchstart', (e) => {
      touchstartY = e.changedTouches[0].screenY;
    }, false);

    this.main.addEventListener('touchend', (e) => {
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
    wheeling = setTimeout(() => {
      wheeling = undefined;
    }, this.duration * 1.5);
  }

  toSection(another, visible) {
    if (another) {
      const anotherIndex = this.sections.indexOf(another);
      visible.classList.remove('in-viewport');
      another.classList.add('in-viewport');
      this.changeActivesLinks();
      this.headerLinks[anotherIndex].classList.add('is-active');
      this.sidebarLinks[anotherIndex].classList.add('is-active');

      this.dispatchEvent({type: 'start'});
      setTimeout(() => this.dispatchEvent({type: 'end'}), this.duration);

      this.sections.forEach((el, index) => this.changeStylesProps(el, index, another), this);
    }
  }

  showNinja() {
    this.ninja.style.opacity = '1';
  }

  hideNinja() {
    this.ninja.style.opacity = '0';
  }

  goTo(number) {
    this.headerLinks[number - 1].click();
  }
}

// init
const fullpage = new FullPageScroll({
  // change duration
  duration: 800,
  // show sidebar nav
  navigation: true
});
fullpage.initEvents();

// on start
fullpage.on( 'start', () => {
  fullpage.showNinja();
});

// on end
fullpage.on( 'end', () => {
  fullpage.hideNinja();
});

// go to some section
// fullpage.goTo(2);
