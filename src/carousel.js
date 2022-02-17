import {createDivWithClass} from './utilities'
class Carousel {
    /***
     * 
     * @param{HTMLElement} element
     * @param{object} options
     * @param{object} options.slideToScroll number of element to scroll througt
     * @param{object} options.slideVisible number of element visible
     */

    constructor(element, options = {}) {
        this.element = element
        this.options = Object.assign({}, {
            slidesToScroll: 2,
            slideVisible: 1,
        }, options);
        let children = [].slice.call(element.children)
        this.isMobile = false
        this.isTablet = false
        this.currentItem = 0
        this.root = createDivWithClass('carousel')
        this.container = createDivWithClass('carousel__container')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = createDivWithClass('carousel__item')
            item.appendChild(child)
            this.container.appendChild(item)
            return item
        })
        this.setStyle()
        this.createNavigation()
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
    }
    
    createNavigation() {
        let nextButton = createDivWithClass('carousel__next');
        let prevButton = createDivWithClass('carousel__prev');
        this.root.appendChild(nextButton);
        this.root.appendChild(prevButton);
        nextButton.addEventListener('click', this.next.bind(this));
        prevButton.addEventListener('click', this.prev.bind(this));
    }

    next() {
        this.gotoItem(this.currentItem + this.slideToScroll)
    }

    prev() {
        this.gotoItem(this.currentItem - this.slideToScroll)
    }

    /**
     * move the slider to target element
     * @param {number} index
     */
    gotoItem(index) {
        if (index < 0) {
            index = this.items.length - this.options.slideVisible
        } else if (index >= this.items.length) {
            index = 0
        }
        let translateX = index * -100 / this.items.length
        this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
        this.currentItem = index
    }


    setStyle() {
        let ratio = this.items.length / this.slideVisible
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = (100 / this.slideVisible / ratio) + "%")
    }
    onWindowResize() {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile) {
            this.isMobile = mobile
            this.setStyle()
        }
        let tablet = window.innerWidth < 1300
        if (tablet !== this.isTablet) {
            this.isTablet = tablet
            this.setStyle()
        }
    }

    get slideToScroll() {
        if (this.isMobile) {
            return 2
        }
        if (this.isTablet) {
            return 4
        }
        else {
            return this.options.slideToScroll
        }
    }
    get slideVisible() {
        if (this.isMobile) {
            return 2
            
        }
        if (this.isTablet) {
            return 4
        }
        else {
            return this.options.slideVisible
        }
    }

}

function instanciateCarousel(carousel) {
    new Carousel(document.querySelector(carousel), {
        slideVisible: 7,
        slideToScroll: 7
    })

}
export {Carousel, instanciateCarousel}