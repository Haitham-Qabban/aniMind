import React from 'react';

const MediaCard = ({ media }) => {
    return (
        <div className="media-card">
            <div className="media-image-wrapper">
                <img
                    src={media.images.jpg.large_image_url || media.images.jpg.image_url}
                    alt={media.title}
                    loading="lazy"
                />
                <div className="match-badge">
                    {media.matchScore}% Match
                </div>
            </div>
            <div className="media-info">
                <h3 className="media-title">{media.title}</h3>
                <p className="media-reason">{media.reason}</p>
                <a href={media.url} target="_blank" rel="noopener noreferrer" className="btn-view">
                    View Details
                </a>
            </div>
        </div>
    );
};

export default MediaCard;
