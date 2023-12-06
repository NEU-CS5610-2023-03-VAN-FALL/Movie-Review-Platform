import React, { useState, useEffect } from "react";
import "../style/moviesearch.css";

const MovieSearch = ({ movie }) => {
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const options = {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': '0fce791ab6msh6f1b63a932f1ed3p1ef0b5jsn414243b1e98c',
            'X-RapidAPI-Host': 'movie-database-alternative.p.rapidapi.com',
          },
        };

        const response = await fetch(
          `https://movie-database-alternative.p.rapidapi.com/?s=${encodeURIComponent(movie.title)}&r=json&page=1`,
          options
        );

        if (!response.ok) {
          throw new Error("Failed to fetch movie data");
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setError("Failed to fetch movie data");
      }
    };

    fetchMovieData();

  }, [movie]); // 

  return (
    <div className="movie-search-results-container">
      <h2>Movie Search Results</h2>
      {error && <p>{error}</p>}
      {searchResults && searchResults.Search && searchResults.Search.length > 0 && (
        <div className="movie-result">
          <p>Title: {searchResults.Search[0].Title}</p>
          <p>Year: {searchResults.Search[0].Year}</p>
          <p>imdbID: {searchResults.Search[0].imdbID}</p>
          <img
            src={searchResults.Search[0].Poster}
            alt={`Poster for ${searchResults.Search[0].Title}`}
          />
        </div>
      )}
    </div>
  );
  
   
};

export default MovieSearch;
