import React, { useState, useMemo } from 'react';
import MediaCard from './MediaCard';

const RecommendationList = ({ recommendations }) => {
    const [sortBy, setSortBy] = useState('match');

    const sortedRecommendations = useMemo(() => {
        if (!recommendations || recommendations.length === 0) return [];

        const sorted = [...recommendations];

        switch (sortBy) {
            case 'match':
                // Best match first (highest matchScore)
                return sorted.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
            
            case 'newest':
                // Newest first (most recent year/aired date)
                return sorted.sort((a, b) => {
                    const yearA = a.year || a.aired?.from?.split('-')[0] || 0;
                    const yearB = b.year || b.aired?.from?.split('-')[0] || 0;
                    return yearB - yearA;
                });
            
            case 'score':
                // Highest score first
                return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
            
            case 'title':
                // Alphabetical A-Z
                return sorted.sort((a, b) => {
                    const titleA = a.title || '';
                    const titleB = b.title || '';
                    return titleA.localeCompare(titleB);
                });
            
            default:
                return sorted;
        }
    }, [recommendations, sortBy]);

    if (!recommendations || recommendations.length === 0) return null;

    return (
        <div className="recommendations-section">
            <div className="sort-controls">
                <label htmlFor="sort-select">Sort by: </label>
                <select 
                    id="sort-select"
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-dropdown"
                >
                    <option value="match">Best Match</option>
                    <option value="title">Title (A-Z)</option>
                </select>
            </div>

            <div className="recommendation-grid">
                {sortedRecommendations.map((rec) => (
                    <MediaCard key={rec.mal_id} media={rec} />
                ))}
            </div>
        </div>
    );
};

export default RecommendationList;
