const BASE_URL = 'https://api.jikan.moe/v4';

/**
const BASE_URL = 'https://api.jikan.moe/v4';

/**
 * Helper to handle API responses.
 * @param {Response} response 
 * @returns {Promise<any>}
 */
const handleResponse = async (response) => {
    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    return data.data;
};

/**
 * Search for anime or manga.
 * @param {string} query - The search query.
 * @param {string} type - 'anime', 'manga', or 'manhwa'.
 * @returns {Promise<Array>} - List of search results.
 */
export const searchMedia = async (query, type = 'anime') => {
    try {
        let url = `${BASE_URL}/${type}?q=${query}&limit=10&sfw=true`;

        if (type === 'manhwa') {
            url = `${BASE_URL}/manga?type=manhwa&q=${query}&limit=10&sfw=true`;
        }

        const response = await fetch(url);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error searching media:', error);
        return [];
    }
};

/**
 * Get recommendations for a specific media ID.
 * @param {number} id - The media ID.
 * @param {string} type - 'anime', 'manga', or 'manhwa'.
 * @returns {Promise<Array>} - List of recommendations.
 */
export const getRecommendations = async (id, type = 'anime') => {
    try {
        const endpointType = type === 'manhwa' ? 'manga' : type;
        const response = await fetch(`${BASE_URL}/${endpointType}/${id}/recommendations`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        return [];
    }
};

/**
 * Get detailed information for a specific media ID.
 * @param {number} id - The media ID.
 * @param {string} type - 'anime', 'manga', or 'manhwa'.
 * @returns {Promise<Object>} - Detailed media information.
 */
export const getMediaDetails = async (id, type = 'anime') => {
    try {
        const endpointType = type === 'manhwa' ? 'manga' : type;
        const response = await fetch(`${BASE_URL}/${endpointType}/${id}/full`);
        return await handleResponse(response);
    } catch (error) {
        console.error('Error fetching media details:', error);
        return null;
    }
};
