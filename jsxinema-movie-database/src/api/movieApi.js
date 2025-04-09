import axios from 'axios';

const API_KEY = 'your_tmdb_api_key';
const BASE_URL = 'https://api.themoviedb.org/3';
const TOKEN = localStorage.getItem('auth_token');

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  }
});


// Add auth token to requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  
  export const searchMovies = async (query, page = 1) => {
    try {
      const response = await api.get('/search/movie', {
        params: { query, page }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  };
  
  export const getPopularMovies = async (page = 1) => {
    try {
      const response = await api.get('/movie/popular', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  };
  
  export const getTopRatedMovies = async (page = 1) => {
    try {
      const response = await api.get('/movie/top_rated', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  };
  
  export const getMovieDetails = async (id) => {
    try {
      const response = await api.get(`/movie/${id}`, {
        params: {
          append_to_response: 'videos,credits,similar,reviews'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching movie details for ID ${id}:`, error);
      throw error;
    }
  };
  
  // For streaming functionality, we'll use a mock API
// In a real app, you would integrate with a streaming provider API
export const getStreamingUrl = async (movieId) => {
    // Mock function - in real app would call your backend
    return {
      streamingUrl: `https://yourstreaming.service/stream/${movieId}`,
      quality: '1080p',
      available: true
    };
  };
  
  // For user ratings (mock API call)
  export const rateMovie = async (movieId, rating) => {
    if (!TOKEN) throw new Error('Authentication required');
    
    try {
      // In a real app, this would be a call to your backend 
      const response = await api.post(`/movie/${movieId}/rating`, {
        value: rating * 2 // Convert 5-star rating to TMDB's 10-point scale
      });
      return response.data;
    } catch (error) {
      console.error(`Error rating movie ID ${movieId}:`, error);
      throw error;
    }
  };