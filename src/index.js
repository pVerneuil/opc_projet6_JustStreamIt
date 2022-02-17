
import {instanciateCarousel}  from './carousel.js';
import {fetchbyId,fetchMany,generateUrls,createDivWithClass} from './utilities'
import {displayModals } from './modal.js';

/**
 * generate the hero with the film wich has the best imbd score
 */
const generateHero = async function () {
    let response = await fetchMany([generateUrls(1, 1)])
    const bestMovieId = response[0].results[0].id
    const bestMovie = await fetchbyId(bestMovieId)
    const bestMovie_image = document.getElementsByClassName('bestMovie__image')[0]
    bestMovie_image.setAttribute('src', bestMovie.image_url);
    bestMovie_image.setAttribute('id', bestMovie.id)
    document.getElementsByClassName('bestMovie__title')[0].innerHTML = bestMovie.title;
    document.getElementsByClassName('bestMovie__summary')[0].innerHTML = bestMovie.description;
};


/**
 * 
 * @param {list} urls list of the urls of the pages to fill the slider with
 * @param {string} target_id id of the target html element to fill
 */
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