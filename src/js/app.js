import FullPageScroll from './main';

class NewFullPageScroll extends FullPageScroll {
    constructor(delay = 800, starting = false) {
        super(delay, starting);
    }
}

const newFull = new NewFullPageScroll();

newFull.start(true);
newFull.sidebarLinks[2].click();


