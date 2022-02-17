import axios from 'axios';


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
/**
 * 
 * @param {number} firstPageNumber must be >0
 * @param {number} lastPageNumber must be >= firstPageNumber
 * @param {string} genre leave empty for all genre. 
 * @returns list of urls
 */
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
/**
 * 
 * @param {list} urls 
 * @returns {promise} 
 */
const fetchMany = async (urls) => {
    let data
    try {
        const res = await Promise.all(urls.map(
            url => {
                const res = axios.get(url);
                return res
            }
        ));
        data = res.map((res) => res.data);
    } catch {
        throw Error("Promise failed");
    }
    return data;
};
/**
 * 
 * @param {number} id film id
 * @returns promise
 */
const fetchbyId = async (id) => {
    const url = `http://localhost:8000/api/v1/titles/${id} `
    const res = await fetchMany([url])
    const data = res[0]
    return data
}


export{fetchMany, fetchbyId, generateUrls, createDivWithClass}