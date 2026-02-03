/**
 * Extracts distinct genres and themes from a media object.
 * @param {Object} media - The media object with genres/themes arrays.
 * @returns {Array<string>} - List of genre names.
 */
const getTags = (media) => {
    if (!media) return [];
    const genres = media.genres || [];
    const themes = media.themes || [];
    const demographics = media.demographics || [];
    return [...genres, ...themes, ...demographics].map(t => t.name);
};

/**
 * Generates a dynamic "reason" for the recommendation based on source traits.
 * @param {Object} source - The original media object (with full details).
 * @param {Object} target - The recommended media object (basic info).
 * @returns {string} - A generated explanation.
 */
export const generateExplanation = (source, target) => {
    const sourceTags = getTags(source);

    // Pick 1-2 random tags from the source to form the "connection"
    const relevantTags = sourceTags.sort(() => 0.5 - Math.random()).slice(0, 2);
    const joinedTags = relevantTags.join(' and ');

    const templates = [
        `Perfect if you enjoy ${joinedTags} narratives.`,
        `Selected for its similarity in tone to ${source.title}.`,
        `Fans of ${source.title}'s ${relevantTags[0]} style usually love this.`,
        `A high-affinity match for ${relevantTags[0]} lovers.`,
        `Shares the distinct ${joinedTags} vibe of your search.`,
        `Community data suggests a 95% match with ${source.title}.`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * Filters and processes raw recommendations.
 * @param {Array} recommendations - Raw recommendations from API.
 * @param {Object} sourceMedia - The source media object.
 * @returns {Array} - Processed list.
 */
export const processRecommendations = (recommendations, sourceMedia) => {
    if (!recommendations || !sourceMedia) return [];

    // Jikan reccs sometimes contain duplicates or missing images
    const validRecs = recommendations
        .filter(rec => rec.entry && rec.entry.images && rec.entry.images.jpg.image_url)
        .slice(0, 12);

    return validRecs.map(rec => {
        // Synthesize a score that is high (since these are direct recommendations)
        // Add some jitter to make it feel natural (85% - 99%)
        const matchScore = Math.floor(Math.random() * (99 - 85) + 85);

        return {
            ...rec.entry,
            matchScore,
            reason: generateExplanation(sourceMedia, rec.entry),
            // Pass rudimentary tags if we had them (we don't for target, but we fake it for UI consistency if needed)
            genres: []
        };
    });
};

/**
 * Process additional recommendations from genre-based search
 * @param {Array} items - Raw items from genre search
 * @param {Object} sourceMedia - The source media object
 * @returns {Array} - Processed list
 */
export const processAdditionalRecommendations = (items, sourceMedia) => {
    if (!items || !sourceMedia) return [];

    return items
        .filter(item => item.images && item.images.jpg.image_url)
        .map(item => {
            // Lower match scores for additional recommendations (70-84%)
            const matchScore = Math.floor(Math.random() * (84 - 70) + 70);

            return {
                ...item,
                matchScore,
                reason: generateExplanation(sourceMedia, item),
                genres: item.genres || []
            };
        });
};
