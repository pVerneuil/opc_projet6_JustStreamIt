import axios from 'axios';
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
        this.isTablet = true
        this.currentItem = 0
        this.root = createDivWithClass('carousel')
        this.container = createDivWithClass('carousel__container')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.moveCallbacks = []
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
            nextButton.addEventListener('click', this.next.bind(this) );
            prevButton.addEventListener('click', this.prev.bind(this) );
        }

        next(){
            this.gotoItem(this.currentItem + this.slideToScroll)
        }

        prev(){
            this.gotoItem(this.currentItem - this.slideToScroll)
        }

        /**
         * move the slider to target element
         * @param {number} index
         */
        gotoItem (index) {
            if (index <0){
                index = this.items.length - this.options.slideVisible
            } else if (index >= this.items.length) {
                index = 0
            }
            let translateX = index * -100 / this.items.length
            this.container.style.transform = 'translate3d(' + translateX + '%, 0, 0)'
            this.currentItem = index
        }

        
        setStyle () {
            let ratio = this.items.length / this.slideVisible
            this.container.style.width = (ratio * 100) + "%"
            this.items.forEach(item => item.style.width = (100 / this.slideVisible/ratio)+ "%")
        }
        onWindowResize(){
            let mobile = window.innerWidth <800
            if(mobile !== this.isMobile){
                this.isMobile = mobile
                this.setStyle()
            }
            let tablet = window.innerWidth <1300
            if(tablet !== this.isTablet){
                this.isTablet = tablet
                this.setStyle()
            }
        }

        get slideToScroll () {
            if (this.isMobile) {
                return 2
            }
            if (this.isTablet){
                return 4
            }
            else {
                return this.options.slideToScroll}
        }
        get slideVisible () {
            if (this.isMobile) {
                return 2
            }
            if (this.isTablet){
                return 4
            }
            else {
                return this.options.slideVisible}
        }

}


const urlMoviesRankedByImdbScore = 'http://localhost:8000/api/v1/titles/?page=1&sort_by=-imdb_score'
const urlMoviesRankedByImdbScore2 = 'http://localhost:8000/api/v1/titles/?page=2&genre=Action&sort_by=-imdb_score'

/**
 * Create a div and set class attribute.
 * @param {String} className 
 * @returns {HTMLElement}
 */
const createDivWithClass =(className) =>{
    let div = document.createElement('div')
    div.className = (className)
    return div
}

const generateUrls = (
    firstPageNumber,
    lastPageNumber,
    genre = '',
) => {
    let urlList = [];
    for (let i = firstPageNumber; i <= lastPageNumber; i++) {
        urlList.push(`http://localhost:8000/api/v1/titles/?page=${i}&genre=${genre}&sort_by=-imdb_score`);
    }
    return urlList
}

const fetchMany = async (urls) => {
    let data
    try {
        const res = await Promise.all(urls.map(
            async url => {
                const res = await axios.get(url);
                return res
            }
        ));
        data = res.map((res) => res.data);
    } catch {
        throw Error("Promise failed");
    }
    return data;
};


const generateHero = async function (url) {
    let bestMovieUrl;
    let moviesListRanked;
    try {
        const response = await axios.get(url);
        moviesListRanked = await response.data;
        // console.log(moviesListRanked);
        bestMovieUrl = moviesListRanked.results[0].url;
    } catch (error) {
        console.error(error);
    }
    let bestMovie;
    try {
        const response2 = await axios.get(bestMovieUrl);
        bestMovie = await response2.data;
    } catch (error) {
        console.error(error);
    }

    document.getElementsByClassName('bestMovie__image')[0].setAttribute('src', bestMovie.image_url);
    document.getElementsByClassName('bestMovie__title')[0].innerHTML = bestMovie.title;
    document.getElementsByClassName('bestMovie__summary')[0].innerHTML = bestMovie.description;
};


//TODO add target carousele as a parameter later
const fillSlider = async function (urls,target_id) {
    let response = await fetchMany(urls)
    let listMoviesSlider = document.getElementById(target_id)
    for (let i = 0; i < response.length; i++) {
        for (let y = 0; y < response[i].results.length; y++) {
            const listElement = document.createElement("div")
            listElement.className = "item"
            listElement.setAttribute('id', response[i].results[y].id)

            const item__image = document.createElement("div")
            item__image.className = "item__image"

            const image = document.createElement("img")
            image.setAttribute('src', response[i].results[y].image_url)
            item__image.appendChild(image)
            listElement.appendChild(item__image)

            const item__title = document.createElement("div")
            item__title.className = "item__title"
            item__title.innerHTML = response[i].results[y].title
            listElement.appendChild(item__title)
            listMoviesSlider.appendChild(listElement)
        }
    }
}



document.addEventListener('DOMContentLoaded', function () {
    generateHero(urlMoviesRankedByImdbScore)
    fillSlider(generateUrls(1, 14),"carousel1").then(() => 
    new Carousel(document.querySelector('#carousel1'), {
        slideVisible: 7,
        slideToScroll: 7
    })
    )
})

