import React, { useState, useEffect, useRef } from 'react';
import { searchMedia } from '../services/api';
import '../styles/animations.css';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('anime');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce search for suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const results = await searchMedia(query, type);
                setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [query, type]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query, type);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion.title);
        onSearch(suggestion.title, type);
        setShowSuggestions(false);
    };

    return (
        <div className="search-container fade-in-up" ref={wrapperRef}>
            <form onSubmit={handleSubmit} className="search-form">
                <div className="type-selector">
                    <button
                        type="button"
                        className={`type-btn ${type === 'anime' ? 'active' : ''}`}
                        onClick={() => setType('anime')}
                    >
                        Anime
                    </button>
                    <button
                        type="button"
                        className={`type-btn ${type === 'manga' ? 'active' : ''}`}
                        onClick={() => setType('manga')}
                    >
                        Manga
                    </button>
                    <button
                        type="button"
                        className={`type-btn ${type === 'manhwa' ? 'active' : ''}`}
                        onClick={() => setType('manhwa')}
                    >
                        Manhwa
                    </button>
                </div>
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 3 && setShowSuggestions(true)}
                        placeholder={`Search for an ${type}...`}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>

                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="suggestions-list fade-in">
                            {suggestions.map((item) => (
                                <li
                                    key={item.mal_id}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(item)}
                                >
                                    <img
                                        src={item.images?.jpg?.image_url}
                                        alt={item.title}
                                        className="suggestion-image"
                                    />
                                    <div className="suggestion-info">
                                        <span className="suggestion-title">{item.title}</span>
                                        <span className="suggestion-year">
                                            {item.year || (item.published?.from ? new Date(item.published.from).getFullYear() : 'N/A')}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SearchBar;
