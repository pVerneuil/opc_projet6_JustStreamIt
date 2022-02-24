import {fetchbyId} from './utilities';

/***
 * create and open a modal when cliking on a movie image
 * close it if the close button or any elemement ouside the modal is clicked
 */

async function displayModals() {

    let modal = document.getElementById("myModal");
    let span = document.getElementsByClassName("close")[0];

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
/**Fill the modal with the data of the film corresponding to the id
 * 
 * @param {number} id 
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
    <div class="top__right">
        <img src="${data.image_url}" alt="affiche ${data.title}">
    </div>
</div>
<div class="bottom">
    <div class="bottom__left">
        <p>Genres: <span>${data.genres} </span></p>
        <p>Réalisateur: <span>${data.directors} </span></p>
        <p>Acteurs: <span>${data.actors} </span></p>
    </div>
    <div class="bottom__right">
        <p><span>${data.duration} </span>min; <span>${data.imdb_score} </span> sur Imdb;</p>
        <p>Rated: <span>${data.Rated} </span></p>
        <p>Pay(s) : <span>${data.countries} </span></p>
        <p>Box office: <span>${data.worldwide_gross_income} </span></p>
    </div>
</div>
    `
    modalDiv.innerHTML = html_modal
}


export{fillModal, displayModals}