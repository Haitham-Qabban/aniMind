import React, { useState } from 'react';
import Layout from './components/Layout';
import SearchBar from './components/SearchBar';
import RecommendationList from './components/RecommendationList';
import { searchMedia, getRecommendations } from './services/api';
import { processRecommendations } from './utils/recommendationEngine';
import './styles/animations.css';

function App() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query, type) => {
    setLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      // 1. Search for the media
      const searchResults = await searchMedia(query, type);

      if (!searchResults || searchResults.length === 0) {
        setError('No results found. Try another title.');
        setLoading(false);
        return;
      }

      // 2. Get recommendations for the top result
      const topResult = searchResults[0];
      
      const rawRecommendations = await getRecommendations(topResult.mal_id, type);

      // 3. Process with "AI" engine
      const processed = processRecommendations(rawRecommendations, topResult);
      setRecommendations(processed);

      if (processed.length === 0) {
        setError('No recommendations found for this title.');
      }

    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="hero-section fade-in-up">
        <h1 className="hero-title">AniMind</h1>
        <p className="hero-subtitle">
          Type any anime, manga, or manhwa title you like to get recommendations.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} />

      {loading && <div className="loading fade-in">Analyzing preferences...</div>}

      {error && <div className="error fade-in" style={{ color: '#ff0055' }}>{error}</div>}

      {!loading && !error && <RecommendationList recommendations={recommendations} />}
    </Layout>
  );
}

export default App;
