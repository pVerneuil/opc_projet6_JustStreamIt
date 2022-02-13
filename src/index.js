import axios from 'axios';

const urlMoviesRankedByImdbScore = 'http://localhost:8000/api/v1/titles/?page=1&sort_by=-imdb_score'
const urlMoviesRankedByImdbScore2 = 'http://localhost:8000/api/v1/titles/?page=2&sort_by=-imdb_score'


// const createURL = (page,category) => {
//     let url = `http://localhost:8000/api/v1/titles/?page=${page}&sort_by=-imdb_score`;
// };


const generateHero  = async function(url) {
    let bestMovieUrl ;
    let moviesListRanked;
    try {
        const response = await axios.get(url);
        moviesListRanked = await response.data;
        console.log(moviesListRanked);
        bestMovieUrl = moviesListRanked.results[0].url;
    } catch (error) {
        console.error(error);
    }
    let bestMovie;
    try {
        const response2 = await axios.get(bestMovieUrl);
        bestMovie= await response2.data;
    } catch (error) {
        console.error(error);
    }

    document.getElementsByClassName('bestMovie__image')[0].setAttribute('src', bestMovie.image_url);
    document.getElementsByClassName('bestMovie__title')[0].innerHTML= bestMovie.title;
    document.getElementsByClassName('bestMovie__summary')[0].innerHTML= `<p>${bestMovie.description}<p/>`;
};


generateHero(urlMoviesRankedByImdbScore);

const fillSlider = async function(url) {
    const btnLeft = document.getElementById("moveLeft");
    const btnRight = document.getElementById("moveRight");
    let index=0;
    let maxMovieDisplayed = 5
    let moviesListRanked
    //
    try {
        const response = await axios.get(url);
        moviesListRanked = await response.data;
        console.log(moviesListRanked);
    } catch (error) {
        console.error(error);
    }
    let listMoviesSlider = document.getElementsByClassName('carousel__sliderMovies')[0]
    for (let i = index; i < index+maxMovieDisplayed;i++) {
        const listElement = document.createElement("LI")
        const image = document.createElement("img")
        image.setAttribute('src', moviesListRanked.results[i].image_url)
        listElement.appendChild(image)
        listMoviesSlider.appendChild(listElement)
    }
}
fillSlider(urlMoviesRankedByImdbScore);
