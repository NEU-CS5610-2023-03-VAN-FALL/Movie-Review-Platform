import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../style/movies.css";

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/movies`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response) {
          console.error("Error fetching movies - No response received");
          return;
        }
    
        if (!response.ok) {
          // Log the HTTP error status
          console.error("Error fetching movies - HTTP status:", response.status);
          return;
        }
    
        const moviesData = await response.json();
        setMovies(moviesData);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  const handleMovieClick = (movieId) => {
    navigate(`/app/movie-reviews/${movieId}`);
  };

  return (
    <div className="movie-list-container">
      <h2>All Movies</h2>
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie.id} className="movie-item">
            <div className="movie-name">
              {movie.title}
            </div>
            <button onClick={() => handleMovieClick(movie.id)}>
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Movies;
