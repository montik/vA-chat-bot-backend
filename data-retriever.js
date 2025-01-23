import fs from 'fs';

const apiUrl = 'https://search.vitafy.de/v1/search/productsByCategory';
const params = {
    storeCode: 'vomachterhof',
    filters: '{}',
    page: 1,
    sort: 'relevance_desc',
    resultsPerPage: 50,
    debug: false,
    categoryId: 7907
};

const fetchProductsList = async () => {
    const url = new URL(apiUrl);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.hits);
        return data.initialStoreState.hits.map(({ id, name, short_description }) => ({ id, name, short_description }));
    } catch (error) {
        console.error('Fetch Error:', error.message);
    }
}

const writeProductsToFile = async () => {
    const products = await fetchProductsList();
    fs.writeFile('products.json', JSON.stringify(products, null, 2), (err) => {
        if (err) {
            console.error('Error writing to file', err);
        } else {
            console.log('Successfully wrote products to products.json');
        }
    });
}

writeProductsToFile();