const axios = require('axios');

async function fetchArticleTitles() {
    const apiUrl = 'https://garasi.id/api/articles?sort=newest&limit=100';

    try {
        console.log('Loading Detik.com...');
        const response = await axios.get(apiUrl);
        const articles = response.data.data;

        return articles.map(article => article.title);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

fetchArticleTitles()
    .then(titles => {
        console.log('Titles:', titles);
    })
    .catch(error => {
        console.error('Error:', error);
    });
