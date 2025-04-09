import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { rateMovie as apiRateMovie } from '../api/movieApi';

const RatingsContext = createContext();

export const RatingsProvider = ({ children }) => {
  const [userRatings, setUserRatings] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const storedRatings = localStorage.getItem(`ratings_${user.id}`);
      if (storedRatings) {
        setUserRatings(JSON.parse(storedRatings));
      }
    } else {
      setUserRatings({});
    }
  }, [user]);

  const rateMovie = async (movieId, rating) => {
    if (!user) throw new Error('Authentication required');
    
    try {
      await apiRateMovie(movieId, rating);
      
      // Update local state
      const newRatings = { ...userRatings, [movieId]: rating };
      setUserRatings(newRatings);
      localStorage.setItem(`ratings_${user.id}`, JSON.stringify(newRatings));
      
      return true;
    } catch (error) {
      console.error('Error rating movie:', error);
      throw error;
    }
  };

  const getUserRating = (movieId) => {
    return userRatings[movieId] || 0;
  };

  return (
    <RatingsContext.Provider value={{ userRatings, rateMovie, getUserRating }}>
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = () => useContext(RatingsContext);
