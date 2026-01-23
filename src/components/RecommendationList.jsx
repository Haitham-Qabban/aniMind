import React from 'react';
import MediaCard from './MediaCard';

const RecommendationList = ({ recommendations }) => {
    return (
        <div className="recommendation-grid">
            {recommendations.map((rec) => (
                <MediaCard key={rec.mal_id} media={rec} />
            ))}
        </div>
    );
};

export default RecommendationList;
