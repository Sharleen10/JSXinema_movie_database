import React, { useState, useEffect } from 'react';
import { getPopularMovies, getTopRatedMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';

const HomePage = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageData = async () => {
      try {
        setLoading(true);
        const [popularData, topRatedData] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies()
        ]);
        
        setPopularMovies(popularData.results.slice(0, 6));
        setTopRatedMovies(topRatedData.results.slice(0, 6));
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to MovieStreamHub</h1>
          <p>Watch thousands of movies online, rate them, and save your favorites!</p>
        </div>
      </section>
      
      <section className="movie-section">
        <div className="section-header">
          <h2>Popular Movies</h2>
          <a href="/movies/popular" className="see-all">See All</a>
        </div>
        <div className="movie-grid">
          {popularMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
      
      <section className="movie-section">
        <div className="section-header">
          <h2>Top Rated Movies</h2>
          <a href="/movies/top-rated" className="see-all">See All</a>
        </div>
        <div className="movie-grid">
          {topRatedMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;