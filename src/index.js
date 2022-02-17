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
        this.isTablet = false
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

/**
 * Create a div and set class attribute.
 * @param {String} className 
 * @returns {HTMLElement}
 */
const createDivWithClass = (className) => {
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
const fetchbyId = async (id) => {
    const url = `http://localhost:8000/api/v1/titles/${id} `
    const res = await fetchMany([url])
    const data = res[0]
    return data
}
const generateHero = async function (url) {

    let response = await fetchMany([generateUrls(1, 1)])
    const bestMovieId = response[0].results[0].id
    const bestMovie = await fetchbyId(bestMovieId)
    const bestMovie_image = document.getElementsByClassName('bestMovie__image')[0]
    bestMovie_image.setAttribute('src', bestMovie.image_url);
    bestMovie_image.setAttribute('id', bestMovie.id)
    document.getElementsByClassName('bestMovie__title')[0].innerHTML = bestMovie.title;
    document.getElementsByClassName('bestMovie__summary')[0].innerHTML = bestMovie.description;
};



const fillSlider = async function (urls, target_id) {
    let response = await fetchMany(urls)
    let listMoviesSlider = document.getElementById(target_id)
    for (let i = 0; i < response.length; i++) {
        for (let y = 0; y < response[i].results.length; y++) {

            const listElement = createDivWithClass('item')
            listElement.setAttribute('id', response[i].results[y].id)

            const item__image = createDivWithClass('item__image')

            const image = document.createElement("img")
            image.setAttribute('src', response[i].results[y].image_url)
            item__image.setAttribute('id', response[i].results[y].id)
            item__image.appendChild(image)
            listElement.appendChild(item__image)

            const item__title = createDivWithClass('item__title')
            item__title.innerHTML = response[i].results[y].title
            listElement.appendChild(item__title)
            listMoviesSlider.appendChild(listElement)
        }
    }
}

function instanciateCarousel(carousel) {
    new Carousel(document.querySelector(carousel), {
        slideVisible: 7,
        slideToScroll: 7
    })

}

/**
 * 
 * @param {number} id of the movie
 */
async function fillModal(id) {
    //Fecting the data
    const data = await fetchbyId(id)
    //removing the content of the modal
    const modalDiv = document.getElementById("modalContent__data");
    modalDiv.innerHTML = ''

    const html_modal = `
    <div class="top">
    <div class="top__left">
        <h5>${data.title}</h5>
        <p>Sortie: <span>${data.date_published}</span></p>
        <span class="desc">
            ${data.description}
        </span>
    </div>
    <div class="top_right">
        <img src="${data.image_url}" alt="affiche ${data.title}">
    </div>
</div>
<div class="bottom">
    <div class="bottom_left">
        <p>Genres: <span>${data.genres} </span></p>
        <p>Réalisateur: <span>${data.directors} </span></p>
        <p>Acteurs: <span>${data.actors} </span></p>
    </div>
    <div class="bottom_right">
        <p><span>${data.duration} </span>min; <span>${data.imdb_score} </span> sur Imdb;</p>
        <p>Rated: <span>${data.Rated} </span></p>
        <p>Pay(s) : <span>${data.countries} </span></p>
        <p>Box office: <span>${data.worldwide_gross_income} </span></p>
    </div>
</div>
    `
    modalDiv.innerHTML = html_modal



}


async function displayModals() {

    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];

    const allImages = document.getElementsByClassName('item__image')
    for (let image of allImages) {
        image.addEventListener('click', async () => {
            const id = image.id

            fillModal(id)
            modal.style.display = "block";
        });
    }

    span.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}


async function main() {
    {
        generateHero()
        await fillSlider(generateUrls(1, 14), "carousel1")
        await instanciateCarousel('#carousel1')
        await fillSlider(generateUrls(1, 14,'Adventure'), "carousel2")
        await instanciateCarousel('#carousel2')
        await fillSlider(generateUrls(1, 14,'Sci-Fi'), "carousel3")
        await instanciateCarousel('#carousel3')
    }
    displayModals()
}


window.addEventListener('DOMContentLoaded', main)