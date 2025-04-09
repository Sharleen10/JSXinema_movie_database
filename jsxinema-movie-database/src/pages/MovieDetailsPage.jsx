// src/pages/MovieDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMovieDetails, getStreamingUrl } from '../api/movieApi';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRatings } from '../context/RatingsContext';
import RatingStars from '../components/RatingStars';
import VideoPlayer from '../components/VideoPlayer';

const MovieDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { getUserRating, rateMovie } = useRatings();
  
  const [movie, setMovie] = useState(null);
  const [streamingInfo, setStreamingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [ratingChanged, setRatingChanged] = useState(false);
  
  const favorite = movie ? isFavorite(parseInt(id)) : false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get movie details
        const movieData = await getMovieDetails(id);
        setMovie(movieData);
        
        // Get user rating if logged in
        if (user) {
          const rating = getUserRating(parseInt(id));
          setCurrentRating(rating);
        }
        
        // Get streaming info
        if (user) {
          const streamData = await getStreamingUrl(id);
          setStreamingInfo(streamData);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user, getUserRating]);

  const handleRatingChange = async (value) => {
    if (!user) {
      alert('Please log in to rate movies');
      return;
    }
    
    try {
      await rateMovie(parseInt(id), value);
      setCurrentRating(value);
      setRatingChanged(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setRatingChanged(false);
      }, 3000);
    } catch (error) {
      console.error('Error rating movie:', error);
      alert('Failed to submit rating. Please try again.');
    }
  };

  const handleFavoriteToggle = () => {
    if (!user) {
      alert('Please log in to add favorites');
      return;
    }
    
    if (favorite) {
      removeFavorite(parseInt(id));
    } else {
      addFavorite(movie);
    }
  };

  const handleWatchNow = () => {
    if (!user) {
      alert('Please log in to watch movies');
      return;
    }
    
    if (!streamingInfo?.available) {
      alert('This movie is not available for streaming');
      return;
    }
    
    setShowVideoPlayer(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!movie) {
    return <div className="not-found">Movie not found</div>;
  }

  const backdropPath = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : '/assets/no-backdrop.png';
    
  const posterPath = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : '/assets/no-poster.png';

  // Find trailer
  const trailer = movie.videos?.results.find(
    video => video.type === 'Trailer' && video.site === 'YouTube'
  );

  return (
    <div className="movie-details-page">
      <div 
        className="backdrop" 
        style={{ backgroundImage: `url(${backdropPath})` }}
      >
        <div className="backdrop-overlay"></div>
      </div>
      
      <div className="movie-details-content">
        <div className="movie-poster">
          <img src={posterPath} alt={movie.title} />
          
          {user && (
            <div className="action-buttons">
              <button 
                className={`favorite-btn ${favorite ? 'active' : ''}`}
                onClick={handleFavoriteToggle}
              >
                {favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              
              <button 
                className="watch-btn"
                onClick={handleWatchNow}
                disabled={!streamingInfo?.available}
              >
                Watch Now
              </button>
              
              {trailer && (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="trailer-btn"
                >
                  Watch Trailer
                </a>
              )}
            </div>
          )}
        </div>
        
        <div className="movie-info">
          <h1>{movie.title}</h1>
          
          <div className="movie-meta">
            <span className="release-date">{movie.release_date?.substring(0, 4)}</span>
            <span className="runtime">{movie.runtime} min</span>
            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
          </div>
          
          <div className="genres">
            {movie.genres?.map(genre => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
          
          <div className="user-rating-container">
            <h3>Your Rating</h3>
            <RatingStars 
              value={currentRating} 
              onChange={handleRatingChange} 
              readonly={!user}
            />
            {ratingChanged && (
              <div className="rating-success">Rating saved successfully!</div>
            )}
          </div>
          
          <div className="overview">
            <h3>Overview</h3>
            <p>{movie.overview}</p>
          </div>
          
          {movie.credits?.cast && (
            <div className="cast">
              <h3>Cast</h3>
              <div className="cast-list">
                {movie.credits.cast.slice(0, 6).map(person => (
                  <div key={person.id} className="cast-item">
                    <img 
                      src={person.profile_path 
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                        : '/assets/no-profile.png'
                      } 
                      alt={person.name} 
                    />
                    <div className="cast-info">
                      <span className="cast-name">{person.name}</span>
                      <span className="cast-character">{person.character}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {movie.similar?.results && movie.similar.results.length > 0 && (
            <div className="similar-movies">
              <h3>Similar Movies</h3>
              <div className="similar-grid">
                {movie.similar.results.slice(0, 4).map(similar => (
                  <Link 
                    key={similar.id} 
                    to={`/movie/${similar.id}`}
                    className="similar-movie"
                  >
                    <img 
                      src={similar.poster_path 
                        ? `https://image.tmdb.org/t/p/w200${similar.poster_path}`
                        : '/assets/no-poster.png'
                      } 
                      alt={similar.title} 
                    />
                    <span>{similar.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showVideoPlayer && streamingInfo && (
        <div className="video-player-modal">
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setShowVideoPlayer(false)}
            >
              &times;
            </button>
            <VideoPlayer 
              src={streamingInfo.streamingUrl} 
              poster={backdropPath} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetailsPage;