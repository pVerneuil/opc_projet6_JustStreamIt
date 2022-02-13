import axios from 'axios';

const urlMoviesRankedByImdbScore = 'http://localhost:8000/api/v1/titles/?sort_by=-imdb_score'
const generateHero  = async function(url) {
    let bestMovieUrl ;
    try {
        const response = await axios.get(url);
        let moviesListRanked = await response.data.results;
        console.log(moviesListRanked);
        bestMovieUrl = moviesListRanked[0].url;
    } catch (error) {
        console.error(error);
    }
    let bestMovie;
    try {
        const response2 = await axios.get(bestMovieUrl);
        bestMovie= await response2.data;
        console.log(bestMovie);
    } catch (error) {
        console.error(error);
    }

    document.getElementsByClassName('bestMovie__image')[0].setAttribute('src', bestMovie.image_url);
    document.getElementsByClassName('bestMovie__title')[0].innerHTML= bestMovie.title;
    document.getElementsByClassName('bestMovie__summary')[0].innerHTML= `<p>${bestMovie.description}<p/>`;
};
generateHero(urlMoviesRankedByImdbScore);
