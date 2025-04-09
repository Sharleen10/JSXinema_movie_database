import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/movieApi';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentPage, totalPages, setTotalPages, goToPage } = usePagination();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;
      
      try {
        setLoading(true);
        const data = await searchMovies(query, currentPage);
        setMovies(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error('Error searching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, currentPage]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="search-results-page">
      <h1>Search Results for "{query}"</h1>
      
      {movies.length === 0 ? (
        <div className="no-results">
          <p>No movies found matching "{query}"</p>
        </div>
      ) : (
        <>
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;