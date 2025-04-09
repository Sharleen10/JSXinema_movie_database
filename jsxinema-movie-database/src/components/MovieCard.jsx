import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRatings } from '../context/RatingsContext';
import RatingStars from './RatingStars';

const MovieCard = ({ movie }) => {
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { getUserRating } = useRatings();
  
  const favorite = isFavorite(movie.id);
  const userRating = getUserRating(movie.id);
  
  const posterPath = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` 
    : '/assets/no-poster.png';

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to add favorites');
      return;
    }
    
    if (favorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  return (
    <div className="movie-card">
      <div className="movie-card-poster">
        <img src={posterPath} alt={movie.title} />
        {user && (
          <button 
            className={`favorite-btn ${favorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
          >
            {favorite ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      
      <div className="movie-card-content">
        <h3>{movie.title}</h3>
        <div className="movie-info">
          <span>{movie.release_date?.substring(0, 4)}</span>
          <span className="rating">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
        </div>
        
        {userRating > 0 && (
          <div className="user-rating">
            Your rating: <RatingStars value={userRating} readonly />
          </div>
        )}
        
        <Link to={`/movie/${movie.id}`} className="view-details">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
